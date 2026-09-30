defmodule MinedWeb.Router do
  use MinedWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", MinedWeb do
    pipe_through :api
  end
end
