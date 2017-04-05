+++
date = "2017-04-05T12:25:05+07:00"
tags = [ "Go", "Golang", "practice-go" ]
title = "Practice Go: Roman Numerals"
type = "post"
+++

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/romannumerals)

Create 2 functions:

 - `Encode(n int) (string, bool)` - takes an integer as its parameter and returns a string containing the Roman numeral representation of that integer.
 - `Decode(s string) (int, bool)` - takes a Roman numeral as its argument and returns its value as a numeric decimal integer.

Second bool parameter must be `false` if Encode/Decode is unable.
### Examples

```
// MCMXC, true
Encode(1990)

// 2008, true
Decode("MMVIII")
```

### Run tests with benchmarks

```
go test -bench .
```
