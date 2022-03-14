---
title: Set Up AWS CLI and Download Your S3 Files From the Command Line
description: Have an AWS task that's awkward when done in the web interface? AWS CLI sets up easily and has a full command suite
date: 2018-01-31
tags:
  - aws
  - s3
  - cli
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/set-up-aws-cli-and-download-your-s3-files-from-the-command-line/
imageFilename: three-men.jpg
imageDetails:
  license:
    name: Public domain
  title: Three men standing. Woodcut
  url: https://wellcomecollection.org/works/jqkvjr63
id: 29752
---


The other day I needed to download the contents of a large S3 folder. That is a tedious task in the browser: log into the AWS console, find the right bucket, find the right folder, open the first file, click download, maybe click download a few more times until something happens, go back, open the next file, over and over. Happily, Amazon provides <span **AWS CLI**, a command line tool for interacting with AWS. With AWS CLI, that entire process took less than three seconds:

```
$ aws s3 sync s3://<bucket>/<path> </local/path>
```

Getting set up with AWS CLI is simple, but the documentation is a little scattered. Here are the steps, all in one spot:

## 1. Install the AWS CLI

You can install AWS CLI for any major operating system:

- **macOS** (the [full documentation](http://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html) uses `pip`, but [Homebrew](https://brew.sh/) works more seamlessly):

  ```
  $ brew install awscli
  ```

- **Linux** ([full documentation](http://docs.aws.amazon.com/cli/latest/userguide/awscli-install-linux.html)):

  ```
  $ pip install awscli
  ```

- **Windows** ([full documentation](http://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html)):

  Download the installer from http://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html

## 2. Get your access keys

Documentation for the following steps is [here](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

1. Log into the [IAM Console](https://console.aws.amazon.com/iam/home?#home).
2. Go to **Users**.
3. Click on your **user name** (the name not the checkbox).
4. Go to the **Security credentials** tab.
5. Click **Create access key**. Don't close that window yet!
6. You'll see your **Access key ID**. Click "Show" to see your **Secret access key**.
7. Download the key pair for safe keeping, add the keys to your password app of choice, or do whatever you do to keep secrets safe. Remember this is the last time Amazon will show this secret access key.

## 3. Configure AWS CLI

Run `aws configure` and answer the prompts.

Each prompt lists the current value in brackets. On the first run of `aws configure` you will just see `[None]`. In the future you can change any of these values by running `aws cli` again. The prompts will look like `AWS Access Key ID [****************ABCD]`, and you will be able to keep the configured value by hitting return.

```
$ aws configure
AWS Access Key ID [None]: <enter the access key you just created>
AWS Secret Access Key [None]: <enter the secret access key you just created>
Default region name [None]: <enter region - valid options are listed below >
Default output format [None]: <format - valid options are listed below >
```

- Valid region names ([documented here](http://docs.aws.amazon.com/powershell/latest/userguide/pstools-installing-specifying-region.html)) are

  | **Region**     | **Name**                  |
  | :------------- | :------------------------ |
  | ap-northeast-1 | Asia Pacific (Tokyo)      |
  | ap-northeast-2 | Asia Pacific (Seoul)      |
  | ap-south-1     | Asia Pacific (Mumbai)     |
  | ap-southeast-1 | Asia Pacific (Singapore)  |
  | ap-southeast-2 | Asia Pacific (Sydney)     |
  | ca-central-1   | Canada (Central)          |
  | eu-central-1   | EU Central (Frankfurt)    |
  | eu-west-1      | EU West (Ireland)         |
  | eu-west-2      | EU West (London)          |
  | sa-east-1      | South America (Sao Paulo) |
  | us-east-1      | US East (Virginia)        |
  | us-east-2      | US East (Ohio)            |
  | us-west-1      | US West (N. California)   |
  | us-west-2      | US West (Oregon)          |

- Valid output formats ([documented here](http://docs.aws.amazon.com/cli/latest/topic/config-vars.html)) are

  - json
  - table
  - text

## 4. Use AWS CLI!

In the example above, the `s3` command's `sync` command "recursively copies new and updated files from the source directory to the destination. Only creates folders in the destination if they contain one or more files" (from [`s3 sync`'s documentation](http://docs.aws.amazon.com/cli/latest/reference/s3/sync.html)). I'm able to download an entire collection of images with a simple

```
aws s3 sync s3://s3.aws-cli.demo/photos/office ~/Pictures/work
```

But AWS CLI can do much more. Check out the comprehensive documentation at [AWS CLI Command Reference](http://docs.aws.amazon.com/cli/latest/index.html).

