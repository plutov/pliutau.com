+++
date = "2017-10-08T14:48:53+07:00"
tags = ["go","grpc","rest"]
title = "Benchmarking gRPC and REST in Go"
type = "post"
og_image = "/grpc-json.png"
+++
![grpc-json.png](/grpc-json.png)

Simplest possible solution for communication between services is to use JSON over HTTP. Though JSON has many obvious advantages - it’s human readable, well understood, and typically performs well - it also has its issues. In the case of internal services the structured formats, such as Google’s Protocol Buffers, are a better choice than JSON for encoding data.

gRPC uses protobuf by default, and it's faster because it's binary and it's type-safe. I coded a [demonstration project](https://github.com/plutov/benchmark-grpc-rest) to benchmark classic REST API vs same API in gRPC using Go.

This repository contains 2 equal APIs. The goal is to run benchmarks for 2 approaches and compare them. APIs have 1 endpoint to create user, containing validation of request. Request, validation and response are the same in 2 packages, so we're benchmarking only mechanism itself. Benchmarks also include response parsing.

I use Go 1.9 and results show that gRPC is **10 times faster** for my API:

```
BenchmarkGRPC-4   	   10000	    197919 ns/op
BenchmarkREST-4   	    1000	   1720124 ns/op
```

### Test it by your own

If you want to test it by yourself you can clone this [repository](https://github.com/plutov/benchmark-grpc-rest) and run the following commands:

```
glide i
go test -bench=.
```

### Conclusion

It's totally clear that for internal-only communication it's better to use gRPC, your client calls will be much cleaner, you don't have to mess with types and serialization, because gRPC does it for you.
