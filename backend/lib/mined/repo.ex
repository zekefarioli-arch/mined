defmodule Mined.Repo do
  use Ecto.Repo,
    otp_app: :mined,
    adapter: Ecto.Adapters.Postgres
end
