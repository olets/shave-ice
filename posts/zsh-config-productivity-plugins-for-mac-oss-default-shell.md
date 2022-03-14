---
title: Configure Zsh Options & Plugins for Productivity in macOS's Default Shell
description: Starting with macOS 15 Catalina, zsh will be the default macOS shell. Zsh is highly configurable but configuration can be tricky. Get up and running with some essential options and plugins, and an informative prompt theme.
date: 2019-07-03
tags:
  - cli
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/zsh-config-productivity-plugins-for-mac-oss-default-shell/
imageFilename: shells.jpg
imageDetails:
  title: "Illustration of shells"
  license:
    name: Public domain
  url: https://wellcomecollection.org/works/uy4zm9t9
id: 229
---

*This is article is part of a series on interactive shells. The next article in the series is [Try Out Fish For Your Command Line Shell]({{ "/posts/try-out-fish-for-your-command-line-shell"|url }}).*


Apple has switching to **zsh** for the default macOS shell. Zsh has a lot to recommend it, and if the increased attention leads to [zsh support](https://github.com/koalaman/shellcheck/issues/809) in [shellcheck](https://www.shellcheck.net/) zsh scripters everywhere will be thrilled. The downside of zsh is it leaves interactive shell (that is, command line experience, as opposed to writing scripts) configuration up to the use. No fancy user experience like the anomolously named **fish shell** provides by default, no pretty prompt like in GitHub README screenshots, and no guidance about how to customize things. You do get that [sweet sweet zsh array syntax](http://zsh.sourceforge.net/Guide/zshguide05.html) immediately, but as the manual acknowledges that's not what everyone comes for: the discussion of arrays begins,

"This chapter will appeal above all to people who are excited by the fact that `{% raw %}print ${array[(r)${(l.${#${(O@)array//?/X}[1]}..?.)}]}{% endraw %}` prints out the longest element of the array `$array`. For the overwhelming majority that forms the rest of the population…"

(_Zsh arrrays are so cool!_) This guide is for that majority. We will see how to give the interactive terminal a highly functional prompt and will configure zsh to

- save command history to a file, with time stamps!
- keep a directory stack for quickly moving to a previous directory, in a way that aligns closely with Git's `@{-N}` syntax!
- save a few keystrokes by supporting `some/path` as shorthand for `cd some/path`!
- suggest previously-run commands as you type!
- suggest command completions for available things not already in your history!
- show suggestions in a TAB⇥- and arrow-navigatable menu!
- search the command history for any part of a previously run command! `omm`+UP↑ will find `my command` in the history!
- highlight syntax as valid and invalid!

## 1. Get the latest zsh

If you are not on Catalina or higher, zsh is not already your default shell. Either way, the copy of zsh available on macOS by default is that one that shipped with the system, which will get out of date. So the first thing to do is to install the latest version, with Homebrew.

### Install Homebrew

These are the steps to follow if you need to install Homebrew. Run `brew --version` to see if you have it already. 

1. Download Xcode from the App Store https://itunes.apple.com/us/app/xcode/id497799835?mt=12

2. Download the Xcode command line tools from https://developer.apple.com/download/more/?=command%20line%20tools. If you don't have a developer account, you'll need to sign up for one (it's free).

3. Install Homebrew by running the command shown at https://brew.sh/.

4. Install zsh with Homebrew
    1. Install zsh
        ```shell
        brew install zsh
        ```
    2. macOS only allows certain shells to be used as the default shell. They are listed in `/etc/shells`. Either add the following Homebrew zsh line to the bottom of `/etc/shells` manually ([Sublime directions](https://www.sublimetext.com/docs/3/osx_command_line.html); [VS Code directions](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line); [Atom directions](https://flight-manual.atom.io/getting-started/sections/installing-atom/#installing-atom-on-mac))
        ```shell
        /usr/local/bin/zsh
        ```

        or simply run the command

        ```shell
        sudo echo /usr/local/bin/zsh >> /etc/shells
        ```

        Note the double `>>`! A single `>` will overwrite the file, whereas `>>` will append to it. Overwriting this file may damage your system. Make sure to append.

    3. Set up the `PATH` variable so that `/user/local/bin/zsh` (the Homebrew copy of zsh) will be found before `/bin/zsh` (the system copy of zsh). Either add this line to `~/.zshrc` manually:

      ```shell
      /usr/local/bin:$PATH
      ```

      or simply run

      ```shell
      echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
      ```

    4. Make the Homebrew copy of zsh your default shell

        ```shell
        chsh -s /usr/local/bin/zsh
        ```

   5. Open a new terminal, and you should see the zsh prompt! The `%` prompt character is a giveaway, and you can confirm by running `echo $SHELL` and `which zsh` - both should return `/usr/local/bin/zsh`.

## 2. Set zsh options

Zsh has a huge number of options. See them all at http://zsh.sourceforge.net/Doc/Release/Options.html. The following configuration is a good place to start. Either add everything between `echo '` and `' >> ~/.zshrc` (or `echo "` and `" >> ~/.zshrc` ) to `~/.zshrc` manually, below the `PATH` changes, or simply run

```shell
echo '# History[ -z "$HISTFILE" ] && HISTFILE="$HOME/.zsh_history"' >> ~/.zshrc
```

```shell
echo "HISTSIZE=50000
SAVEHIST=10000
setopt extended_history
setopt hist_expire_dups_first
setopt hist_ignore_dups
setopt hist_ignore_space
setopt inc_append_history
setopt share_history
# Changing directories
setopt auto_cd
setopt auto_pushd
unsetopt pushd_ignore_dups
setopt pushdminus
# Completion
setopt auto_menu
setopt always_to_end
setopt complete_in_word
unsetopt flow_control
unsetopt menu_complete
zstyle ':completion:*:*:*:*:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-zA-Z-_}={A-Za-z_-}' 'r:|=*' 'l:|=* r:|=*'
zstyle ':completion::complete:*' use-cache 1
zstyle ':completion::complete:*' cache-path $ZSH_CACHE_DIR
zstyle ':completion:*' list-colors ''
zstyle ':completion:*:*:kill:*:processes'
list-colors '=(#b) #([0-9]#) ([0-9a-z-]#)*=01;34=0=01'
# Other
setopt prompt_subst" >> ~/.zshrc
```

### Explanation of the options

#### History options explanation

See [Zsh documentation 16.2.4: History](http://zsh.sourceforge.net/Doc/Release/Options.html#History) for documentation.

By default zsh does not write history to a file. We set it to write history to `~/.zsh_history`. And then:

- **HISTSIZE**: The number of commands to save.
- **SAVEHIST**: The history is trimmed when its length excedes SAVEHIST by 20%.
- **EXTENDED_HISTORY**: Time stamp the history, and more.
- **HIST_EXPIRE_DUPS_FIRST**: Trim duplicated commands from the history before trimming unique commands.
- **HIST_IGNORE_DUPS**: If you run the same command multiple times in a row, only add it to the history once.
- **HIST_IGNORE_SPACE**: Prefix a command with a space to keep it out of the history.
- **INC_APPEND_HISTORY**: Add commands to the history file as soon as they are run.
- **SHARE_HISTORY**: Time stamp the history, and more.

#### Changing Directories options explanations

See [Zsh documentation 16.2.1: Changing directories](http://zsh.sourceforge.net/Doc/Release/Options.html#Changing-Directories) for documentation.

We make it possible to switch to a previous directory with `cd -<directory stack position>`, where the `directory stack position` is how many directories ago you want to step back. This closely mimics [Git's `@{-N}` "previous HEAD" notation](https://git-scm.com/docs/git-checkout#Documentation/git-checkout.txt-ltbranchgt). In the following examples, note that `auto_cd` (see above) is assumed.

```shell
~% ~/dir1
~/dir1 % ~/dir2
~/dir2 % cd -2
~ %
```

Use `dirs -v` to see the directory stack:

```shell
~ % ~/dir1
~/dir1 % dirs -v
0       ~/dir1
1       ~
% ~/dir2 && ~/dir3 && ~/dir4 && ~/dir2
~/dir2 % dirs -v
0       ~/dir2
1       ~/dir4
2       ~/dir3
3       ~/dir2
4       ~/dir1
5       ~
% cd -3
% dirs -v
0       ~/dir2
1       ~/dir2
2       ~/dir4
3       ~/dir3
4       ~/dir1
5       ~
%
```

N.b: changing to a directory in the directory stack moves the selected directory stack entry to the top of the stack, rather than creating a new entry. The last `dirs -v` above was *not* the following:

```shell
0       ~/dir2
1       ~/dir2
2       ~/dir4
3       ~/dir3
4       ~/dir2 # nope!
5       ~/dir1
6       ~
```

Some will want to also `setopt pushd_ignore_dups`, which prevents duplication in the directory stack. The resulting behavior would be:

```shell
~% ~/dir1 && ~/dir2 && ~/dir1
~/dir1% dirs -v
0       ~/dir1
1       ~/dir2
2       ~
```

- **AUTO_CD**: Use the shorthand `~/Downloads` for `cd ~/Downloads`.
- **AUTOPUSH**: Keep a directory stack of all the directories you `cd` to in a session.
- **PUSHDMINUS**: Use Git-like `-N` instead of the default `+N` (e.g. `cd -2` as opposed to `cd +2`).

#### Completion options explanations

See [Zsh documentation 16.2.2: Completion](http://zsh.sourceforge.net/Doc/Release/Options.html#Completion) for documentation.

- **ALWAYS_TO_END**: Move the cursor to the end of the word after accepting a completion.
- **AUTO_MENU**: TAB⇥ to show a menu of all completion suggestions. TAB⇥ a second time to enter the menu. TAB⇥ again to circulate through the list, or use the arrow keys. ENTER to accept a completion from the menu.
- **COMPLETE_IN_WORD**: If you type TAB⇥ in the middle of a word, the cursor will move to the end of the word and zsh will open the completions menu. (I.e. type `add`, hit LEFT←, and then TAB⇥, the cursor will move to after the second `d` and completions will be shown for `add`.)
- **FLOW_CONTROL**: Disables the use of ⌃S to stop terminal output and the use of ⌃Q to resume it.
- **MENU_COMPLETE**: If set, this option prevents the completion menu from showing even if `AUTO_MENU` is set.
- The **zstyle** declaration tells zsh to complete case-insensitively, and to highlight the current completion in the menu. `cd ~/downl`TAB⇥ will autocomplete as `~/Downloads`. See [Zsh documentation 22.37 The zsh/zutil Module](http://zsh.sourceforge.net/Doc/Release/Zsh-Modules.html#The-zsh_002fzutil-Module) for documentation.
- **zstyle completion configuration**: These rules set the completion formatting and behavior. All sorts of things are possible. These rules are excerpted from Oh My Zsh. See [Zsh documentation 20.3 Completion System Configuration](http://zsh.sourceforge.net/Doc/Release/Completion-System.html#Completion-System-Configuration) for documentation.
    - the **menu select** rule shows completion suggests in a menu
    - the **matcher-list** rules make completion insensitive to case and hyphens/underscores
    - the **use-cache** rules tells zsh to use the completion cache
    - the **list-colors** rules color code the completion suggestions (for example, symlinks, directories, and files will be distinguishable by color)

#### Other option explanations

- **PROMPT_SUBST**: Adds support for command substitution. You'll need this for the suggestion plugins. See [Zsh documentation 16.2.8: Prompting](http://zsh.sourceforge.net/Doc/Release/Options.html#Prompting) for documentation.

## 3. Add plugins

There are a huge number of plugins for zsh. https://github.com/unixorn/awesome-zsh-plugins#plugins and https://github.com/unixorn/awesome-zsh-plugins#completions are great lists. Here we install four that are practically essential. As above, note the *double* `>>`s!

To add plugins you need a plugin manager. There are many out there; good options are [Antibody](https://github.com/getantibody/antibody), [zplug](https://github.com/zplug/zplug), and [Antigen](https://github.com/zsh-users/antigen). **Antibody** is currently the best option for most users: it has simple syntax and it's blazing fast*. **zplug** is great for power users, with its support for commands, binaries, conditional loading, custom sources, and local files, but it loads noticeably slower than Antibody. **Antigen** is slower than Antibody and zplug and it requires that plugin authors add special support for it, but it achieved early success and is mentioned in many plugin READMEs; you can do better these days, but you also can't get away without mentioning it.

(As you get into zsh management, you'll also see Oh My Zsh and Prezto. Both are "zsh frameworks", huge collections of settings, customizations, aliases, and scripts, with support for managing themes. Installing either will significantly increase the time it takes to load a new terminal, and will provide much more there than most users need. Advanced users will enjoy digging through the source looking for useful bits.)

It's easy to switch from one plugin manager another, so don't sweat the decision.

As above, run these commands or manually add everything between `echo '` and `' >>` / between `echo "` and `" >>`

- Either use Antibody:

  ```shell
  brew install getantibody/tap/antibody
  ```

  ```shell
  echo 'zsh-users/zsh-autosuggestions
  zsh-users/zsh-completions
  zsh-users/zsh-history-substring-search
  zsh-users/zsh-syntax-highlighting' >> ~/.zsh_plugins.txt
  ```

  ```shell
  antibody bundle < ~/.zsh_plugins.txt > ~/.zsh_plugins.sh
  ```

  ```shell
  echo 'source ~/.zsh_plugins.sh' >> ~/.zshrc
  ```

  N.b: With this setup,

  ```shell
  antibody bundle < ~/.zsh_plugins.txt > ~/.zsh_plugins.sh
  ```

  must be run again any time a change is made to `~/.zsh_plugins.txt`. See the [Antibody Install docs](https://getantibody.github.io/install/) for alternative methods, but note that this two-file method has the fastest load time.

- or use zplug:

  ```shell
  brew install zplug
  ```

  ```shell
  echo '# Init zplug
  export ZPLUG_HOME=/usr/local/opt/zplug
  # Homebrew-installed zplug
  source $ZPLUG_HOME/init.zsh
  # Plugins
  zplug "zsh-users/zsh-autosuggestions"
  zplug "zsh-users/zsh-completions"
  zplug "zsh-users/zsh-syntax-highlighting", defer:2
  zplug "zsh-users/zsh-history-substring-search", defer:3
  # Install plugins if there are plugins that have not been installed
  if ! zplug check --verbose; then
    printf "Install? [y/N]: "
    if read -q; then
      echo; zplug install
    fi
  fi
  # Load zplug
  zplug load' >> ~/.zshrc
  ```

- or use Antigen:

  ```shell
  brew install antigen
  ```

  ```shell
  echo '# Plugins
  antigen bundle zsh-users/zsh-autosuggestions
  antigen bundle zsh-users/zsh-completions
  antigen bundle zsh-users/zsh-history-substring-search
  # Apply Antigen
  antigen apply' >> ~/.zshrc
  ```

- Configure zsh-history-substring-search. Note the single quotes vs double quotes.

  ```shell
  echo "# zsh-history-substring-search key bindings
  bindkey '^[[A' history-substring-search-up
  bindkey '^[[B' history-substring-search-down" >> ~/.zshrc
  ```

- Then open a new terminal. Antibody users may get an error. Running `antibody update` will download any missing plugins.

### Explanation of the plugins

#### zsh-autosuggestions 

This plugin will suggest previously run commands as you type. Accept the suggestion by pressing the right arrow key.

https://github.com/zsh-users/zsh-autosuggestions

#### zsh-completions

Completions for the commands available within apps, with descriptions. Trigger it with TAB⇥.

https://github.com/zsh-users/zsh-completions

#### zsh-history-substring-search

By default, history searches only match the entire command. Typing `i` and then UP↑ will finds history entries that start with `i` (`if true; then echo yes; fi` would be a match, `echo hi` would not). This plugin find through all history entries that contain the input string anywhere (both would be matches).

This guide configures the UP↑ and DOWN↓ arrows to cycle through history, but you can choose any keys you like. See the project homepage for more info.

https://github.com/zsh-users/zsh-history-substring-searchzsh-syntax-highlighting

#### zsh-history-substring-search

Colors commands as you type them, making errors easy to spot.

## 4. Add a theme

There is a huge world of custom prompts —aka "themes"— for zsh interactive shells. Two popular themes are [Spaceship](https://denysdovhan.com/spaceship-prompt/) and [Powerlevel9k](https://github.com/bhilburn/powerlevel9k).

Themes can be just fun, or just pretty, but at their best they make you work fitter, happier, more productive by surfacing the information you need.

Powerlevel9k shows Git status information, time, and more, in the [Powerline](https://github.com/powerline/powerline) model of color-coded bars:

Spaceship is can show all sorts of things, and you choose which it should show. It has out of the box support for Git and Mercurial, can display the current project's versions of various tech, batter life, and much more.

My own command prompt is a modified version of Spaceship that brings in ideas from [oh-my-git](https://github.com/arialdomartini/oh-my-git) and [git-radar](https://github.com/michaeldfallen/git-radar). It shows the time and the current directory. If I'm in a Git repo it shows the status, information about the checked out branch's upstream, any tags at `HEAD`, and whether there are files with the `--assume-unchanged` or `--skip-worktree` bits set. If Node or Ruby are applicable it shows the current version. If my battery is low, it warns me. It's hard to remember how I managed before having all of that information right in front of me.

Whatever tech you use, someone has probably written a zsh prompt theme to make your life better. It might not be Powerlevel9k or Spaceship. Find the flavor of the month by searching GitHub for ["zsh prompt"](https://github.com/search?q=zsh+prompt);There are screenshots of many more at https://github.com/robbyrussell/oh-my-zsh/wiki/External-themes, and awesome-zsh-plugins [lists more than you would want to try out](https://github.com/unixorn/awesome-zsh-plugins#themes).

Trying a theme out is easy. Add the snippet for the your zsh configuration manager, and then open a new terminal or run `source ~/.zshrc`. Here's how to add Spaceship or Powerlevel9k; check out their sites to learn about their settings.

Either

```shell
# ~/.zsh_plugins.txt for Antibody
denysdovhan/spaceship-prompt
# or
bhilburn/powerlevel9k
```

and then

```shell
antibody bundle < ~/.zsh_plugins.txt > ~/.zsh_plugins.sh
```

or

```shell
# for zplug: add above the missing plugins check in ~/.zshrc
zplug "denysdovhan/spaceship-prompt", use:spaceship.zsh, from:github, as:theme
# or
zplug "bhilburn/powerlevel9k", use:powerlevel9k.zsh-theme, from:github, as:theme
```

or

```shell
# for Antigen: add above `antigen apply` in ~/.zshrcantigen theme robbyrussell/oh-my-zsh themes/robbyrussell# orantigen theme denysdovhan/spaceship
```

## Bonus: Resources for learning the zsh language

The first sentence on the zsh homepage is, "Zsh is a shell designed for interactive use, although it is also a powerful scripting language." We've seen some of what makes zsh great for interactive use. If you write shell scripts and are not limited by Bash (or POSIX) compatibility requirements, take it for a spin!

- zsh creator Peter Stephenson's [Zsh Reference Card](http://www.bash2zsh.com/zsh_refcard/refcard.pdf) is a good place to start.
- [zsh-lovers](https://grml.org/zsh/zsh-lovers.html) has a lot of example snippets
- The official documentation is at http://zsh.sourceforge.net/Doc/Release/index.html#Top.
- *From Bash to Z Shell* aka "the zsh book" is available for purchase at https://www.apress.com/us/book/9781590593769 and as a free download at https://github.com/apress/from-bash-to-z-shell.
- Add `site:https://www.zsh.org/mla/` to Google searches to search the zsh mailing list archive.