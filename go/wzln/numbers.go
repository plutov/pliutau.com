package main

import "fmt"

func main() {
	for i := 1; i <= 100; i++ {
		w := i%3 == 0
		l := i%5 == 0

		if w {
			fmt.Print("Wize")
		}
		if l {
			fmt.Print("Line")
		}

		if !w && !l {
			fmt.Print(i)
		}

		fmt.Println()
	}
}
