---
title: CLI Equivalents for Common MAMP PRO and Sequel Pro Tasks
description: Start and stop servers and create new hosts with MAMP Pro's CLI commands; create, delete, export, and import SQL databases with mysql
date: 2020-03-26
tags:
  - mysql
  - cli
  - mamp
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/cli-equivalents-for-common-mamp-pro-and-sequel-pro-tasks/
imageFilename: gessner-elephant.jpg
imageDetails:
  author: Gessner, Conrad, 1516-1565
  license:
    name: Public domain
  title: "An elephant. Woodcut after C. Gessner"
  url: https://wellcomecollection.org/works/wfktrkr3
id: 5232
---

Working on website front ends I sometimes use MAMP PRO to manage local hosts and Sequel Pro to manage databases. Living primarily in my text editor, a terminal, and a browser window, moving to these click-heavy dedicated apps can feel clunky. Happily, the tasks I have most frequently turned to those apps for —starting and stopping servers, creating new hosts, and importing, exporting, deleting, and creating databases— can be done from the command line.

I still pull up MAMP PRO if I need to change a host's PHP version or work with its other more specialized settings, or Sequel Pro to quickly inspect a database, but for the most part I can stay on the keyboard and in my terminal. Here's how:

### Command Line MAMP PRO

You can start and stop MAMP PRO's servers from the command line. You can even do this when the MAMP PRO desktop app isn't open.

*Note:* *MAMP PRO's menu icon will not change color to reflect the running/stopped status when the status is changed via the command line.*

- Start the MAMP PRO servers:
    ```shell
    /Applications/MAMP\ PRO.app/Contents/MacOS/MAMP\ PRO cmd startServers
    ```
- Stop the MAMP PRO servers:
    ```shell
    /Applications/MAMP\ PRO.app/Contents/MacOS/MAMP\ PRO cmd stopServers
    ```
- Create a host (replace host_name and root_path):
    ```shell
    /Applications/MAMP\ PRO.app/Contents/MacOS/MAMP\ PRO cmd createHost host_name root_path
    ```

### MAMP PRO-friendly Command Line Sequel Pro

*Note: if you don't use MAMP PRO, just replace the `/Applications/MAMP/Library/bin/mysql` with `mysql`.*

In all of the following commands, replace `username` with your user name (locally this is likely `root`) and `database_name` with your database name. The `-p` (password) flag with no argument will trigger an interactive password prompt. This is more secure than including your password in the command itself (like `-pYourPasswordHere`). Of course, if you're using the default password `root` is not particular secure to begin with so you might just do `-pYourPasswordHere`.

Setting the `-h` (host) flag to `localhost` or `127.0.0.1` tells mysql to look at what's on localhost. With the MAMP PRO servers running, that will be the MAMP PRO databases.

```shell
# with the MAMP PRO servers running, these are equivalent:
# /Applications/MAMP/Library/bin/mysql -h 127.0.0.1 other_options
# and
# /Applications/MAMP/Library/bin/mysql -h localhost other_options

/Applications/MAMP/Library/bin/mysql mysql_options # enter. opens an interactive mysql session
mysql> some command; # don't forget the semicolon
mysql> exit;
```

- Create a local database:
    ```shell
    # with the MAMP PRO servers running
    # replace `username` with your username, which is `root` by default
    /Applications/MAMP/Library/bin/mysql -h localhost -u username -p -e "create database database_name"
    ```
    or
    ```shell
    # with the MAMP PRO servers running
    # replace `username` (`root` by default) and `database_name`
    /Applications/MAMP/Library/bin/mysql -h localhost -u username -p # and then enter
    mysql> create database database_name; # don't forget the semicolon
    mysql> exit
    ```
    MAMP PRO's databases are stored in /Library/Application Support/appsolute/MAMP PRO/db so to confirm that it worked you can
    ```shell
    ls /Library/Application\ Support/appsolute/MAMP\ PRO/db
    # will output the available mysql versions. For example I have
    mysql56_2018-11-05_16-25-13     mysql57

    # If it isn't clear which one you're after, open the main MAMP PRO and click
    # on the MySQL "servers and services" item. In my case it shows "Version: 5.7.26"

    # Now look in the relevant MySQL directory
    ls /Library/Application\ Support/appsolute/MAMP\ PRO/db/mysql57
    # the newly created database should be in the list
    ```
- Delete a local database:
    ```shell
    # with the MAMP PRO servers running
    # replace `username` (`root` by default) and `database_name`
    /Applications/MAMP/Library/bin/mysql -h localhost -u username -p -e "drop database database_name"
    ```
- Export a dump of a local database. Note that this uses mysqldump not mysql.
    ```shell
    # to export an uncompressed file
    # replace `username` (`root` by default) and `database_name`
    /Applications/MAMP/Library/bin/mysqldump -h localhost -u username -p database_name > the/output/path.sql

    # to export a compressed file
    # replace `username` (`root` by default) and `database_name`
    /Applications/MAMP/Library/bin/mysqldump -h localhost -u username -p database_name | gzip -c > the/output/path.gz
    ```
- Export a local dump from an external database over SSH. Note that this uses mysqldump not mysql.
    ```shell
    # replace `ssh-user`, `ssh_host`, `mysql_user`, `database_name`, and the output path

    # to end up with an uncompressed file
    ssh ssh_user@ssh_host "mysqldump -u mysql_user -p database_name | gzip -c" | gunzip > the/output/path.sql

    # to end up with a compressed file
    ssh ssh_user@ssh_host "mysqldump -u mysql_user -p database_name | gzip -c" > the/output/path.gz
    ```
- Import a local database dump into a local database
    ```shell
    # with the MAMP PRO servers running
    # replace `username` (`root` by default) and `database_name`
    /Applications/MAMP/Library/bin/mysql -h localhost -u username -p database_name < the/dump/path.sql
    ```
- Import a local database dump into a remote database over SSH. Use care with this one. But if you are doing it with Sequel Pro —maybe you are copying a Craft site's database from a production server to a QA server— you might as well be able to do it on the command line.
    ```shell
    ssh ssh_user@ssh_host "mysql -u username -p remote_database_name" < the/local/dump/path.sql
    ```

For me, using the command line instead of the MAMP PRO and Sequel Pro GUI means less switching between keyboard and mouse, less opening up GUI features that aren't typically visible on my screen, and generally better DX. Give it a try! And while MAMP Pro's CLI is limited to the essentials, command line mysql of course knows no limits. If there's something else you use Sequel Pro for, you may be able to come up with a mysql CLI equivalent you like even better.