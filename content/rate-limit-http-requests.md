+++
title = "Rate Limiting HTTP Requests in Go based on IP address"
date = "2019-08-09T10:52:38+02:00"
type = "post"
tags = ["go", "golang", "http", "ratelimit"]
+++

If you are running HTTP server and want to rate limit requests to the endpoints, you can use well-maintained tools such as [github.com/didip/tollbooth](https://github.com/didip/tollbooth). But if you're building something very simple, it's not that hard to implement it on your own.

There is already an experimental Go package `x/time/rate`, which we can use.

In this tutorial, we'll create a simple middleware for rate limiting based on the user's IP address.

### Pure HTTP Server

Let's start with building a simple HTTP server, that has very simple endpoint. It could be a heavy endpoint, that's why we want to add a rate limit there.

{{< gist plutov 6da1f4fcccf97c0c4282d81f20ba7391 >}}

In `main.go` we start the server on `:8888` and have a single endpoint `/`.

### golang.org/x/time/rate

We will use `x/time/rate` Go package which provides a token bucket rate-limiter algorithm. [rate#Limiter](https://godoc.org/golang.org/x/time/rate#Limiter) controls how frequently events are allowed to happen. It implements a "token bucket" of size `b`, initially full and refilled at rate `r` tokens per second. Informally, in any large enough time interval, the Limiter limits the rate to r tokens per second, with a maximum burst size of b events.

Since we want to implement rate limiter per IP address, we will also need to maintain a map of limiters.

{{< gist plutov 147290e88e4cd10c2850e542df4b5031 >}}

`NewIPRateLimiter` creates an instance of IP limiter, and HTTP server will have to call `GetLimiter` of this instance to get limiter for the specified IP (from the map or generate a new one).

### Middleware

Let's upgrade our HTTP Server and add middleware to all endpoints, so if IP has reached limit it will respond 429 Too Many Requests, otherwise, it will proceed with the request.

In the `limitMiddleware` function we call the global limiter's `Allow()` method each time the middleware receives an HTTP request. If there are no tokens left in the bucket `Allow()` will return false and we send the user a 429 Too Many Requests response. Otherwise, calling `Allow()` will consume exactly one token from the bucket and we pass on control to the next handler in the chain.

{{< gist plutov dc64347e0fb611c588e927bc48eb806c >}}

### Build & Run

```
go get golang.org/x/time/rate
go build -o server .
./server
```

### Test

There is one very nice tool I like to use for HTTP load testing, called [vegeta](https://github.com/tsenart/vegeta) (which is also written in Go).

```
brew install vegeta
```

We need to create a simple config file saying what requests do we want to produce.

{{< gist plutov a71235f9822ee927975715b0a2f13edc >}}

And then run attack for 10 seconds with 100 requests per time unit.

```
vegeta attack -duration=10s -rate=100 -targets=vegeta.conf | vegeta report
```

As a result you will see that some requests returned 200, but most of them returned 429.