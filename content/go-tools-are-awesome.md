+++
title = "Go tools are awesome"
date = "2017-12-11T10:39:55+07:00"
type = "post"
tags = ["golang"]
og_image = "/gotools.jpeg"
+++
![gotools](/gotools.jpeg)

Yes, they are. And that's why I love Go. Almost all important tools come together with Go installation, but there are also some you can install additionally depends on your needs: golint, errcheck, etc.

Let's start with standard Go tools.

### go get

The most common way to install a Go package is to use a `go get`. If you need fixed versions you may use [dep](https://github.com/golang/dep) for dependencies management. `go get` downloads the packages named by the import paths, along with their dependencies. It then installs the named packages, like `go install`.

```
go get github.com/golang/lint/golint
```

There are some helpful flags:
 - `-u` forces the tool to sync with the latest version of the repo.
 - `-d` if you just want to clone a repo to your GOPATH and skip the building and installation phase.

### go build / go install

These 2 commands compile packages and dependencies. Both `go install` and `go build` will compile the package in the current directory when ran without additional arguments. If the package is `package main`, go build will place the resulting executable in the current directory. go install will put it in `$GOPATH/bin` (using the first element of $GOPATH if you have more than one).
Additionally `go install` will install compiled dependencies in `$GOPATH/pkg`. To achieve the same effect with `go build`, use `go build -i`.
If the package is not package main, go install will compile the package and install it in `$GOPATH/pkg`.

The `go build` command lets you build an executable file for any Go-supported target platform, on your platform. This means you can test, release and distribute your application without building those executables on the target platforms you wish to use.

```
GOOS=windows GOARCH=amd64 go build github.com/mholt/caddy/caddy
```

If you are curious about the Go toolchain, or using a cross-C compiler and wondering about flags passed to the external compiler, or suspicious about a linker bug, use `-x` to see all the invocations.

```
go build -x
WORK=/var/folders/2g/_fnx086940v6k_yt88fdtqw80000gn/T/go-build614085896
mkdir -p $WORK/github.com/plutov/go-snake-telnet/_obj/
mkdir -p $WORK/github.com/plutov/go-snake-telnet/_obj/exe/
...
```

I often use `-ldflags` option when build Go programs:
 - To [optimize Go Binary Size](/optimize-go-binary-size/).
 - To set variable value during the build.

```
go build -ldflags="-X main.Version 1.0.0"
```

`go build -gcflags` used to pass flags to the Go compiler. `go tool compile -help` lists all the flags that can be passed to the compiler.

### go test

This command has a lot of options, but the ones I use often are:
 - `-race` to run [Go race detector](https://blog.golang.org/race-detector).
 - `-run` to filter tests to run by regex and the -run flag: `go test -run=FunctionName`.
 - `-bench` to run benchmarks.
 - `-cpuprofile cpu.out` writes a CPU profile to the specified file before exiting.
 - `-memprofile mem.out` writes a memory profile to the file after all tests have passed.
 - I always use `-v`. It prints the test name, its status (failed or passed), how much it took to run the test, any logs from the test case, etc.
 - `-cover` measures the percentage of lines of code that are executed while running a suite of tests.

### go list

It lists the packages named by the import paths, one per line.

### go env

Prints Go environment information:
```
go env
GOARCH="amd64"
GOBIN="/Users/pltvs/go/bin"
...
```

### go fmt

Most used tool for me, because I run it on file save. It will reformat your code based on Go's standards.

There is also `goimports` based on `gofmt` which updates your Go import lines, adding missing ones and removing unreferenced ones.

### go vet

I also run it on save, `go vet` examines Go source code and reports suspicious constructs, such as `Printf` calls whose arguments do not align with the format string.

### go generate

The `go generate` command was added in Go 1.4, "to automate the running of tools to generate source code before compilation."

The Go tool scans the files relevant to the current package for lines with a "magic comment" of the form `//go:generate command arguments`. This command does not have to do anything related to Go or code generation. For example:

```
package project

//go:generate echo Hello, Go Generate!

func Add(x, y int) int {
	return x + y
}
```

```
$ go generate
Hello, Go Generate!
```

### Tools for reading code

We spend more time reading code than writing it, and as such, tooling that helps us reading code is an important addition to the tool box of any good gopher.

### go doc / godoc

This sounds quite similar to javadoc and other similar tools, but Go documentation does not have any extra formatting rules. Everything is plain text.

For instance, we can get information about json.Encoder by running:
```
go doc json.Encoder
package json // import "encoding/json"

type Encoder struct {
        // Has unexported fields.
}
...
```

If `go doc` is able to give us information about any identifier in our GOPATH, `godoc` is able to provide full documentation for packages in text form:
```
godoc errors
use 'godoc cmd/errors' for documentation on the errors command

PACKAGE DOCUMENTATION

package errors
...
```

### Non standard go tools

Let's see what tools community created to make Gophers happy.

### golint

I also run it on file save.

```
go get -u github.com/golang/lint/golint
```

### errcheck

```
go get github.com/kisielk/errcheck
```

This tool detects when an error is silently ignored. This means that for a function that returns at least one error we are omitting to check the returned values.

Given a `foo() error` function, we'll say that:

 - `foo()` is silently omitting the error, while
 - `_ = foo()` is omitting the error explicitly.

### P.S.

Go community is very active and always creating new useful tools, please leave a comment if you know some other tools you find useful.
