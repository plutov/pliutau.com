+++
date = "2017-03-02T11:25:19+07:00"
title = "How to separate Unit and Integration tests in Go"
tags = [ "golang", "testing", "payPal" ]
type = "post"
+++
Usually integration tests take long time, because they're doing real requests to real system. And it's not necessary to run them every time we type `go test`. For example we have [Golang client](https://github.com/logpacker/PayPal-Go-SDK) to work with PayPal SDK, it has some exported functions to send data to PayPal, then parse response and handle errors. So I wrote test functions to check that our client works properly with the real system, and be aware if PayPal changes response format or error codes. Also I have some client tests to check client types and validations, pure unit tests. And I want to launch only these tests when I do `go test` or when tests are triggered by CI system.

The first thing I did is that I splitted tests into 2 files (`unit_test.go` and `integration_test.go`), but you can have more files. The main idea is mark your `_test.go` files with [build constraints](https://golang.org/pkg/go/build/#hdr-Build_Constraints):

```
// +build integration

package paypalsdk
```

And run Integration tests with `tags` flag:
```
go test -tags=integration
```

When you do not pass `tags` only Unit tests will be executed:
```
go test
```
