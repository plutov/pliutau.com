package git

import (
	"os/exec"
)

type Commander interface {
	CombinedOutput(string, ...string) ([]byte, error)
}

type RealCommander struct{}

var commander Commander

func (c RealCommander) CombinedOutput(command string, args ...string) ([]byte, error) {
	return exec.Command(command, args...).CombinedOutput()
}

func GetHeadHash() ([]byte, error) {
	return commander.CombinedOutput("git", "rev-parse", "HEAD")
}
