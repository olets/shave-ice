---
title: Automating build/deploy CI/CD with GitHub Actions
description: Use GitHub Actions to build every branch and to deploy the trunk when it builds successfully. We look at an example of a Node site deployed via FTP, with workflows that can be adapted to your needs.
date: 2022-01-26
tags:
  - github actions
  - automation
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/automating-build-deploy-ci-cd-with-github-actions/
imageFilename: automatic-lathe.jpg
imageDetails:
  author: Rousseau, Nicolas Louis
  license:
    name: Public domain
  title: "Carpentry: an automatic lathe in plan and elevations, with examples of finished turning. Engraving by N. L. Rousseau after Gallet"
  url: https://wellcomecollection.org/works/phf9uvuq
id: 2474
---

Projects hosted on GitHub can implement [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) (CI), [continuous deployment](https://en.wikipedia.org/wiki/Continuous_deployment) (CD), and [continuous delivery](https://en.wikipedia.org/wiki/Continuous_delivery) (the other CD) with **GitHub Actions** workflows. This works in **public and private repos**. (There are [tiered limits](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions) for storage and time.)

In this article we will look at the **basic structure** of GitHub Actions workflows, and then build out support to **test all branches** and then **deploy production builds** to a remote server **via FTP**. No GitHub Actions background is necessary, but a basic understanding [YAML](https://en.wikipedia.org/wiki/YAML) will be helpful.

(Why deploy via FTP? In my case, I needed to deploy a static generated Nuxt app to production. Using a service like Netlify or Vercel was not an option, and I had FTP access to the server but not SSH access (I hope you aren't in the same situation). But the FTP part of this is just a small detail; the final deploy workflow is **flexible and can be adapted** to your needs.)

## Goal

The goal is to build every branch when it is pushed, and to deploy the trunk branch when it builds successfully.

To get there with GitHub Actions we'll use two workflows: one which builds, and one which builds and then deploys. They will have these features:

- The "build" (**continuous integration**, for features) workflow runs when any branch other than the trunk is pushed
- The "build" workflow caches Node dependencies, a **performance** optimization that can speed up the build job.
- The "build and then deploy" (**continuous integration** and **continuous deployment**, for production) workflow runs when the trunk branch is pushed
- The "build and then deploy" workflow's deploy job runs **only if** the build step passes. This prevents bugs from being deployed.
- The "build and then deploy" workflow's build job calls the "build" workflow. This makes the setup easier to **maintain**— the build job is written once, and used everywhere.
- The "build and then deploy" workflow's deploy job deploys an artifact produced by the build step.*

\* In GitHub Actions, using an artifact from one job in another requires uploading the artifact to GitHub as a file. The file is available for download after the workflow completes (by default for 90 days). That means that even though supporting manual **continuous delivery** at an arbitrary time is not a goal of the solution we'll build, we do get pretty close to it by continuously delivering the built artifact to the continuous deployment workflow; if continuous delivery separate from automated deployment is a goal of *yours*, this file will be useful: where I have "build" and "build and deploy" workflows and configure the file to live just long enough for automated deployment, use just a "build" workflow and configure it to live as long as your process requires.

## Concept

Let's look at annotated barebones workflows. These are missing build and deploy steps, but they illustrate the structure. Working examples come next.

### Build workflow

- Runs when called from another workflow
- Runs when any branch other than `main` is pushed
- Runs on Linux
- Caches Node dependencies
- If the build steps are successful, uploads a build artifact

```yaml
# ./.github/workflows/build.yml

name: build

on:
  # support calling this workflow from other workflows
  # https://docs.github.com/en/actions/learn-github-actions/reusing-workflows#creating-a-reusable-workflow
  workflow_call:
  # support running this workflow on push events
  # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#onpushpull_requestbranchestags
  push:
    # run this workflow when pushing any branch other than main
    branches-ignore: main

jobs:
  build:
    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idruns-on
    runs-on: ubuntu-latest
    
    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps
    steps:
      # build steps go here
      # - name: My first build step
      #   …

      - name: Upload artifact
        # https://github.com/actions/upload-artifact
        uses: actions/upload-artifact@v2
        with:
          name: <the name>
          path: <the path>
          # the artifact is only needed for the duration of the build-deploy workflow
          # adapt to your needs
          # https://github.com/actions/upload-artifact#retention-period
          retention-days: 1
```

### Build and deploy workflow

- When `main` is pushed, runs the "build" workflow's build job. This code reuse makes our setup easier to maintain
- If the build job succeeds, runs deploy steps

```yaml
# ./.github/workflows/build-deploy.yml

name: build-deploy

on:
  # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#onpushpull_requestbranchestags
  push:
    # run this workflow when pushing main
    branches: main

jobs:
  use-build:
    # adapt to point to the current repo
    # https://docs.github.com/en/actions/learn-github-actions/reusing-workflows#calling-a-reusable-workflow
    uses: <owner>/<repo>/.github/workflows/build.yml@main
    # that's all - jobs that call a reusable workflow can do nothing else

  deploy:
    # only run the 'deploy' job if the 'use-build' job passes
    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idneeds
    needs: use-build

    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idruns-on
    runs-on: ubuntu-latest

    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps
    steps:
      - name: Download use-build artifact
        # https://github.com/actions/download-artifact
        uses: actions/download-artifact@v2
        with:
          name: <the name>
          path: <the path>

      # deploy steps go here
      # - name: My first deploy step
      #   …
```

## Working example

Now let's see it for real, building a Node app and deploying it via FTP. (If you aren't uploading via FTP, your deploy step(s) will be different.)

Build steps have been added to the `build` workflow. Deploy steps have been added to the `build-deploy` workflow.

```yaml
# ./.github/workflows/build.yml

name: build

on:
  # support calling this workflow from other workflows
  # https://docs.github.com/en/actions/learn-github-actions/reusing-workflows#creating-a-reusable-workflow
  workflow_call:
  # support running this workflow on push events
  # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#onpushpull_requestbranchestags
  push:
    branches-ignore: main

jobs:
  build:
    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idruns-on
    runs-on: ubuntu-latest

    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps
    steps:
      # https://github.com/actions/checkout
      - name: Checkout
        # 2.4.0 was the latest at the time of writing
        uses: actions/checkout@v2.4.0
    
      # a standard step for GitHub actions on Node
      # https://github.com/actions/setup-node
      - name: Set up node env
        # 2.5.1 was the latest at the time of writing
        uses: actions/setup-node@v2.5.1
        with:
          # specify the version appropriate to your project
          # setup-node can also read the version from a Node version file. see the setup-node docs for details
          node-version: 16.3.2
          # cache installed dependencies for best performance. yarn and pnpm are also supported  
          cache: npm

      - name: Install dependencies
        # For Node 16: https://docs.npmjs.com/cli/v8/commands/npm-ci
        # for other Node versions, look up the npm version at https://nodejs.org/en/download/releases/
        run: npm ci --prefer-offline --no-audit
        
      # lint steps, test steps, etc go here. adapt to your needs
      - name: Lint
        run: npm run lint

      # build! adapt to your needs
      - name: Generate
        run: npm run generate

      # upload the artifact for use in either CD
      # here, the 'dist' directory is compressed and uploaded to GitHub asset storage as 'build-artifact'
      - name: Upload artifact
        # https://github.com/actions/upload-artifact
        uses: actions/upload-artifact@v2
        with:
          # the name to save the compressed asset as
          name: build-artifact
          # the directory or file to upload. adapt to your needs
          path: dist
          # the artifact is only needed for the duration of the build-deploy workflow
          # adapt to your needs
          # https://github.com/actions/upload-artifact#retention-period
          retention-days: 1
```

```yaml
# ./.github/workflows/build-deploy.yml

name: build-deploy

on:
  # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#onpushpull_requestbranchestags
  push:
    branches: main

jobs:
  use-build:
    # adapt to point to the current repo
    # https://docs.github.com/en/actions/learn-github-actions/reusing-workflows#calling-a-reusable-workflow
    uses: <your github acct>/<your repo>/.github/workflows/build.yml@main
    # that's all - jobs that call a reusable workflow can do nothing else

  deploy:
    # only run the 'deploy' job if the 'use-build' job passes
    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idneeds
    needs: use-build

    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idruns-on
    runs-on: ubuntu-latest

    # https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps
    steps:
      - name: Download build artifact
        # https://github.com/actions/download-artifact
        uses: actions/download-artifact@v2
        with:
          # the same name as used in the build workflow
          name: build-artifact
          # where to save the artifact
          # using the same path as in the build workflow "restores" the state from the end of the build workflow
          path: dist

      # deploy! adapt to your needs.
      - name: Upload via FTP
        # https://github.com/marketplace/actions/ftp-action
        # 'with' config is specific to the 'sebastianpopp/ftp-action' action
        uses: sebastianpopp/ftp-action@releases/v2
        with:
          host: ${{ secrets.FTP_SERVER }}
          user: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          # use the same path as download-artifact downloaded the build artifact to
          localDir: dist
          # adapt to your needs
          remoteDir: html
```

## Try it out

Make sure Actions are enabled in your GitHub repo: repo > Settings tab > Actions > "Allow all actions" or "Allow select actions". Adapt the workflows to your needs, then commit them in a non-trunk branch and push to GitHub. Go to your GitHub repo's Actions tab to see the `build` workflow running. Merge into your trunk branch, push, and go to the Actions tab to see the `build-deploy` workflow running.

## Bonus

Every GitHub Actions workflow has a status badge at `<workflow file path>/badge.svg`. To show the world that production is healthy, modify this snippet and add it to your README.md:

```markdown
[![build-deploy workflow status badge](https://github.com/<owner>/<repo>/actions/workflows/build-deploy.yml/badge.svg)](https://github.com/<owner>/<repo>/actions/workflows/build-deploy.yml)
```

## References

### GitHub Actions documentation

- [GitHub Docs > GitHub Actions > Learn GitHub Actions > Reusing workflows](https://docs.github.com/en/actions/learn-github-actions/reusing-workflows)
- [GitHub Docs > GitHub Actions > Learn GitHub Actions > Workflow syntax > `jobs..needs`](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idneeds)
- [GitHub Docs > GitHub Actions > Learn GitHub Actions > Workflow syntax > `jobs..runs-on`](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idruns-on)
- [GitHub Docs > GitHub Actions > Learn GitHub Actions > Workflow syntax > `jobs..steps`](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps)
- [GitHub Docs > GitHub Actions > Learn GitHub Actions > Workflow syntax > `jobs..uses`](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_iduses)
- [GitHub Docs > GitHub Actions > Learn GitHub Actions > Workflow syntax > `on..`](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#onpushpull_requestbranchestags)

### Actions used

- [cache action](https://github.com/actions/cache)
- [checkout action](https://github.com/actions/checkout)
- [download-artifact action](https://github.com/actions/download-artifact)
- [sebastianpopp/ftp-action action](https://github.com/marketplace/actions/ftp-action)
- [setup-node action](https://github.com/actions/setup-node)
- [upload-artifact action](https://github.com/actions/upload-artifact)