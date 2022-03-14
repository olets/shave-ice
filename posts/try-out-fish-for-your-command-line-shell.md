---
title: Try Out Fish For Your Command Line Shell
description: Not into heavily configuring your terminal? Right out of the box, the fish shell will transform your CLI experience.
date: 2020-01-30
tags:
  - cli
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/try-out-fish-for-your-command-line-shell/
imageFilename: das-fish.jpg
imageDetails:
  author: Das, Bhawani
  title: "Fish. Watercolour by Bhawani Das, 1777/1783"
  license:
    name: Public domain
  url: https://wellcomecollection.org/works/s8zp7m9r
id: 11744
---

In the article [Configure Zsh Options & Plugins for Productivity in macOS's Default Shell]({{ "/posts/zsh-config-productivity-plugins-for-mac-oss-default-shell/"|url }}) I walked through customizing zsh's interactive shell to add what I consider key features. (An "interactive shell" is the shell as experienced in a terminal, as opposed to when writing shell scripts.) In the end we had nice history management, a shorthand for `cd`, the ability to jump to a directory we were in several `cd`s back, command completion with an interactive menu, inline suggestions, completions for various programs, an intuitive way to filter history, syntax highlighting in the terminal, and an informative prompt. In short, the result was interactive shell that felt _smart_ and helped us find and do things more quickly without any need to learn additional tools.

But getting zsh there took significant configuration. There are other approaches — Oh My Zsh, for example, is an enormous collection of zsh configurations you install in one go. Oh My Zsh did a lot to popularize zsh as a shell for people who wanted a great interactive shell experience and snazzy prompt. But it includes more customization and extension than most people need or will even discover, and as each of those confers a (usually small) performance hit some long-term users end up switching to a more paired-down configuration — that's what the previous post is.

There's a much easier way: switching to fish. fish is a shell that puts the command line experience first. Out of the box it comes with almost everything in my recommended zsh setup, and a lot more. In fact, the plugins in my recommended zsh are inspired by built-in fish features, and they don't always live up to the original.

zsh is still a wonderful shell. Its comprehensive builtins and elegant syntax make all kinds of cool programming tight. But if you spend much time running commands in a terminal, try fish there.

## Installing fish

fish is available for macOS, Linux, BSD, Windows, and as source. It's probably distributed in whatever way you expect packages for your system to be distributed in. There are links on the [fish homepage](http://fishshell.com/) (note: the homepage might be too cute for its own good. If you're looking for a starting guide, jump straight to the [Tutorial](https://fishshell.com/docs/2.3/tutorial.html)).

**On macOS**, you can install fish with Homebrew:

```
brew install fish
```

and then make it available to the system by adding `/usr/local/bin/fish` to your `/etc/shells`.

Installing fish doesn't commit you to using it. You can switch an individual session to fish by running `fish`.

Any other open sessions (i.e. other open terminal windows) and any other sessions you start won't be affected. If you want to get out of your fish session and switch it to bash or zsh or anything else just run `bash` or `zsh` etc.

If you're coming from bash, fish will automatically import your history (and [here's the procedure](https://github.com/fish-shell/fish-shell/issues/3870#issuecomment-282524208) for merging bash history into an existing fish history). If you're coming from zsh and want to migrate your history over, there's [rsalmei/zsh-history-to-fish](https://github.com/rsalmei/zsh-history-to-fish) (and [here's the procedure](https://github.com/fish-shell/fish-shell/issues/4400#issuecomment-509685728) for merging zsh history into an existing fish history).

If you decide to make fish your default shell, run `chsh -s /usr/local/bin/fish`

## Comparing fish and zsh interactive shells

Here's a rundown of the features in my recommended zsh setup. Tl;dr: fish does it out of the box. All zsh configuration instructions are given in [Configure zsh Options & Plugins for Productivity in macOS's Default Shell]({{ "/posts/zsh-config-productivity-plugins-for-mac-oss-default-shell/"|url }}).

Feature | Fish | zsh |
---|---|---
Save history to a file | **Yes!** | If configured |
Trim history | **Yes!** Limited to 256K unique commands (which is a ton). Least recently used are trimmed first | If configured. Trims from end. Can configure to trim duplicates before uniques. |
Timestamp history records | **Yes!** | If configured |
Dedupe the history | **Yes!** | If configured |
Keep space-prefixed commands out of the history | **Yes!** | If configured |
Share history across open terminals | If configured. Configure [manually](https://github.com/fish-shell/fish-shell/issues/825#issuecomment-440286038) or [with a plugin manager](https://github.com/2m/fish-history-merge) | If configured |
"auto-cd" - `mydir` is shorthand for `cd mydir` | **Yes!** | If configured |
Navigate directory stack | **Yes!** With browser-like back/forward or by index | If configured, by index. No browser-like "forward" - previous directory is always top-of-stack |
Command completions (with TAB) | **Yes!** First TAB inserts the top-ranked completion. Second opens an interactive menu of all possibilities. Menu clears if you change the input or esc | If configured. Depending on configuration, TAB either cycles through inserting the possibilities or opens an interactive menu. If you change the input, menu persists until you TAB again but is unusable |
Case insentivity | "Case correcting." fish has a [multilevel ranking](https://github.com/fish-shell/fish-shell/issues/5193#issuecomment-430498891) of how good a match something is. Key takeaway is exact matches are prefered over wrong-case matches. Decides whether to show multiple suggestions based on the strength of the available matches. | If configured. Highly customizable. |
Color coded completion menus | **Yes! Plus** additional context such as object type and size | If configured |
Suggestions as you type | **Yes!** Based on history and completions, and will not suggest commands that are in history but which are no longer available | With a plugin. Plugin does not filter out commands that are no longer available |
Program command completions (e.g. `git co<tab></tab>`) | **Yes!** For common programs. Plus simple syntax for writing your own completions, and simple support for developers to distribute completions along with software | **Yes!** For common programs. Add plugins add completions not shipped with zsh. Writing completions requires shell scripting knowledge |
History substring search | **Yes!** For example type `commit` and then use the UP and DOWN keys to navigate history records which contain "commit" | With a plugin. Binding to arrow key navigation requires additional configuration |
Syntax highlighting | **Yes!** | With a plugin |
Selection of prompts | **Yes!** Ships with over a dozen. Can install more, or write your own | Can install or write your own |

## Other great fish features

fish has a bunch of things going for it that other common shells don't. Here are a few that jump out:

- Startup and each new prompt are fast! The fish maintainers have invested time in making the interactive shell experience load quickly.

- History search, with [globbing](<https://en.wikipedia.org/wiki/Glob_(programming)>)! Run `history search "my command"` to search for instances of "my command" in your history. Or run `history search "my*gl?b"` to search for instances of "my\*gl?b".

- Abbreviations! They're similar to standard aliases, but they expand inline. If you have the abbreviation "gc" for "git commit", `gco<space></space>` will immediately be replaced with `git commit` and `gco<enter></enter>` will be replaced with `git commit` and the command will be run. This means you can save keystrokes without forgetting the full command, and your history will be more meaningful. Adding abbreviations is simple: to create that "gc"/"git commit" abbreviation, run `abbr gc git commit`. More options are available — run `abbr --help` to see them.

- Beginner-friendly documentation.

- Discussion and contribution happen [on GitHub](https://github.com/fish-shell/fish-shell), making the bar for entry low (zsh is [mailing list-based](http://zsh.sourceforge.net/Arc/mlist.html); bash has [a Savane tracker](http://savannah.gnu.org/projects/bash/); ksh is on GitHub but currently the few maintainers [have their hands full](https://github.com/att/ast/issues/1438#issuecomment-554600166) with modernizing the codebase)

- Web UI for essential configurations. fish really doesn't want you to have to be a shell scripter to fine tune your interactive shell. Run

  ```
  fish_config
  ```

  to open a browser window where you can

  - visualize and choose between various color schemes (I control this in my terminal app though, not with fish),
  - visualize and choose between prompts,
  - see all the functions built into the shell,
  - see all global variables and their values,
  - see your history and delete any records,
  - see all configured key bindings (ie keyboard shortcuts),
  - and see your abbreviations and delete any of them.

I still enjoy digging through the zsh docs and spending weekends fiddling with the configuration. If that isn't you, check out fish. It's like like switching from dollar store foam headphones to nice noise-cancelling ones, except free: you do nothing, and suddenly things you didn't know could be better are.
