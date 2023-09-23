import os
import json
import base64
from urllib.parse import quote

template = {
    "pages": [],
    "theme": "cxd",
    "asideFixed": True,
    "asideFolded": False,
    "offScreen": False,
    "addPageIsOpen": False,
    "preview": False,
    "isMobile": False,
    "schema": {}
}

pc = 0


def gci(filepath):
    global pc
    files = os.listdir(filepath)
    for fi in files:
        fi_d = os.path.join(filepath, fi)
        if os.path.isdir(fi_d):
            gci(fi_d)
        else:
            if os.path.splitext(fi_d)[0][-5:] == ".amis" and os.path.splitext(fi_d)[1] == ".json":
                f = open(fi_d, encoding='utf-8')
                src_json = json.loads(f.read())
                pc += 1
                template['pages'].append({
                    "id": str(pc),
                    "icon": "",
                    "path": src_json['title'],
                    "label": src_json['title'],
                    "schema": src_json
                })


gci(input("请输入www（index.html）文件所在目录：") + "/static/pages")
ktemplate = f"""
!(function(){{
    localStorage.setItem("store",decodeURIComponent(atob("{base64.b64encode(quote(json.dumps(template, ensure_ascii=False))
                                                                            .encode()).decode('utf-8')}")));
    location.reload();
}}())
"""
print(ktemplate)
