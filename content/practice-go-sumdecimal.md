+++
date = "2017-03-20T12:32:20+07:00"
title = "Practice Go. Sum Decimal"
tags = [ "Go", "Golang", "practice-go" ]
type = "post"
+++

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/sumdecimal)

You are given a number `n`. Your task is to return the sum of the first 1000 decimal places of the square root of `n`.

### Example

The square root of `2` equals `1.4142135623...`, so the answer is calculated as `4 + 1 + 4 + 2 + 1 + ...`, 1000 digits altogether equals 4482.

```
SumDecimal(2) = 4482
```

### Run tests with benchmarks

```
go test -bench .
```
