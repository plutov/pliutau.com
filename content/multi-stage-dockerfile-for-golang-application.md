+++
date = "2017-04-30T12:47:27+07:00"
type = "post"
tags = ["go", "golang", "docker", "dockerfile"]
title = "Multi-stage Dockerfile for Golang application"
og_image = "/multi-stage.png"
+++

![multi-stage](/multi-stage.png)

A common workaround for building Golang application in Docker is to have 2 Dockerfiles - one to perform a build and another to ship the results of the first build without  tooling in the first image. It called `Builder Pattern`.

Starting from Docker `v17.0.5` it *will* be possible to do it via single Dockerfile using multi-stage builds.

### Application

Let's start with "Hello world" application:

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello world!")
}
```

### Single Dockerfile

With multi-stage builds, a Dockerfile allows multiple FROM directives, and the image is created via the last FROM directive of the Dockerfile.

`COPY –from=0` takes the file `app` from the previous stage and copies it to the `WORKDIR`. This basically copies the compiled go binary created from the previous stage.

The `--from` flag uses a zero-based index for the stage. You either reference stages by using offsets (like `--from=0`) or by using names. To name a stage use the syntax FROM [image] as [name].

```Dockerfile
FROM golang:1.8.1

WORKDIR /go/src/github.com/plutov/golang-multi-stage/

COPY main.go .

RUN GOOS=linux go build -o app .

FROM alpine:latest
RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=0 /go/src/github.com/plutov/golang-multi-stage/app .

CMD ["./app"]
```

### Build and check size

```
docker build .
```

Container size now is small, because it contains only binary file.
```
docker ps
REPOSITORY          TAG     IMAGE ID            CREATED           SIZE

golang-multi-stage  latest  bcbbf69a9b59        6 minutes ago     6.7MB
```

### Conclusion

Once the feature is released I would switch over. But for now we can use `Builder Pattern` as a workaround.
