defmodule MinedWeb.HealthController do
  use MinedWeb, :controller

  def show(conn, _params) do
    health = Mined.Health.check()

    conn
    |> put_status(if health.status == :ok, do: :ok, else: :service_unavailable)
    |> json(health)
  end
end
