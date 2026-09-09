"""Refresh public page metadata for the curated source IDs; no private API required."""
import re,json,urllib.request,concurrent.futures
from pathlib import Path
ROOT=Path(__file__).parent
ids=list(dict.fromkeys(ROOT.joinpath('seed-ids.txt').read_text().split()))
def fetch(id):
 url='https://community.spline.design/file/'+id
 try:
  s=urllib.request.urlopen(url,timeout=30).read().decode()
  data=json.loads(re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>',s).group(1))['props']['pageProps']['seo']
  return dict(id=id,title=data['title'],description=data.get('description',''),preview=data.get('image'),url=url,review='candidate',checked='2026-09-09')
 except Exception as e:return dict(id=id,url=url,error=str(e))
old={x['id']:x for x in json.loads(ROOT.joinpath('sources.json').read_text())} if ROOT.joinpath('sources.json').exists() else {}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:r=list(pool.map(fetch,ids))
r=[{**old.get(x['id'],{}),**{k:v for k,v in x.items() if k!='review'},'review':old.get(x['id'],{}).get('review','candidate')} for x in r]
ROOT.joinpath('sources.json').write_text(json.dumps(r,ensure_ascii=False,indent=2))
print(json.dumps([{'id':x['id'],'title':x.get('title'),'error':x.get('error')} for x in r],ensure_ascii=False))
