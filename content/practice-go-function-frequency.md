+++
date = "2017-05-20T15:44:32+07:00"
type = "post"
tags = [ "go", "golang", "practice-go" ]
title = "Practice Go: Function Frequency"
+++

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/functionfrequency)

### Function Frequency

Given a valid Go code in `gocode.txt` file find top-3 used functions. Don't count function declaration. This is a static analysis: the question is not how often each function is actually executed at runtime, but how often it is used by the programmer.

Function format: `FunctionFrequency(gocode []byte) []string`

### Run tests with benchmarks

```
go test -bench .
```
