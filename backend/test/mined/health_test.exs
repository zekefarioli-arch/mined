defmodule Mined.HealthTest do
  use Mined.DataCase, async: true

  test "check/0 reports ok when the database answers" do
    assert %{status: :ok, database: :up} = Mined.Health.check()
  end
end
