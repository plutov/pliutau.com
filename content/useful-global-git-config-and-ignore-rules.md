+++
date = "2017-04-28T10:47:24+07:00"
tags = [ "Git", "gitconfig", "gitignore" ]
title = "Useful Git global config and ignore rules"
type = "post"
og_image = "/git-pretty-log.png"
+++
![git-pretty-log](/git-pretty-log.png)

I am working with `git` every single day, from different machines and accounts. And all these hosts have the same global git configuration. I sync it using tiny bash script.

### ~/.gitconfig

I have user-specific configuration located in `~/.gitconfig`, you can check it [here](https://github.com/plutov/gitbootstrap/blob/master/.gitconfig).

Common exclude rules, ignoring temporary files, IDE files, logs, binary files, etc. You don't want to see them in repository, right?
```
[core]
    excludesfile = ~/.gitignore
```

Shortcuts for `git clone`:
```
[url "https://github.com/"]
    insteadOf = gh:
[url "https://gist.github.com/"]
    insteadOf = gist:
[url "https://bitbucket.org/"]
    insteadOf = bb:
```

For example:
```
git clone gh:plutov/gitbootstrap
```

Then I have colors setup and diff tool setup:
```
[color]
    ui = auto
    interactive = auto
[color "branch"]
    current = yellow bold
    local = green bold
    remote = cyan bold
[color "diff"]
    meta = yellow bold
    frag = magenta bold
    old = red bold
    new = green bold
    whitespace = red reverse
[color "status"]
    added = green bold
    changed = yellow bold
    untracked = red bold
[diff]
    tool = vimdiff
[difftool]
    prompt = false
[branch "master"]
    rebase = true
[branch]
    autosetuprebase = always
```

And some useful aliases:
```
[alias]
    # ...
    reh = reset --hard
    reho = reset --hard remotes/origin/HEAD
    l = log --graph --all --pretty=format:'%C(yellow)%h%C(cyan)%d%Creset %s %C(white)- %an, %ar%Creset'
    lc = log ORIG_HEAD.. --no-merges --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative
```

`git l` output:
```
git l
* 5ff823e (HEAD -> master, origin/master, origin/HEAD) apply.sh - Alex Pliutau, 2 hours ago
* fe2c694 comment user,email - Alexander Plutov, 1 year, 10 months ago
| * 1c49740 (origin/gh-pages) Tested Git versions - Alexander Plutov, 2 years, 2 months ago
| * 93541ca pre-commit docs - Alexander Plutov, 2 years, 2 months ago
| *   3d55e33 Merge branch 'master' into gh-pages - Alexander Plutov, 2 years, 2 months ago
| |\
| |/
|/
```

### How to sync these configuration between machines

I have to sync 2 files: `~/.gitconfig`, `~/.gitignore`. I have placed an `apply.sh` script that will copy these files from the [gitbootstrap](https://github.com/plutov/gitbootstrap) repository.

```
git clone git@github.com:plutov/gitbootstrap.git
cd gitbootstrap
./apply.sh
```

#### Make git work for you!
