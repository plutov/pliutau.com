+++
title = "Building REST Server with Elixir"
date = "2017-10-06T13:28:45+07:00"
type = "post"
tags = ["elixir","rest"]
+++
I always wanted to try Elixir because of it's nice Erlang ecosystem and because it's similar to Go in a lot of points. I was thinking what I can start with, and I decided to build, yes... a REST server. It took me around 1 hour to install Elixir, and build a simple REST server using [maru](https://github.com/falood/maru) RESTful framework.

I built a small `items` API using JSON and [Agent](http://elixir-lang.org/getting-started/mix-otp/agent.html) as storage. Let me go through all actions to build.

#### Prerequisites

You should only [install Elixir](https://elixir-lang.org/install.html), if you're using brew: `brew install elixir`.

#### Create new Mix project

Mix is installed together with Elixir, so you just need to run one command to create a project, Mix will create all initial files for you: config, deps, lib, tests, README.

```
mix new elixirrest
```

#### Define dependencies

As we decided to use `maru` package, we have to add it to `mix.exs` file.

{{< gist plutov a54eaddd7f108fae6190ca098bdc2b9f >}}

To get and compile dependencies you have to run this command in `elixirrest` folder:

```
mix do deps.get, compile
```

#### Configuration

Mix created a file `config/config.exs`, where we can put all configuration we need, for different environments you can create a separate file, but in our example let's have only one with port `3030`:

```
use Mix.Config

config :maru, Elixirrest.Api,
	http: [port: 3030]
```

#### API

I created a folder `lib/elixirrest` with 2 files: `api.ex`, `agent.ex`. In the first we will define our API, and second will be used for as storage worker.

API contains only 2 endpoints: GET to list all items and POST to create new item, they use Agent as storage.

```
defmodule Elixirrest.Api do
	use Maru.Router
	alias Elixirrest.Agent, as: Store

	namespace :items do
		desc "get all items"
		get do
			Store.get |> json
		end

		desc "creates an item"
		params do
			requires :name, type: String
		end
		post do
			Store.insert(params) |> json
		end
	end
end
```

#### Supervisor

To start Agent we just add it to supervision tree in `lib/elixirrest.ex`:

```
defmodule Elixirrest do
	use Maru.Router

	def start(_type, _args) do
		import Supervisor.Spec, warn: false

		children = [
			worker(Elixirrest.Agent, [])
		]

		opts = [strategy: :one_for_one, name: Elixirrest.Supervisor]
		Supervisor.start_link(children, opts)
	end
end
```

#### Run and Test

Run this command in `elixirrest` folder:

```
iex -S mix
```

If you don't see any errors you can test API endpoints:

```
curl -XPOST -d "name=test" http://localhost:3030/items
curl http://localhost:3030/items
```

I pushed project into [this repository](https://github.com/plutov/elixirrest) in case you want to check or contribute.
