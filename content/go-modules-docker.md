+++
title = "Docker and Go modules"
date = "2018-12-06T10:01:43+01:00"
type = "post"
tags = ["go", "docker"]
og_image = "/modules.png"
+++
![modules](/modules.png)
As you may know Go 1.11 includes opt-in feature for versioned modules. Before go modules Gophers used dependency managers like `dep` or `glide`, but with go modules you don't need a 3rd-party manager as they are included into standard `go` toolchain.

Also modules allow for the deprecation of the GOPATH, which was a blocker for some newcomers in Go.

In this video I am going to demonstrate how to enable go modules for your program and then package it with Docker. And you will see how easy it is.

## Create a project

Let's create simple http server which will use logrus package for logging.

As I said before go modules is an opt-in feature, which can be enabled by setting environment variable `GO111MODULE=on`.

{{< gist plutov 3ffbd3e42de02aa9091f6e0312955c80 >}}

2 new files have been created in our folder: go.mod and go.sum.

{{< gist plutov 0f06052a8c4e7a403b8c21a72a93dd42 >}}

Now if we run `go build` it will download deoendencies and build a binary:

```bash
go build
./httpserver
```

## Package with Docker

Let's create a simple Dockerfile for our server.

{{< gist plutov cb33aa46837b7073c338dfe8e2d19131 >}}

```bash
docker build -t httpserver .
docker run -p 8080:8080 httpserver
```

## Cache go modules

As you can see `go build` downloads our dependencies. But what is not good here is that it will do it every time we build an image. And imagine if your project have a lot of dependencies, it will slow down your build process. Let's change something in main.go file and run build again.

To fix this we can use `go mod download` which will download dependencies first. But we should re-run it if our go.mod / go.sum files have been changed.

We can do it by copying go.mod / go.sum files into docker first, then run `go mod download`, then copy all other files and run `go build`.

{{< gist plutov 4f6d31d4a9ec699e3b689a6d10c7f7c5 >}}

## Multi-stage build

One more thing I like to do with my Dockerfiles is to use multi-stage build to reduce the size of final image. To run our server we only need a binary file, we don't need the go installed, so inside one Dockerfile we can build program first using `golang` image, and then copy only a binary from it to scratch.

{{< gist plutov d6b88fd3f4d25c357174b2afbd7dedff >}}

## Conclusion

So I think go modules is a nice feature, and you definitely should try it, I use it in all my services I write. Of course it needs some improvements, but it works well in practice.
