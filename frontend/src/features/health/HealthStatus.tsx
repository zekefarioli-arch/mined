import { useEffect, useState } from 'react'
import { fetchHealth, type Health } from '../../api/health'

type State = { kind: 'loading' } | { kind: 'error' } | { kind: 'loaded'; health: Health }

export function HealthStatus() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    let active = true
    fetchHealth()
      .then((health) => active && setState({ kind: 'loaded', health }))
      .catch(() => active && setState({ kind: 'error' }))
    return () => {
      active = false
    }
  }, [])

  if (state.kind === 'loading') return <p role="status">Checking the server…</p>
  if (state.kind === 'error') return <p role="alert">Cannot reach the server.</p>
  if (state.health.status === 'ok') return <p role="status">Server is healthy.</p>
  return <p role="alert">Server is running but the database is down.</p>
}
