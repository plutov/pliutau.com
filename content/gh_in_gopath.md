+++
date = "2017-03-22T15:54:14+07:00"
type = "post"
tags = [ "golang", "github", "bash", "git" ]
title = "gh: a tiny tool to manage GitHub repositories in your GOPATH"
+++
As a Golang developer I have to clone a lot of packages/tools/etc into `$GOPATH/src/github.com`. Sometimes I do `go get`, sometimes it's necessary to do a combination of `mkdir` + `git clone`. So to save my time I wrote a tiny function `gh`, that actually is the same as `cd` thatbut also can close repo if it doesn't exist.

Here it is, just add it to your `~/.bashrc`:

```
gh() {
  if [[ $# -ne 2 ]]; then
    echo "USAGE: gh [user] [repo]"
    return
  fi

  GOPATH=${GOPATH:-$HOME/go}
  user_path=$GOPATH/src/github.com/$1
  local_path=$user_path/$2

  if [[ ! -d $local_path ]]; then
    git clone git@github.com:$1/$2.git $local_path
  fi

  if [[ -d $local_path ]]; then
    cd $local_path
  fi
}
```
