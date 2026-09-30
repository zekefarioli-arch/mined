import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HealthStatus } from './HealthStatus'

function mockFetch(response: Response | Error) {
  const fetchMock = vi.fn(() =>
    response instanceof Error ? Promise.reject(response) : Promise.resolve(response),
  )
  vi.stubGlobal('fetch', fetchMock)
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('HealthStatus', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('shows a healthy server', async () => {
    mockFetch(json({ status: 'ok', database: 'up' }))
    render(<HealthStatus />)
    expect(await screen.findByText('Server is healthy.')).toBeInTheDocument()
  })

  it('warns when the database is down', async () => {
    mockFetch(json({ status: 'degraded', database: 'down' }, 503))
    render(<HealthStatus />)
    expect(await screen.findByRole('alert')).toHaveTextContent('database is down')
  })

  it('shows an error when the server is unreachable', async () => {
    mockFetch(new Error('network'))
    render(<HealthStatus />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server')
  })
})
