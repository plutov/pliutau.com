+++
type = "post"
date = "2017-05-07T14:12:12+07:00"
tags = [ "go", "golang", "practice-go" ]
title = "Practice Go: First Letter, Last Letter game"
+++

![lastletter](/lastletter.jpg)

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/lastlettergame)

### First Letter, Last Letter game

There is a game I played a lot in school. The game is called first letter, last letter. The object of this game is for one player to say a word `apple`, and for the other player to say a word that begins with the last letter of the previous word, i.e. `elephant`.

### Task

Using the following selection of English Pokemon names, generate a sequence with the highest possible number of Pokemon names where the subsequent name starts with the final letter of the previous name.

Note that names cannot be repeated.

Please write a function `Sequence(words []string) []string`.

### Run tests with benchmarks

```
go test -bench .
```
