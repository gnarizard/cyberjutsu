---
layout: default
title: Cyberjutsu
---

# Welcome to Cyberjutsu

A cybersecurity blog dedicated to sharing practical knowledge across topics like network defense, penetration testing, and system administration.

---

### Disclaimer

**Legal and Ethical Considerations:** All content provided on this site is intended for educational and informational purposes only. Always obtain proper authorization before conducting any cybersecurity activities, including network testing, vulnerability assessment, and penetration testing, to avoid violating legal or ethical boundaries.

---

> Thank you for visiting Cyberjutsu. Enjoy reading and learning!

---

## Categories

### Reconnaissance

#### Active

{% assign active_recon_posts = site.posts | where: "categories", "Recon/Active" %}
{% for post in active_recon_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

#### Passive

{% assign passive_recon_posts = site.posts | where: "categories", "Recon/Passive" %}
{% for post in passive_recon_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Cracking

{% assign cracking_posts = site.posts | where: "categories", "Cracking" %}
{% for post in cracking_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Exploitation Techniques & Tools

{% assign exploitation_posts = site.posts | where: "categories", "Exploitation" %}
{% for post in exploitation_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Network Monitoring

{% assign network_monitoring_posts = site.posts | where: "categories", "Network-Monitoring" %}
{% for post in network_monitoring_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### System Administration

{% assign sys_admin_posts = site.posts | where: "categories", "Sys-Admin" %}
{% for post in sys_admin_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Web Application Security

{% assign web_app_posts = site.posts | where: "categories", "Web-App" %}
{% for post in web_app_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### CTF

#### Cyber Apocalypse 2025: Tales from Eldoria

{% assign eldoria_posts = site.posts | where: "categories", "CTF/CyberApocalypse2025" %}
{% for post in eldoria_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}
