+++
date = "2016-09-30T14:11:48+07:00"
title = "Golang Docker Skeleton"
tags = [ "Go", "Docker" ]
type = "post"
+++
![GoDocker](/godocker.png)

I really like templates and standards in the companies or a single team. Of course each company has it's own application layout, because it depends on tools, people and goals. Also everyone wants to save a time. In the SOA century we have to create new projects, repositories more often and often, create `Dockerfile` again, think about layout, write a documentation. In this post I want to share my template created for Go applications that work in Docker, which I am using in my projects.


I called it [go-docker-skeleton](https://github.com/plutov/go-docker-skeleton).

Now when I am going to create a new Go project, I run the following commands in the clean repo:
```bash
git remote add gds git@github.com:plutov/go-docker-skeleton.git
git pull gds
```

What does it contain? I found that this layout works well for almost all kind of services, APIs, CLIs written in Go, so it saves my time for folders/files creation. Also it has the wrappers to `build` application via Docker, create `container` and even `push` it into the Docker registry. Also it has a wrapper to run your Go tests.

All commands are described in Makefile, also it has some env vars that should be configured for specific project.

- `BIN` - your binary name
- `PKG` - your package path
- `REGISTRY` - the Docker registry you want to use

All functions:
- `make` - compiles the app. This will use a Docker image to build your app, with the current directory volume-mounted into place.  This will store incremental state for the fastest possible build.
- `make container` - builds the container image.  It will calculate the image tag based on the most recent git tag, and whether the repo is "dirty" since that tag (see `make version`).
- `make push` - pushes the container image to the `REGISTRY`.
- `make test` - runs tests in `cmd`, `pkg` folders
- `make clean` - clean up.

I hope you can use it, and if you found that it doesn't work for your application - please tell me why in [Gitter](https://gitter.im/go-docker-skeleton/Lobby) or create a Pull Request.
