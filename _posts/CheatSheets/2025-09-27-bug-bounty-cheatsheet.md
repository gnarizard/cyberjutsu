---
layout: post
title: "Bug Bounty Cheatsheet"
date: 2025-09-27
categories: CheatSheets
---

## Program Intake

> read policy, capture scope, set up test accounts

### Download Burp Suite Project Configuration File

### scope2env

>Custom script hosted on my github

```sh
python3 ~/Tools/scope2env.py scope.csv                       
source ./scope/scope.env
```

---

## Discovery

> web/app recon tools

asset discovery workflow ex:

```sh
shuffledns -d <domain> -w <wordlist.txt> -r <resolvers.txt> -mode bruteforce -silent | grep api | alterx -silent | dnsx -silent | naabu -p 443, 8443 -silent 
```

then feed to then httpx and crawl with katana

---

### Asset Discovery

#### Passive Subdomain Enumeration

##### subfinder

>Rapid, passive discovery of subdomains

```bash
subfinder -d $TARGET -silent -all -recursive -o subfinder_subs.txt
```

- all: Uses all available sources (even those that are not enabled by default, but are configured).
- recursive: Performs recursive enumeration — it takes each found subdomain and checks for sub-subdomains (e.g., dev.api.target.com).
- silent: Again, suppresses banner.

**Note:** Make sure to update config with api keys (shodan / virusTotal / Censys / SecurityTrails)

> dedupe & sort

```sh
sort -u subfinder_raw.txt -o subfinder_unique.txt
```

##### amass

>Comprehensive attack surface mapping

```bash
amass enum -passive -d <domain> -o amass.txt
```

#### ASN Enumeration

##### amass

**ASN Lookup**

```bash
amass intel -asn <ASN_Number> -o asn_ips.txt
```

##### Shodan

**Shodan Enumeration**

```bash
shodan search "net:<ip_range>" --fields ip_str,port --limit 100
```

##### Censys

**Censys Asset Search**

```bash
censys search "autonomous_system.asn:<ASN_Number>" -o censys_assets.txt
```

#### Active Subdomain Enumeration

##### MassDNS

>High-speed DNS resolution

```sh
massdns -r resolvers.txt -t A -o S -w massdns_results.txt wordlist.txt
```

##### Shuffledns

>Active enumeration of subdomains

```sh
shuffledns -d target.com -list all_subs.txt -r resolvers.txt -o active_subs.txt
```

##### SubBrute

>DNS brute-forcing

```sh
python3 subbrute.py target.com -w wordlist.txt -o brute_force_subs.txt
```

##### FFuF Subdomain

```bash
ffuf -u https://FUZZ.target.com -w wordlist.txt -t 50 -mc 200,403 -o ffuf_subs.txt
```

#### Cloud Asset Discovery

##### CloudEnum

>Multi-cloud asset discovery

**Key Features:**
    - Supports AWS, Azure, Google Cloud
    - Custom keyword generation
    - Automated bruteforcing
  
```sh
cloud_enum -k target.com
```

##### AWSBucketDump & S3Scanner

>AWS S3 bucket discovery and analysis

**Usage Guidelines:**
    - Always respect bucket permissions
    - Document findings carefully
    - Follow responsible disclosure

**S3 Bucket Access Test**

```bash
aws s3 ls s3://<bucket_name> --no-sign-request
```

**S3 Bucket Content Dump**

```bash
python3 AWSBucketDump.py -b target-bucket -o dumped_data/
```

#### DNS Resolution

##### dnsx

```bash
dnsx -l subfinder_unique.txt -silent -o resolved-domains.txt
```

>If you also want to triage infra vs vendor (CNAMEs, A/AAAA records), use:

```sh
dnsx -l subfinder_unique.txt -a -aaaa -cname -resp -silent -o dnsx_enriched.txt
```

#### Subdomain permutations

##### alterx

```sh
cat subdomains.txt | alterx | tee -a subdomains-dnsx.txt
```

#### URL Normalization / De-duplication

##### anew

**Results Combination**

```bash
cat *_subs.txt | sort -u | anew all_subs.txt
```

##### uro

```bash
cat katana.txt wayback.txt gau.txt | uro > urls.txt
```

#### Scanning

> Note: Network/port scans (e.g., nmap/naabu) are usually **not allowed** on BBPs/VDPs unless the policy explicitly says so.

##### naabu

>Scan for open ports

**Note:** Port scanning is active and noisy, this is potentially disruptive and often disallowed under VDP rules unless explicitly permitted.

```sh
cat subdomains.txt | alterx | dnsx | naabu -top-ports 100 -ep 22 -o open-ports.txt
```

##### nuclei

> Vulnerability Scan (light exposure/fingerprinting)

```bash
nuclei -l resolved.txt -tags tech,exposure -severity low,medium -o nuclei.txt
```

##### vulnx

> Subdomain takeover scanner

**Key Features:**

- Passive and active checks
- CMS fingerprinting
- Misconfigured CNAME detection

```bash
vulnx -d target.com -o vulnx-results
```

### Content Discovery

>Enumeration
>
#### HTTP Probing

##### httpx

>Probe open ports for web service

**Note:** httpx can probe specific ports (80,443,8080,8443, etc.) and will tell you status, title, redirects, etc. It’s usually sufficient and much safer than a raw TCP port scan.

These four give you high coverage of:

- public websites and APIs,
- mobile backends that sometimes use alternate ports,
- staging/management consoles accidentally left exposed on common alt-ports.

- **80 (HTTP)** — the standard cleartext web port. Some legacy endpoints still listen here.
- **443 (HTTPS)** — the standard TLS web port; almost every customer-facing service will use this.
- **8080 (alternative HTTP / app servers / proxies)** — commonly used by application servers, proxies, and internal web apps that were fronted by a different port in deployment or for staging.
- **8443 (alternative HTTPS / admin consoles / Tomcat)** — commonly used as a TLS alternative (Tomcat, admin UIs, dev environments).

```sh
httpx -l resolved_subs.txt -p 80,443,8080,8443 -silent -title -sc -ip -o live_websites.txt
```

Another way:

```sh
cat all_subs.txt | httpx -silent -title -o live_subdomains.txt
```

**Results Validation**

```bash
cat all_subs.txt | httpx -silent -title -o live_subdomains.txt
```

**Custom Filtering**

```bash
cat live_websites.txt | grep -i "login\|admin" | tee login_endpoints.txt
```

**Piped**

```bash
cat subfinder_unique.txt | dnsx -silent | httpx -ports 80,443,8080,8443 -title -status-code -content-length -location -threads 4 -timeout 6 -o httpx.json -json
```

Another way:

```sh
cat resolved_hosts.txt | httpx \
  -ports 80,443,8080,8443 \
  -title -status-code -content-length -location \
  -threads 4 -timeout 6 \
  -o httpx.json -json
```

- `-title` — return the HTML `<title>` to quickly identify the type of service/page.
- `-status-code` (`-sc`) — show HTTP status codes to separate live/redirect/error pages.
- `-content-length` (`-cl`) — show response size to spot differing or unexpectedly large responses.
- `-location` — show `Location` header to inspect redirect targets (useful for open-redirect discovery).
- `-follow-redirects` (`-fr`) — follow 3xx redirects and report the final destination (caution: may touch external domains).
 	- Use -location to inspect redirects first.
- `-threads 8` — concurrency level; use low values (2–8) on production to avoid overload.
- `-timeout 8` — per-request timeout in seconds; keeps scans moving while allowing slow responses.
- `-tls-probe` — fetches the TLS certificate (a strong in-scope signal)
- `-silent` — reduce console noise when piping to other tools or scripts.
- `-o httpx.txt` — write results to a file for triage; prefer `-json`/`-json-output` for machine-readable output.

#### URL/Endpoint Collection

>When handling Specific (Non-Wildcard) Targets can skip enumeration to here
>
##### katana

>Smart crawler for modern web applications

**Key Features:**

- JavaScript parsing
- Crawling customization
- Automatic handling of SPAs

```sh
katana -u target.example.com -silent -jc -o katana_results.txt
```

When authenticated:

```bash
katana -u <url> -jsl -H 'Cookie: SUPPORTSESSID=xxxx' -xhr -aff
```

and you can pipe that back into httpx like:

```sh
katana -u <url> -jsl -H 'Cookie: SUPPORTSESSID=xxxx' -xhr -aff | httpx -title -ct -cl -sc 
```

>pseudo-example adapt flag names for your Katana binary

```sh
katana \
  --target https://accounts.britishairways.com \
  --threads 2 \
  --delay 1000 \                # 1000 ms between requests
  --max-depth 3 \
  --max-requests 800 \
  --scope-host-only true \      # do not follow external hosts
  --no-redirects true \         # don't follow redirects offsite
  --methods GET,HEAD \          # only non-state-changing methods
  --respect-robots true \
  --exclude-paths "/admin,/checkout,/payments,/api/admin,/account/delete" \
  --auth-cookie "session=YOUR_TEST_SESSION_COOKIE" \
  --output ./katana_accounts.json
```

##### gau

>Fetch known URLs from various sources

**Key Features:**
 - Pulls from AlienVault, Wayback, Common Crawl
 - Handles rate limiting automatically
 - Supports multiple target inputs

```bash
gau target.example.com | anew gau_results.txt
```

##### waybackurls

>Historical URL discovery from Wayback Machine

```bash
waybackurls target.example.com | anew wayback_results.txt
```

##### **Parameter Extraction**

```bash
cat archived_urls.txt | grep "=" | anew parameters.txt
```

##### API Enumeration

**Kiterunner**

```bash
kr scan https://api.target.com -w /usr/share/kiterunner/routes-large.kite -o api_routes.txt
```

---

> Application endpoints and parameters → APIs (REST/GraphQL) → everything else in-scope

#### Directory/Endpoint Enumeration

##### **Dirsearch**

```bash
dirsearch -u https://target.com -w /usr/share/wordlists/content_discovery.txt -e php,html,js,json -x 404 -o dirsearch_results.txt
```

##### FFuF

**Recursive**

```bash
ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/content_discovery.txt -mc 200,403 -recursion -recursion-depth 3 -o ffuf_results.txt
```

#### Parameter Discovery

##### arjun

```bash
arjun -u https://<host>/path -oT arjun-params.txt
```

>**Arjun Parameter Discovery**

```bash
arjun -u "https://target.example.com" -m GET,POST --stable -o params.json
```

##### **ParamSpider Web Parameters**

```bash
python3 paramspider.py --domain target.com --exclude woff,css,js --output paramspider_output.txt
```

##### **FFuF Parameter Bruteforce**

```bash
ffuf -u https://target.com/page.php?FUZZ=test -w /usr/share/wordlists/params.txt -o parameter_results.txt
```

#### API / GraphQL Exploration

##### **Kiterunner**

```bash
kr scan https://api.target.com -w /usr/share/kiterunner/routes-large.kite -o api_routes.txt
```

##### httpie

```bash
http GET https://<host>/api/v1/users Authorization:'Bearer <token>'
```

##### inql

```bash
inql -t https://<host>/graphql -o inql-schema.json
```

---

### Cataloging Possible Exploits

> Record interesting endpoints/collections here (no techniques in this section).

#### notes (Markdown)

```bash
cat > hypotheses.md <<'EOF'
Endpoint:
Role/Context:
Assumption:
Test idea:
Potential impact:
Proof plan:
EOF
```

---

## Vulnerability Testing

> Look for login forms, parameterized URLs, APIs, search fields, etc.

#### High-Priority Vulnerabilities

**CSRF Testing**

```bash
cat live_websites.txt | gf csrf | tee csrf_endpoints.txt
```

**LFI Testing**

```bash
cat live_websites.txt | gf lfi | qsreplace "/etc/passwd" | xargs -I@ curl -s @ | grep "root:x:" > lfi_results.txt
```

**RCE Testing**

```bash
curl -X POST -F "file=@exploit.php" https://target.com/upload
```

**SQLi Testing**

```bash
ghauri -u "https://target.com?id=1" --dbs --batch
```

**Sensitive Data Search**

```bash
cat js_files.txt | grep -Ei "key|token|auth|password" > sensitive_data.txt
```

**Open Redirect Test**

```bash
cat urls.txt | grep "=http" | qsreplace "https://evil.com" | xargs -I@ curl -I -s @ | grep "evil.com"
```

### HTTP PoC

#### curl

```bash
curl -i -H 'Authorization: Bearer <token>' https://<host>/api/v1/me
```

#### HTTPie

```bash
http GET https://<host>/api/v1/me Authorization:'Bearer <token>'
```

#### Burp Suite (Repeater/Intruder)

```text
GUI: Send requests to Repeater; save raw req/resp for the report.
```

---

### AuthZ / AuthN Testing (Burp)

#### Autorize (extension)

```text
GUI: Compare privileged vs unprivileged tokens to spot IDOR/missing checks.
```

#### AuthMatrix (extension)

```text
GUI: Define roles; batch-test the same request across sessions/tokens.
```

#### ParamMiner (extension)

```text
GUI: Discover hidden parameters that may unlock additional behavior.
```

---

### Concurrency / Rate-Limit PoC

#### Turbo Intruder (Burp extension)

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=10, requestsPerConnection=5)
    for i in range(0, 50):
        engine.queue(target.req, target.baseInput)
def handleResponse(req, interesting):
    pass
```

---

### OAST / Out-of-Band PoC

#### interactsh-client

```bash
interactsh-client -o oast.txt
# Use provided callback URL in your PoC and monitor oast.txt for hits
```

---

### GraphQL PoC

#### curl

```bash
curl -s https://<host>/graphql -H 'Content-Type: application/json' \
  -d '{"query":"query{__schema{types{name}}}"}' | jq .
```

#### inql

```bash
inql -t https://<host>/graphql -o inql-schema.json
```

---

### File-Upload PoC (safe)

#### curl (multipart/form-data)

```bash
curl -s -X POST https://<host>/upload -F 'file=@test.jpg;type=image/jpeg' -i
```

---

### Evidence Capture (attach to report)

#### Save raw requests/responses

##### curl

```bash
curl -v https://<host>/api/v1/me 2>&1 | tee poc-raw.txt
```

##### HTTPie

```bash
http --print=HhBb GET https://<host>/api/v1/me > poc-raw-httpie.txt
```

#### Record minimal demo

##### OBS / ffmpeg

```bash
ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -i :0.0+0,0 -t 00:01:00 poc-demo.mp4
```

#### Screenshots

##### Flameshot

```bash
flameshot gui -p ./screenshots
```

---

## Reporting

### **Report Structure**

1. **Executive Summary**
   - Target Scope
   - Testing Timeline
   - Key Findings Summary
   - Risk Ratings

2. **Technical Details**
   - Vulnerability Title
   - Severity Rating
   - Affected Components
   - Technical Description
   - Steps to Reproduce
   - Impact Analysis
   - Supporting Evidence (POC)

3. **Remediation**
   - Detailed Recommendations
   - Mitigation Steps
   - Additional Security Controls
   - References & Resources

4. **Supporting Materials**
   - Video Demonstrations
   - Screenshots & Annotations
   - HTTP Request/Response Logs
   - Code Snippets
   - Timeline of Discovery

### **Best Practices**

- Write clear, concise descriptions
- Include detailed reproduction steps
- Provide actionable remediation advice
- Support findings with evidence
- Use professional formatting
- Highlight business impact
- Include verification steps

### **Report Format**

```markdown
# Vulnerability Report: [Title]

## Overview
- Severity: [Critical/High/Medium/Low]
- CVSS Score: [Score]
- Affected Component: [Component]

## Description
[Detailed technical description]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step n...]

## Impact
[Business and technical impact]

## Proof of Concept
[Screenshots, videos, code]

## Recommendations
[Detailed fix recommendations]

## References
[CVE, CWE, related resources]
```

### Export

#### Pandoc (Markdown → PDF)

```bash
pandoc report.md -o report.pdf
```

---

Big thanks to [AmrSec](https://x.com/amrelsagaei) and [NahamSec](https://x.com/NahamSec) <3