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

### CTF

#### Cyber Apocalypse 2025: Tales from Eldoria

{% assign eldoria_posts = site.posts | where: "categories", "CTF/CyberApocalypse2025" %}
{% for post in eldoria_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

### Cheat Sheets

{% assign cheatsheet_posts = site.posts | where: "categories", "CheatSheets" %}
{% for post in cheatsheet_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

#### CPTS

{% assign cpts_posts = site.posts | where: "categories", "CheatSheets/CPTS" | sort: "order" %}
{% for post in cpts_posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}