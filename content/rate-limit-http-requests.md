+++
title = "Rate Limiting HTTP Requests in Go based on IP address"
date = "2019-08-09T10:52:38+02:00"
type = "post"
tags = ["golang", "http", "ratelimit"]
+++

If you are running HTTP server and want to rate limit requests to the endpoints, you can use well-maintained tools such as [github.com/didip/tollbooth](https://github.com/didip/tollbooth). But if you're building something very simple, it's not that hard to implement it on your own.

There is already an experimental Go package `x/time/rate`, which we can use.

In this tutorial, we'll create a simple middleware for rate limiting based on the user's IP address.

### Pure HTTP Server

Let's start with building a simple HTTP server, that has very simple endpoint. It could be a heavy endpoint, that's why we want to add a rate limit there.

```go
package main

import (
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", okHandler)

	if err := http.ListenAndServe(":8888", mux); err != nil {
		log.Fatalf("unable to start server: %s", err.Error())
	}
}

func okHandler(w http.ResponseWriter, r *http.Request) {
	// Some very expensive database call
	w.Write([]byte("alles gut"))
}
```

In `main.go` we start the server on `:8888` and have a single endpoint `/`.

### golang.org/x/time/rate

We will use `x/time/rate` Go package which provides a token bucket rate-limiter algorithm. [rate#Limiter](https://godoc.org/golang.org/x/time/rate#Limiter) controls how frequently events are allowed to happen. It implements a "token bucket" of size `b`, initially full and refilled at rate `r` tokens per second. Informally, in any large enough time interval, the Limiter limits the rate to r tokens per second, with a maximum burst size of b events.

Since we want to implement rate limiter per IP address, we will also need to maintain a map of limiters.

```go
package main

import (
	"sync"

	"golang.org/x/time/rate"
)

// IPRateLimiter .
type IPRateLimiter struct {
	ips map[string]*rate.Limiter
	mu  *sync.RWMutex
	r   rate.Limit
	b   int
}

// NewIPRateLimiter .
func NewIPRateLimiter(r rate.Limit, b int) *IPRateLimiter {
	i := &IPRateLimiter{
		ips: make(map[string]*rate.Limiter),
		mu:  &sync.RWMutex{},
		r:   r,
		b:   b,
	}

	return i
}

// AddIP creates a new rate limiter and adds it to the ips map,
// using the IP address as the key
func (i *IPRateLimiter) AddIP(ip string) *rate.Limiter {
	i.mu.Lock()
	defer i.mu.Unlock()

	limiter := rate.NewLimiter(i.r, i.b)

	i.ips[ip] = limiter

	return limiter
}

// GetLimiter returns the rate limiter for the provided IP address if it exists.
// Otherwise calls AddIP to add IP address to the map
func (i *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
	i.mu.Lock()
	limiter, exists := i.ips[ip]

	if !exists {
		i.mu.Unlock()
		return i.AddIP(ip)
	}

	i.mu.Unlock()

	return limiter
}
```

`NewIPRateLimiter` creates an instance of IP limiter, and HTTP server will have to call `GetLimiter` of this instance to get limiter for the specified IP (from the map or generate a new one).

### Middleware

Let's upgrade our HTTP Server and add middleware to all endpoints, so if IP has reached limit it will respond 429 Too Many Requests, otherwise, it will proceed with the request.

In the `limitMiddleware` function we call the global limiter's `Allow()` method each time the middleware receives an HTTP request. If there are no tokens left in the bucket `Allow()` will return false and we send the user a 429 Too Many Requests response. Otherwise, calling `Allow()` will consume exactly one token from the bucket and we pass on control to the next handler in the chain.

```go
package main

import (
	"log"
	"net/http"
)

var limiter = NewIPRateLimiter(1, 5)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", okHandler)

	if err := http.ListenAndServe(":8888", limitMiddleware(mux)); err != nil {
		log.Fatalf("unable to start server: %s", err.Error())
	}
}

func limitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		limiter := limiter.GetLimiter(r.RemoteAddr)
		if !limiter.Allow() {
			http.Error(w, http.StatusText(http.StatusTooManyRequests), http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func okHandler(w http.ResponseWriter, r *http.Request) {
	// Some very expensive database call
	w.Write([]byte("alles gut"))
}
```

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

```
GET http://localhost:8888/
```

And then run attack for 10 seconds with 100 requests per time unit.

```
vegeta attack -duration=10s -rate=100 -targets=vegeta.conf | vegeta report
```

As a result you will see that some requests returned 200, but most of them returned 429.
