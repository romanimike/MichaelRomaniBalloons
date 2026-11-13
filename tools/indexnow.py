#!/usr/bin/env python3
"""
Tell Bing (and other IndexNow search engines) which pages changed, after a release is deployed.

  python3 tools/indexnow.py            # only pages changed since the previous release tag
  python3 tools/indexnow.py --all      # every URL in sitemap.xml
  python3 tools/indexnow.py --dry-run  # show what would be sent, send nothing

Run it AFTER Michael has deployed in Sevalla (the key file must already be live).
URLs come only from sitemap.xml, so the noindex stub pages are never submitted.
The request contains only the host, the public key and the URL list (no email or personal data).
Uses curl, because Python's built-in HTTPS fails certificate checks on this Mac.
"""
import json, re, subprocess, sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
HOST = "michaelromaniballoons.com"
KEY_FILE = next(SITE.glob("[0-9a-f]" * 32 + ".txt"), None)
ENDPOINT = "https://api.indexnow.org/indexnow"


def sitemap_urls():
    xml = (SITE / "sitemap.xml").read_text(encoding="utf-8")
    return re.findall(r"<loc>([^<]+)</loc>", xml)


def changed_files():
    tags = subprocess.run(["git", "tag", "--sort=-v:refname"], cwd=SITE, capture_output=True, text=True).stdout.split()
    tags = [t for t in tags if re.match(r"^v\d+\.\d+", t)]
    if len(tags) < 2:
        return None
    out = subprocess.run(["git", "diff", "--name-only", tags[1], tags[0]], cwd=SITE, capture_output=True, text=True).stdout
    print(f"Comparing release {tags[1]} -> {tags[0]}")
    return set(out.split())


def main():
    if KEY_FILE is None:
        sys.exit("No <key>.txt file found in the site root.")
    key = KEY_FILE.stem
    urls = sitemap_urls()
    bad = [u for u in urls if not u.startswith(f"https://{HOST}/")]
    if bad:
        sys.exit(f"Sitemap has URLs outside https://{HOST}/: {bad}")
    if "--all" not in sys.argv:
        files = changed_files()
        if files is not None:
            shared = {"css/style.css", "js/main.js"}
            def page_file(u):
                name = u.replace(f"https://{HOST}/", "") or "index.html"
                return name
            urls = [u for u in urls if page_file(u) in files or (files & shared and page_file(u).endswith(".html"))]
    if not urls:
        print("No changed pages to submit.")
        return
    payload = {"host": HOST, "key": key, "keyLocation": f"https://{HOST}/{key}.txt", "urlList": urls}
    print(f"Submitting {len(urls)} URL(s):")
    for u in urls:
        print("  ", u)
    if "--dry-run" in sys.argv:
        print("(dry run, nothing sent)")
        return
    r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST", ENDPOINT,
                        "-H", "Content-Type: application/json; charset=utf-8", "--data-binary", json.dumps(payload)],
                       capture_output=True, text=True)
    print("HTTP status:", r.stdout, "(200 or 202 = accepted)")


if __name__ == "__main__":
    main()
