+++
date = "2017-07-21T15:48:14+07:00"
type = "post"
tags = [ "git", "gc" ]
title = "Garbage Collection in Git"
+++

![git-gc](/git-gc.png)

To understand git garbage collector, we need to understand how branches work. Branches are just pointers to commits that move whenever a new commit is created.

Any time you do `git commit --amend` or `git rebase` a new commit object is created. But what happens to the old one? Old commit objects stick around in the datastore. The reason you don’t see them is because there are no pointers to them.

In addition, the `git reflog` stores a list of the previous branch pointers. In other words, even if you delete a branch, the reflog still shows it.

You will lose your old objects only when you run a `git gc`, which repacks the repository into a more efficient structure. Some git commands may automatically run `git gc`.

So, you just did a `git reset --hard HEAD^` and threw out your last commit. Well, it turns out you really did need those changes. When you do a reset, the commit you threw out goes to a `dangling` state. It’s still in Git’s datastore, waiting for the next `git gc` execution to clean it up. So unless you’ve ran a `git gc` since you removed it, you can find it.

`git fsck` command will show your commits in `dangling` state.
