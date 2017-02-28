+++
date = "2017-02-28T23:50:07+07:00"
title = "Practice Go. Exercise 3: Anagrams"
tags = [ "Go", "Golang", "practice-go" ]
+++

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/anagram)

When two or more words are composed of the same characters, but in a different order, they are called [anagrams](https://en.wikipedia.org/wiki/Anagram). Write a function `FindAnagrams(dictionary []string, word string)` that will find all possible anagrams for the given string in a given dictionary.
<!--more-->
Sample anagram:
```
"Madam Curie" = "Radium came"
```

### Run tests with benchmarks

```
go test -bench .
```
