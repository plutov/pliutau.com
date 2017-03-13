+++
date = "2017-02-27T10:15:26+07:00"
title = "How to mock exec.Command in Go"
tags = [ "Go", "Testing", "Golang", "Mock" ]
type = "post"
+++
In some of my projects we have code that needs to run external executables, and it's very difficult to test them, especially when your function is based on some kind of stdout parcing. So how to mock these commands in Go? Let's check how this goal is achieved in os/exec package. In [exec_test.go](https://github.com/golang/go/blob/master/src/os/exec/exec_test.go#L33) we can see a `helperCommand`. When running go tests, the go tool compiles an executable from your code, runs it and passes all the flags. Thus, while your tests are running, `os.Args[0]` is the name of the test executable. So the executable is already there and runnable, by definition.


Let's mock our function to get `git rev-parse HEAD`.
```
package git

import (
	"os/exec"
)

func GetHeadHash() ([]byte, error) {
	return exec.Command("git", "rev-parse", "HEAD").CombinedOutput()
}
```
I use a `Commander` interface with `CombinedOutput` function that accepts command string and multiple arguments.
```
type Commander interface {
	CombinedOutput(string, ...string) ([]byte, error)
}
```
And now we need 2 implementations of this interface.
```
type RealCommander struct{}

func (c RealCommander) CombinedOutput(command string, args ...string) ([]byte, error) {
	return exec.Command(command, args...).CombinedOutput()
}
```

```
const testHash = "3a9a4f7b8a8e1a62691cb3715769f03972fe5597"

type TestCommander struct{}

func (c TestCommander) CombinedOutput(command string, args ...string) ([]byte, error) {
	cs := []string{"-test.run=TestOutput", "--"}
	cs = append(cs, args...)
	cmd := exec.Command(os.Args[0], cs...)
	cmd.Env = []string{"GO_WANT_TEST_OUTPUT=1"}
	out, err := cmd.CombinedOutput()
	return out, err
}

func TestOutput(*testing.T) {
	if os.Getenv("GO_WANT_TEST_OUTPUT") != "1" {
		return
	}

	defer os.Exit(0)
	fmt.Printf(testHash)
}

func TestGetHeadHash(t *testing.T) {
	commander = TestCommander{}
	out, _ := GetHeadHash()
	if string(out) != testHash {
		t.Errorf("Wanted %s, got %s", testHash, string(out))
	}
}
```
You may find something strange in `TestCommander`, but as I explained before, this function builds up a command to run the current test file and run the `TestOutput` function passing along all the args you originally sent. This lets you do things like return different output for different commands you want to run.

You can find full version of `git.go` and `git_test.go` [here](https://github.com/plutov/hugo-blog/tree/master/go/git).
