import requests
import re

url = "https://chatgpt.com/share/6a080094-88a8-83e9-b41d-3611eee88c7f"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}
response = requests.get(url, headers=headers)
text = response.text

for m in re.finditer(r'mapping', text, re.IGNORECASE):
    start = max(0, m.start() - 20)
    end = min(len(text), m.end() + 50)
    print(f"Match at {m.start()}: ...{text[start:end]}...")
