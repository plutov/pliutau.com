+++
date = "2017-03-10T15:41:47+07:00"
tags = [ "Go", "Golang", "practice-go" ]
title = "Practice Go: Word Ladder"
+++

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/wordladder)

### Word Ladder

Given two words and a dictionary, find the length of the shortest transformation sequence from first word to second word such that:

 - Only one letter can be changed at a time.
 - Each transformed word must exist in the dictionary.
 
Please write a function `WordLadder(from string, to string, dic []string) int` that returns the length of the shortest transformation sequence, or 0 if no such transformation sequence exists.

### Example

```
WordLadder("hot", "dog", []string{"hot", "dog", "cog", "pot", "dot"})
"hot" -> "dot" -> "dog"
3 elements in transformation sequence
```

<!--more-->
### Run tests with benchmarks

```
go test -bench .
```
