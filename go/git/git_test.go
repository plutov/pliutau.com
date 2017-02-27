package git

import (
	"fmt"
	"os"
	"os/exec"
	"testing"
)

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
