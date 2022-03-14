---
title: Committed to the wrong branch? -, @{upstream}, and @{-1} to the rescue
description: Git has special named revisions that make referring to recently checked out branches and their remote branches easy.
date: 2020-02-27
tags:
  - git
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/committed-to-the-wrong-branch-upstream-and-to-the-rescue/
imageFilename: rosewood-tree.jpg
imageDetails:
  author: Reede tot Drakestein, Hendrik van, 1637?-1691.
  license:
    name: Public domain
  title: "Rosewood tree (a species of Dalbergia): branch with flowers and pods and separate sections of flowers, pod and seeds. Coloured line engraving."
  url: https://wellcomecollection.org/works/bhb5cy5v
id: 20212
---

I get into this situation sometimes. Maybe you do too. I merge feature work into a branch used to collect features, and then continue development but on that branch instead of back on the feature branch

```shell
git checkout feature
# ... bunch of feature commits ...
git push
git checkout qa-environment
git merge --no-ff --no-edit feature
git push
# deploy qa-environment to the QA remote environment
# ... more feature commits ...
# oh. I'm not committing in the feature branch like I should be
```

and have to move those commits to the feature branch they belong in and take them out of the throwaway accumulator branch

```shell
git checkout feature
git cherry-pick origin/qa-environment..qa-environment
git push
git checkout qa-environment
git reset --hard origin/qa-environment
git merge --no-ff --no-edit feature
git checkout feature
# ready for more feature commits
```

Maybe you prefer

```shell
git branch -D qa-environment
git checkout qa-environment
```

over

```shell
git checkout qa-environment
git reset --hard origin/qa-environment
```

Either way, that works. But it'd be nicer if we didn't have to type or even remember the branches' names and the remote's name. They are what is keeping this from being a context-independent string of commands you run any time this mistake happens. That's what we're going to solve here.

## Shorthands for longevity

I like to use all possible natively supported shorthands. There are two broad motivations for that.

1. Fingers have a limited number of movements in them. Save as many as possible for later in life.
2. Current research suggests that multitasking has detrimental effects on memory. Development tends to be very heavy on multitasking. Maybe relieving some of the pressure on quick-access short term memory (like knowing all relevant branch names) add up to leave a healthier memory down the line.

First up for our scenario: the `-` shorthand, which refers to the previously checked out branch. There are a few places we can't use it, but it helps a lot: (🎉 marks wins from `-`)


```shell
# USING THE "-" SHORTHAND

git checkout feature
# hack hack hack
git push
git checkout qa-environment
git merge --no-ff --no-edit -        # 🎉
git push
# hack hack hack
# whoops
git checkout -        # now on feature 🎉 
git cherry-pick origin/qa-environment..qa-environment
git push
git checkout - # now on qa-environment 🎉
git reset --hard origin/qa-environment
git merge --no-ff --no-edit -        # 🎉
git checkout -                       # 🎉
# on feature and ready for more feature commits
```

That's as far as `-` gets us. We cannot use it when cherry-picking a range

```shell
> git cherry-pick origin/-..-
fatal: bad revision 'origin/-..-'

> git cherry-pick origin/qa-environment..-
fatal: bad revision 'origin/qa-environment..-'
```

and even if we could we'd still have provide the remote's name (here, `origin`).

And doesn't apply in the later `reset --hard` command. And we cannot use it in the `branch -D && checkout` approach either, since `branch -D` does not support the `-` shorthand and once the branch is deleted `checkout` can't reach it with `-`:

```shell
# assuming that branch-a has an upstream origin/branch-a
> git checkout branch-a
> git checkout branch-b
> git checkout -
> git branch -D -
error: branch '-' not found.
> git branch -D branch-a
> git checkout -
error: pathspec '-' did not match any file(s) known to git
```

So we have to remember the remote's name (we know it's `origin` because we are devoting memory space to knowing that this isn't one of those times it's something else), the remote tracking branch's name, the local branch's name, and we're typing those all out. No good! Let's figure out some more shorthands.

## @{-<n>} is hard to say but easy to fall in love with

We can do a little better by using `@{-<n>}` (you'll also sometimes see it referred to be the older `@{-N}`). It is a special construct for referring to the nth previously checked out ref.

```shell
> git checkout branch-a
> git checkout branch-b
> git rev-parse --abbrev-rev @{-1} # the name of the previously checked out branch
branch-a
> git checkout branch-c
> git rev-parse --abbrev-rev @{-2} # the name of branch checked out before the previously checked out one
branch-a
```

Back in our scenario, we're on `qa-environment`, we switch to `feature`, and then want to refer to `qa-environment`. That's `@{-1}`! So instead of

```shell
git cherry-pick origin/qa-environment..qa-environment
```

We can do

```shell
git cherry-pick origin/qa-environment..@{-1}
```

Here's where we are (🎉 marks wins from `-`, 💥 marks the win from `@{-1}`)


```shell
# USING - AND @{-1}

git checkout feature
# hack hack hack
git push
git checkout qa-environment
git merge --no-ff --no-edit -                # 🎉
git push
# hack hack hack
# whoops
git checkout -                               # 🎉
git cherry-pick origin/qa-environment..@{-1} # 💥
git push
git checkout -                               # 🎉
git reset --hard origin/qa-environment
git merge --no-ff --no-edit -                # 🎉
git checkout -                               # 🎉
# on feature and ready for more feature commits
```

One down, two to go: we're still relying on memory for the remote's name and the remote branch's name, and we're still typing both out in full. Can we replace those with generic shorthands?

`@{-1}` is the ref itself, not the ref's name, we can't do

```shell
> git cherry-pick origin/@{-1}..@{-1}
origin/@{-1}
fatal: ambiguous argument 'origin/@{-1}': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
```

because there is no branch `origin/@{-1}`. For the same reason, `@{-1}` does not give us a generalized shorthand for the scenario's later `git reset --hard origin/qa-environment` command.

But good news!

## Do @{u} @{push}

`@{upstream}` or its shorthand `@{u}` is the remote branch a that would be pulled from if `git pull` were run. `@{push}` is the remote branch that would be pushed to if `git push` was run.

```shell
> git checkout branch-a
Switched to branch 'branch-a'
Your branch is ahead of 'origin/branch-a' by 3 commits.
  (use "git push" to publish your local commits)
> git reset --hard origin/branch-a
HEAD is now at <the SHA origin/branch-a is at>
```

we can

```shell
> git checkout branch-a
Switched to branch 'branch-a'
Your branch is ahead of 'origin/branch-a' by 3 commits.
  (use "git push" to publish your local commits)
> git reset --hard @{u}                                # <-- So Cool!
HEAD is now at <the SHA origin/branch-a is at>
```

Tacking either onto a branch name will give that branch's `@{upstream}` or `@{push}`. For example

```shell
git checkout branch-a@{u}
```

is the branch `branch-a` pulls from.

In the common workflow where a branch pulls from and pushes to the same branch, `@{upstream}` and `@{push}` will be the same, leaving `@{u}` as preferable for its terseness. `@{push}` shines in triangular workflows where you pull from one remote and push to another (see the external links below).

Going back to our scenario, it means short, portable commands with a minimum human memory footprint. (🎉 marks wins from `-`, 💥 marks the win from `@{-1}`, 😎 marks the wins from `@{u}`.)


```shell
# USING - AND @{-1} AND @{u}

git checkout feature
# hack hack hack
git push
git checkout qa-environment
git merge --no-ff --no-edit -    # 🎉
git push
# hack hack hack
# whoops
git checkout -                   # 🎉
git cherry-pick @{-1}@{u}..@{-1} # 💥😎
git push
git checkout -                   # 🎉
git reset --hard @{u}            # 😎
git merge --no-ff --no-edit -    # 🎉
git checkout -                   # 🎉
# on feature and ready for more feature commits
```

## Make the things you repeat the easiest to do

Because these commands are generalized, we can run some series of them once, maybe

```shell
git checkout - && git reset --hard @{u} && git checkout -
```

or

```shell
git checkout - && git cherry-pick @{-1}@{u}.. @{-1} && git checkout - && git reset --hard @{u} && git checkout -
```

and then those will be in the shell history just waiting to be retrieved and run again the next time, whether with CtrlR incremental search or history substring searching bound to the up arrow or however your interactive shell is configured. Or make it an alias, or even better an abbreviation if your interactive shell supports them. Save the body wear and tear, give memory a break, and level up in Git.

## And keep going

The GitHub blog has a [good primer on triangular workflows](https://github.blog/2015-07-29-git-2-5-including-multiple-worktrees-and-triangular-workflows/#improved-support-for-triangular-workflows) and how they can polish your process of contributing to external projects.

The FreeBSD Wiki has a more [in-depth article on triangular workflow process](https://wiki.freebsd.org/GitWorkflow/TriangularWorkflow) (though it doesn't know about `@{push}` and `@{upstream}`).

The construct `@{-<n>}` and the suffixes `@{push}` and `@{upstream}` are all part of the [gitrevisions spec](https://git-scm.com/docs/gitrevisions). Direct links to each:



- [`@{-}`](https://git-scm.com/docs/gitrevisions#Documentation/gitrevisions.txt-em-ltngtemegem-1em)

- [`@{push}`](https://git-scm.com/docs/gitrevisions#Documentation/gitrevisions.txt-emltbranchnamegtpushemegemmasterpushemempushem)

- [`@{upstream}`](https://git-scm.com/docs/gitrevisions#Documentation/gitrevisions.txt-emltbranchnamegtupstreamemegemmasterupstreamememuem)