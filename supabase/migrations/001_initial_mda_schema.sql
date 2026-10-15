-- ==============================================================================
-- MDA MONITOR SUPABASE SCHEMA & SECURITY POLICIES
-- Mass Drug Administration (MDA) Concurrent Monitoring Platform
-- ==============================================================================

-- 1. Datasets Version Table
CREATE TABLE IF NOT EXISTS public.datasets (
    id TEXT PRIMARY KEY,
    source_filename TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reporting_period TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('published', 'draft', 'archived', 'failed')),
    row_count INTEGER NOT NULL DEFAULT 0,
    district_count INTEGER NOT NULL DEFAULT 0,
    planning_unit_count INTEGER NOT NULL DEFAULT 0,
    schema_version TEXT NOT NULL DEFAULT '1.0.0',
    validation_summary JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 2. Monitoring Detail Rows Table
CREATE TABLE IF NOT EXISTS public.monitoring_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id TEXT NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
    district TEXT NOT NULL,
    planning_unit TEXT NOT NULL,
    regime TEXT DEFAULT 'IDA',
    source_row_number INTEGER,
    raw_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    sheet_percentages JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_monitoring_rows_dataset ON public.monitoring_rows(dataset_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_rows_district ON public.monitoring_rows(district);

-- 3. Dashboard Configuration Table (Stores the Active Dataset Pointer)
CREATE TABLE IF NOT EXISTS public.dashboard_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    active_dataset_id TEXT REFERENCES public.datasets(id),
    title TEXT NOT NULL DEFAULT 'MDA Concurrent Monitoring Dashboard',
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT 'system',
    indicator_definitions JSONB,
    threshold_configuration JSONB,
    CONSTRAINT single_config_row CHECK (id = 1)
);

-- 4. Authorized Administrator Allowlist Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an authorized administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

-- 1) Public Read Access (Unauthenticated & Authenticated Viewers)
-- Anyone can view the dashboard configuration
CREATE POLICY "Public can view dashboard config"
    ON public.dashboard_config FOR SELECT
    TO anon, authenticated
    USING (true);

-- Anyone can view published datasets
CREATE POLICY "Public can view published datasets"
    ON public.datasets FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- Anyone can view rows belonging to the currently published active dataset
CREATE POLICY "Public can view active monitoring rows"
    ON public.monitoring_rows FOR SELECT
    TO anon, authenticated
    USING (
      dataset_id IN (
        SELECT active_dataset_id FROM public.dashboard_config WHERE id = 1
      )
    );

-- 2) Admin Write Access (Only Authorized Admins)
CREATE POLICY "Admins have full access to datasets"
    ON public.datasets FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to monitoring rows"
    ON public.monitoring_rows FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update dashboard config"
    ON public.dashboard_config FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view admin user directory"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- ==============================================================================
-- TRANSACTIONAL ATOMIC PUBLICATION FUNCTION
-- Switches the active dataset reference atomically only after validation passes
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.publish_dataset_atomically(
    p_dataset_id TEXT,
    p_published_by TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_row_count INTEGER;
    v_dataset_exists BOOLEAN;
BEGIN
    -- Check caller is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only administrators can publish datasets.';
    END IF;

    -- Verify dataset exists
    SELECT EXISTS (SELECT 1 FROM public.datasets WHERE id = p_dataset_id)
    INTO v_dataset_exists;

    IF NOT v_dataset_exists THEN
        RAISE EXCEPTION 'Dataset % not found.', p_dataset_id;
    END IF;

    -- Verify row count
    SELECT COUNT(*) FROM public.monitoring_rows
    WHERE dataset_id = p_dataset_id
    INTO v_row_count;

    IF v_row_count = 0 THEN
        RAISE EXCEPTION 'Cannot publish dataset %: zero rows found.', p_dataset_id;
    END IF;

    -- Mark previous active dataset as archived
    UPDATE public.datasets
    SET status = 'archived'
    WHERE id = (SELECT active_dataset_id FROM public.dashboard_config WHERE id = 1);

    -- Mark target dataset as published
    UPDATE public.datasets
    SET status = 'published'
    WHERE id = p_dataset_id;

    -- Atomically switch the active pointer
    INSERT INTO public.dashboard_config (id, active_dataset_id, last_updated_at, updated_by)
    VALUES (1, p_dataset_id, timezone('utc'::text, now()), p_published_by)
    ON CONFLICT (id) DO UPDATE
    SET active_dataset_id = p_dataset_id,
        last_updated_at = timezone('utc'::text, now()),
        updated_by = p_published_by;

    RETURN jsonb_build_object(
        'success', true,
        'active_dataset_id', p_dataset_id,
        'published_by', p_published_by,
        'rows_published', v_row_count
    );
END;
$$;
