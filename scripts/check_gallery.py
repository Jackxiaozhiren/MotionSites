from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
site=root/'site'
projects=json.loads((site/'projects.json').read_text())
assert len(projects)==30
assert len({p['path'] for p in projects})==30
for p in projects:
    assert (root/p['path']).is_dir(),p['path']
for p in ['index.html','app.js','styles.css','assets/favicon.svg','.nojekyll']:
    assert (site/p).exists(),p
print('OK: 30 project paths and gallery assets verified')
