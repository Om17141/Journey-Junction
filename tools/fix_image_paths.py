import re
import os
from urllib.parse import quote

REPO_RAW_BASE = 'https://raw.githubusercontent.com/Om17141/Journey-Junction/main/'
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

html_files = []
for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
    for f in filenames:
        if f.lower().endswith('.html'):
            html_files.append(os.path.join(dirpath, f))

print(f"Found {len(html_files)} HTML files to scan")

# patterns to replace:
# 1) Windows absolute paths: C:\Users\admin\Desktop\journeyjunction\images\... (backslashes)
abs_pattern = re.compile(r"C:\\Users\\admin\\Desktop\\journeyjunction\\images\\([^")'\s>]+)", re.IGNORECASE)
# 2) src="../images/..." or src="images/..." (also single quotes)
src_pattern = re.compile(r"(src=)(['\"])\.?\.?/images/([^'\")]+)(['\"])", re.IGNORECASE)
# 3) url('../images/..') or url("../images/..") or url(images/...)
url_pattern = re.compile(r"(url\(['\"]?)(?:\.\./)?images/([^'\")]+)(['\"]?\))", re.IGNORECASE)
# 4) other occurrences like href to image (rare)
href_pattern = re.compile(r"(href=)(['\"])\.?\.?/images/([^'\")]+)(['\"])", re.IGNORECASE)

changed_files = []
for path in html_files:
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    original = content

    # replace absolute Windows paths
    def abs_repl(m):
        tail = m.group(1)
        tail_quoted = quote(tail)
        return REPO_RAW_BASE + 'images/' + tail_quoted
    content = abs_pattern.sub(abs_repl, content)

    # replace src attributes
    def src_repl(m):
        pre = m.group(1)
        quote_char = m.group(2)
        tail = m.group(3)
        tail_quoted = quote(tail)
        return f"{pre}{quote_char}{REPO_RAW_BASE}images/{tail_quoted}{quote_char}"
    content = src_pattern.sub(src_repl, content)

    # replace href attributes that point to images
    def href_repl(m):
        pre = m.group(1)
        quote_char = m.group(2)
        tail = m.group(3)
        tail_quoted = quote(tail)
        return f"{pre}{quote_char}{REPO_RAW_BASE}images/{tail_quoted}{quote_char}"
    content = href_pattern.sub(href_repl, content)

    # replace url(...) usages
    def url_repl(m):
        prefix = m.group(1)
        tail = m.group(2)
        suffix = m.group(3)
        tail_quoted = quote(tail)
        return f"{prefix}{REPO_RAW_BASE}images/{tail_quoted}{suffix}"
    content = url_pattern.sub(url_repl, content)

    if content != original:
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(content)
        changed_files.append(os.path.relpath(path, ROOT_DIR))
        print(f"Updated: {path}")

print('\nDone. Files changed:')
for f in changed_files:
    print(' -', f)

if not changed_files:
    print('No files required changes.')
