import { DatasetVersion, MonitoringRow, PublishedDatasetMeta, ValidationSummary } from '../types/dataset';
import defaultActiveDataset from '../data/activeDataset.json';

const STORAGE_KEYS = {
  ACTIVE_DATASET: 'mda_monitor_active_dataset',
  VERSION_HISTORY: 'mda_monitor_version_history',
  GITHUB_CONFIG: 'mda_monitor_github_config',
  ADMIN_TOKEN: 'mda_monitor_admin_authenticated'
};

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  token: string;
}

/**
 * Retrieves the currently active dataset
 * Defaults to the bundled activeDataset.json if no local overrides exist
 */
export function getActiveDataset(): DatasetVersion {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_DATASET);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.records && parsed.records.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read dataset from localStorage, falling back to bundled dataset:', err);
  }

  // Fallback to bundled activeDataset.json
  return defaultActiveDataset as unknown as DatasetVersion;
}

/**
 * Retrieves version history
 */
export function getVersionHistory(): DatasetVersion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VERSION_HISTORY);
    if (stored) {
      const list = JSON.parse(stored);
      if (Array.isArray(list)) return list;
    }
  } catch (err) {
    console.warn('Error reading version history:', err);
  }

  // Default initial version
  const base = defaultActiveDataset as unknown as DatasetVersion;
  return [base];
}

/**
 * Publishes a new dataset version locally and into version history
 */
export function publishDatasetVersionLocally(newVersion: DatasetVersion): void {
  try {
    // 1. Set as active
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DATASET, JSON.stringify(newVersion));

    // 2. Add to history
    const history = getVersionHistory();
    const updatedHistory = [newVersion, ...history.filter(v => v.id !== newVersion.id)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.VERSION_HISTORY, JSON.stringify(updatedHistory));
  } catch (err) {
    console.error('Failed to save published dataset locally:', err);
    throw new Error('Local storage quota exceeded or storage disabled.');
  }
}

/**
 * Reverts active dataset to a specified version
 */
export function rollbackToVersion(versionId: string): DatasetVersion {
  const history = getVersionHistory();
  const target = history.find(v => v.id === versionId);
  if (!target) {
    throw new Error(`Version ${versionId} not found in history.`);
  }

  localStorage.setItem(STORAGE_KEYS.ACTIVE_DATASET, JSON.stringify(target));
  return target;
}

/**
 * Resets active dataset to the default bundled dataset
 */
export function resetToBundledDataset(): DatasetVersion {
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_DATASET);
  return defaultActiveDataset as unknown as DatasetVersion;
}

/**
 * Saves GitHub integration configuration
 */
export function saveGitHubConfig(config: GitHubConfig): void {
  localStorage.setItem(STORAGE_KEYS.GITHUB_CONFIG, JSON.stringify(config));
}

/**
 * Gets saved GitHub integration configuration
 */
export function getGitHubConfig(): GitHubConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GITHUB_CONFIG);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Commits the updated dataset JSON directly to GitHub repository via GitHub REST API
 * This triggers an automatic Vercel / GitHub Pages rebuild so the public permanent URL updates!
 */
export async function commitDatasetToGitHub(
  config: GitHubConfig,
  dataset: DatasetVersion,
  commitMessage: string
): Promise<{ success: boolean; commitUrl?: string; message: string }> {
  const { owner, repo, branch, filePath, token } = config;
  if (!owner || !repo || !token) {
    throw new Error('GitHub configuration is incomplete. Owner, repo, and Personal Access Token are required.');
  }

  const cleanPath = filePath || 'src/data/activeDataset.json';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`;

  // 1. Get existing file SHA if it exists
  let currentSha: string | undefined = undefined;
  try {
    const getRes = await fetch(`${url}?ref=${branch || 'main'}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (getRes.ok) {
      const existingData = await getRes.json();
      currentSha = existingData.sha;
    }
  } catch (e) {
    console.warn('Could not fetch existing file SHA, creating new file:', e);
  }

  // 2. Prepare Base64 payload
  const jsonContent = JSON.stringify(dataset, null, 2);
  const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));

  const payload: Record<string, any> = {
    message: commitMessage || `Update monitoring data: ${dataset.reportingPeriod || dataset.title}`,
    content: base64Content,
    branch: branch || 'main'
  };

  if (currentSha) {
    payload.sha = currentSha;
  }

  // 3. Put commit to GitHub
  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!putRes.ok) {
    const errorBody = await putRes.json().catch(() => ({}));
    throw new Error(errorBody.message || `GitHub API error (${putRes.status}): ${putRes.statusText}`);
  }

  const result = await putRes.json();
  return {
    success: true,
    commitUrl: result.commit?.html_url,
    message: 'Dataset successfully committed to GitHub repository! Production deployment will update automatically.'
  };
}

/**
 * Generates and triggers browser download of the active dataset JSON
 */
export function downloadDatasetAsJson(dataset: DatasetVersion, filename = 'activeDataset.json'): void {
  const jsonStr = JSON.stringify(dataset, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports rows as a formatted CSV string
 */
export function exportRowsToCsv(rows: MonitoringRow[], filename = 'mda_monitoring_filtered.csv'): void {
  if (rows.length === 0) return;

  const metricKeys = Object.keys(rows[0].rawMetrics || {});
  const headers = ['District', 'Planning Unit', 'Regime', ...metricKeys];

  const csvRows = [headers.join(',')];

  for (const r of rows) {
    const line = [
      `"${r.district.replace(/"/g, '""')}"`,
      `"${r.planningUnit.replace(/"/g, '""')}"`,
      `"${r.regime || 'IDA'}"`,
      ...metricKeys.map(k => r.rawMetrics[k] ?? '')
    ];
    csvRows.push(line.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
