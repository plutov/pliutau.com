+++
date = "2017-08-15T23:09:17+07:00"
type = "post"
tags = ["git", "bash", "cli", "github"]
title = "o means open. Simple CLI tool to open repository in browser."

+++

Here is my small bash function! When you run it from the terminal it opens the GitHub/BitBucket/GitLab page in your browser for the git repository you are currently in. It has a short simple name `o`. I find myself doing this quite a lot as I am working with multiple repositories at the same time and switching to a browser, searching for correct link, etc.

Just type `o` :)

### How to install

```
curl https://raw.githubusercontent.com/plutov/o/master/install.sh | sh
```

### Contribution

I have a plan to improve it to support remotes with usernames inside, and to support custom Git remotes. If you have more ideas you're welcome on [this GitHub page](https://github.com/plutov/o/).
