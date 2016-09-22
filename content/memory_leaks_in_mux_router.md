+++
date = "2016-09-22T17:23:43+07:00"
title = "Memory leaks with mux.Router in Go"
tags= [ "Go", "Memory", "Profiling" ]
+++
Today we found that our web server written in Go has memory leaks and consume around 300M of memory, which is really a lot for our app. After restart it's back to ~10M but each hour increased by few more. Golang has nice built-in tools to debug and find leaks.

```go
import _ "net/http/pprof"
// ...
go func() {
	log.Println(http.ListenAndServe("localhost:6060", nil))
}()
```

```shell
go tool pprof http://localhost:6060/debug/pprof/heap
(pprof) top
...
```

I have fixed one issue with not closed response.Body, but in-use memory is still growing up. But I never thought that it can be related with `gorilla` packages. We are using `mux`, `sessions` and `context` packages.

There is our current version with memory leaking:
```golang
http.ListenAndServe(adrr, r)
```

The problem is that variables must be cleared at the end of a request, to remove all values that were stored. This can be done in an `http.Handler`, after a request was served. Just call `context.Clear()` passing the request.

It's a documented behavior, but easy to miss, also `context` package has a special wrapper function, `ClearHandler()`, which conveniently wraps an `http.Handler` to clear variables at the end of a request lifetime.

So here is an updated version of server without memory leaks:
```go
http.ListenAndServe(adrr, context.ClearHandler(r))
```
