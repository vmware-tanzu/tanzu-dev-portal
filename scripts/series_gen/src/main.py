#!/usr/bin/env python3

import os, yaml, shutil, distutils
from distutils import util
from slugify import slugify

SERIES_PATH = os.environ["SERIES_PATH"]
CLEAN = util.strtobool(os.getenv("REMOVE_EXISTING", "false"))

def loadHugoFrontMatter(file):
    with open(file, 'r') as f:
        content = f.read().splitlines()
    counter = 0
    if content[0] == "---":
        content = content[1:]
    for line in content:
        if line == "---":
            content = content[0:counter]
            break
        counter+=1
    return "\n".join(content)

series_list = [d for d in os.listdir(SERIES_PATH) if os.path.isdir(os.path.join(SERIES_PATH, d))]

for s in series_list:
    frontMatter = loadHugoFrontMatter(os.path.join(SERIES_PATH, s, "_index.md"))
    fm = yaml.load(frontMatter, Loader=yaml.SafeLoader)

    for i in fm['structure']:
        sani_dir = slugify(i['title'])
        if CLEAN:
            shutil.rmtree(os.path.join(SERIES_PATH, s, sani_dir))
        os.mkdir(os.path.join(SERIES_PATH, s, sani_dir))
        with open(os.path.join(SERIES_PATH, s, sani_dir, "_index.md"), "w") as f: 
            f.write("--- \n")
            f.write("title: {} \n".format(i['title']))
            f.write('source: "{}" \n'.format(i['source']))
            f.write("weight: {} \n".format(i['weight']))
            f.write("layout: single \n") 
            f.write("--- \n")

        try:
            pages = i['pages']
        except KeyError:
            continue
        
        for p in pages:
            sani_page = slugify(p['title'])
            with open(os.path.join(SERIES_PATH, s, sani_dir, "{}.md".format(sani_page)), "w") as f: 
                f.write("--- \n")
                f.write("title: {} \n".format(p['title']))
                f.write('source: "{}" \n'.format(p['source']))
                f.write("weight: {} \n".format(p['weight']))
                f.write("layout: single \n") 
                f.write("--- \n")
