export type Health = {
  status: 'ok' | 'degraded'
  database: 'up' | 'down'
}

export async function fetchHealth(): Promise<Health> {
  const response = await fetch('/api/health')
  // The API answers 503 with a valid body when degraded, so only fail on other errors.
  if (!response.ok && response.status !== 503) {
    throw new Error(`Health check failed with status ${response.status}`)
  }
  return response.json()
}
