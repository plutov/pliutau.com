+++
date = "2017-09-27T04:44:01+07:00"
title = "Practice Go. Coins"
tags = [ "Go", "practice-go" ]
type = "post"
+++

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/coins)

### Coins

Let `Piles(n int)` represent the number of different ways in which `n` coins can be separated into piles. For example, five coins can be separated into piles in exactly seven different ways, so `Piles(5)=7`.

```
OOOOO

OOOO O

OOO OO

OOO O O

OO OO O

OO O O O

O O O O O
```

### Input

`0 < n <= 1000000`

### Run tests with benchmarks

```
go test -bench .
```
