defmodule Mined.Health do
  @moduledoc """
  Reports whether the application and its dependencies are healthy.
  """

  @type status :: %{status: :ok | :degraded, database: :up | :down}

  @spec check() :: status()
  def check do
    case database() do
      :up -> %{status: :ok, database: :up}
      :down -> %{status: :degraded, database: :down}
    end
  end

  defp database do
    case Ecto.Adapters.SQL.query(Mined.Repo, "SELECT 1", []) do
      {:ok, _} -> :up
      {:error, _} -> :down
    end
  rescue
    _ -> :down
  end
end
