+++
date = "2017-07-09T22:28:23+07:00"
title = "Using different Git emails"
tags = [ "Git" ]
type = "post"
+++
Usually at work and at home we use different Git name/email pairs, or even per project. Pushing with correct email guarantees that your commits will be authored with a correct user identity.

This configuration stored in `.gitconfig` file and looks like:

```bash
[user]
    name = Alex Pliutau
    email = home@example.com
```

Git **2.13** introduces [conditional configuration includes](https://git-scm.com/docs/git-config#_includes). For now, the only supported condition is matching the filesystem path of the repository, but that's exactly what we need in this case. You can configure two conditional includes in your home directory's **~/.gitconfig** file:

```bash
[user]
    name = Alex Pliutau
    email = home@example.com
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work
```

**~/.gitconfig-work**:

```bash
[user]
    name = Alex Pliutau
    email = alex@workdomain.com
```

Note: To check it, make sure you are in a Git directory, non-Git directories will always show the default configuration.
