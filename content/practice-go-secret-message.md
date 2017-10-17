+++
date = "2017-10-17T22:08:41+07:00"
tags = ["go"]
title = "Practice Go: Secret Message"
type = "post"
+++

I just created a new challenge in [Practice Go](https://github.com/plutov/practice-go) collection, happy to review all possible solutions and choose the best one.

### Secret Message

Create a function to decode a secret message, to do it you have to:
 - Sort the characters in the encoded string by the number of times this character appears in it (descending).
 - Now take the sorted string, and drop all the characters after (and including) the `_`. The remaining word is the answer.

### Examples

```
b_bcb_ => b_c => b
```

### How to solve

 - Each folder has a README.md file and _test.go file, check it and find what kind of function you need to implement.
 - Code this function in the separate .go file inside a package and run tests. You may use anything you want except 3rd-party packages.
 - Create a PR with one .go file.
 - We will choose the most fast and elegant solution and merge into the repo within 7 days.

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/secretmessage)

### Run tests with benchmarks

```
go test -bench .
```