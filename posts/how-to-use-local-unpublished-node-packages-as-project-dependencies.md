---
title: How to use local Node packages as project dependencies
description: Test packages that have not been published to a registry, without getting caught in the pitfalls of npm and yarn's built-in solutions.
date: 2019-06-10
tags:
  - cli
  - npm
  - yarn
  - node
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/how-to-use-local-unpublished-node-packages-as-project-dependencies/
imageFilename: tea-crate.jpg
imageDetails:
  author: Auer, Alois, 1813-1869
  license:
    name: Public domain
  title: "A man writes on sealed crates of tea, ready for export. Painting by a Chinese artist, ca. 1850"
  url: https://wellcomecollection.org/works/dj3vse2z
id: 10426
---

There are times when you want to install a local package as a project dependency. You might be writing a package for general distribution; or maybe you are contributing to an open source package, or a private personal package, or something internal to your team. You are working on local changes and you need to test them out before you commit, let alone before you open a pull request or deploy an update. What is the best way to add the local copy of the package to a local project for real work testing?

*(No time to be reading things? Scroll to the end for the tldr.)*

You can push your updates to a remote, and add that version as a dependency. For example with a Github repo you can do `npm install` or `yarn add` a `<remote url>[#<ref>]` (for Github repos there is the shorthand `<user or org>/<repo>[#<ref>]`). But that requires an internet connection, and the time to push updates, and you will have to reinstall the package in the project with every change.

There are `npm add relative/path` and `yarn add file:relative/path`, which copy the package directory over to the project's node_modules. The npm command does not install dependencies. Neither responds to updates you make to the package. Plus using a relative path can get unwieldy with `../`s.

There are `npm link` and `yarn link`. Both add a dependency as local symlink. ([`npm link` docs](https://docs.npmjs.com/cli/link), [`yarn link` docs](https://yarnpkg.com/en/docs/cli/link).) But this solution has [technical complications](https://github.com/yarnpkg/yarn/issues/1761), and the npm and the yarn implimentations give people trouble (as of this writing there are about 40 open [`npm link` issues](https://npm.community/search?q=npm%20link) and over 150 open [`yarn link` issues](https://github.com/yarnpkg/yarn/issues?utf8=✓&q=is%3Aissue+is%3Aopen+"yarn+link")). If you have tried to use symlinked dependencies while developing a package you've probably run into into a stumbling block, whether simply an unexpected `unlink` behavior, trouble with peer dependencies, or something bigger.

So what to do? The answer for me is [@whitecolor](https://medium.com/@_whitecolor)'s [**yalc**](https://github.com/whitecolor/yalc).

yalc maintains its own local "store", at `~/.yalc`. Publish a package with yalc, and a full copy of the package is copied to the store. Install a package from the yalc store, and the project will install that copy much like it would install a package from an external registry. Update a package published to the yalc store, and the update is now available in the dependent projects; you can even publish and automatically update dependent projects with a single command. To keep things from colliding, yalc signs each published version with a hash. And yalc can store as many versions of a package (that's the `package.json` `version`) as you want.

yalc makes it easy to develop and test packages locally, in an intuitive way. It meets the common need you might expect `(npm|yarn) link` to meet. yalc has a number of other useful features too — head over to [its README](https://github.com/whitecolor/yalc) to learn all about workspace-friendly `add`ing, advanced Git use, and more.

Here's how to use yalc to manage local packages:

## Install yalc

Install `yalc`

```shell
$ npm install -g yalc # or `yarn global add yalc`
```

*(Note: here `$` is used to represent the command prompt)*

## Publish a package to your local yalc store

In the package you're developing

```shell
# in the in-development package's directory
$ yalc publish
```

## Add the package as a dependency from the yalc store

In the dependent project

```shell
# in the dependent project's directory
$ yalc add <dependency name>
```

If you look in your dependent project's `package.json` you will see that the dependency has been added, with a `file:.yalc/` path, e.g.

```json
"dependencies": {
  "my-package": "file:.yalc/my-package"
}
```

yalc also addes the `yalc.lock` file, which lists the project dependencies added with yalc. After `yalc add`ing `my-package`, `yalc.lock` in the dependent project's root directory will look something like

```javascript
{
  "version": "v1",
  "packages": {
    "my-package": {
      "signature": "...", // a hash identifying the version of the dependency in yalc's store
      "file": true // type of yalc connection
    }
  }
}
```

yalc does not install dependency packages, so if the package under development has its own `package.json` dependencies they will need to be installed in the test project as a second step:

```shell
# in the dependent project's directory
$ npm install # or yarn
```

As of this writing, there is [a bug](https://github.com/whitecolor/yalc/issues/21) where yalc dependencies are not given the correct permissions:

```shell
# in the dependent package's directory
$ <some command that relies on my-project>

path/to/test-project/node_modules/.bin/my-package
/bin/sh: path/to/test-project/node_modules/.bin/my-package: Permission denied
error Command failed with exit code 126.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

Fix this by updating the permissions on the reported problem file:

```shell
$ chmod +x <path from error>
# e.g. chmod +x path/to/test-project/node_modules/.bin/my-package
```

## Push package changes to local dependent projects

After saving changes to the package under development, simply run `yalc push` in the package's root directory to publish a new version to the yalc store and automatically update all local projects that `yalc add`ed it to the new version.

```shell
# in the in-development package's directory
$ yalc push # shorthand for yalc publish --push

Pushing my-package@<version> in path/to/my-package
Pushing my-package@<version>-<hash8> added ==> path/to/my-project/node_modules/package.
Pushing my-package@<version> in path/to/my-project2
Pushing my-package@<version>-<hash8> added ==> path/to/my-project2/node_modules/package.
my-package@<version>-<hash8> published in store.
```

If you do not want to automatically update the dependency in all projects where it has been `yalc add`ed (for example if you have multiple projects with distinct versions of the dependency), use `yalc publish` and `yalc update`:

```shell
# in the in-development package's directory
$ yalc publish
```

```shell
# in the dependent project's directory
$ yalc update
```

If necessary, set the dependency's permission in the test project after every `yalc push`, `yalc publish --push`, and `yalc update` (see above).

When the dependency's dependencies change, reinstall the dependent project's dependencies (ie. `npm i` or `yarn`).

As of this writing `yalc push` will (very rarely) fail to update the `package.json` in the dependent project's copy of the package. If this happens, running `yalc update` in the dependent project's directory should fix it:

```shell
# in the in-development package's directory
$ yalc push
```

```shell
# in the dependent project's directory
$ cd path/to/test-project
$ <test command>
Error: …
$ cat node_modules/my-package/package.json
# hey it does not reflect the latest changes to path/to/my-package/package.json!
$ yalc update
$ cat node_modules/my-package/package.json
# fixed!
$ <test command>
# that error is cleared
```

If that does not do it, start with a clean slate: `remove` the yalc dependency and re-`add` it:

```shell
# in the dependent project's directory
$ yalc remove my-package
$ yalc add my-package
# and then install dependencies
```

## tldr;

["In a nutshell"](https://www.youtube.com/watch?v=A8M8qTclbho) the basic yalc workflow is

```shell
# one-time setup
# --------------

$ npm install -g yalc # or yarn global add yalc


# use (or switch to) yalc
# -----------------------

$ cd path/to/package
my-package $ yalc publish

# if project already has my-package as a dependency already
project $ npm uninstall -S my-package # (or `yarn remove my-package`)

project $ yalc add my-package

# if my-package has dependencies
project $ npm install # (or `yarn`)


# develop
# -------

project $
# test project, updating permissions first if yalc issue 21 has not been fixed

# go off and hack package

my-package $ yalc push

# if my-package's dependencies changed, install dependencies
project $ npm install # (or `yarn`)

# test project, hack package, yalc push package, test project, etc
```
