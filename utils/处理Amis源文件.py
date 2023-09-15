from xpinyin import Pinyin
import os
import json

name2id_mapping = {}
func_lists = []


def format_js(json_map, path):
    func_format = ""
    export_format = ""
    for i in func_lists:
        func_format += f"""
    function {i}(e, c, doAction) {{
        data = e.context.data
        
    }}
"""
        export_format += i + ","
    fmt_str = f"""(!function () {{
    const mapping = {json_map};
    
    {func_format}
    //export
    path = '{path}';
    var export_list = [{export_format}];
    for (var i = 0; i < export_list.length; i++) {{
        $['func'][path + '/' + export_list[i].name] = export_list[i];
    }}
    let amisLib = amisRequire('amis');
    amisLib.toast.success("Success: 加载模块 " + path + " 完成", {{
        "position": "top-right",
        "closeButton": true,
        "showIcon": true,
        "timeout": 100,
        "className": "theme-toast-action-scope"
    }})
}}())
    """
    return fmt_str


def get_pinyin(s):
    return Pinyin().get_pinyin(s, '')


def run_foreach(j, p):
    if "body" in j:
        for i in range(0, len(j["body"])):
            j["body"][i] = run_foreach(j["body"][i], p)
    if "items" in j:
        for i in range(0, len(j["items"])):
            j["items"][i] = run_foreach(j["items"][i], p)
    if "id" in j:
        if "name" in j:
            name2id_mapping[j['name']] = j['id']
        elif "label" in j:
            name2id_mapping[get_pinyin(j['label']) + "_" + j['type'].replace('-', '_')] = j['id']
    if "onEvent" in j:
        if "click" in j["onEvent"]:
            if "actions" in j["onEvent"]["click"]:
                for i in range(0, len(j["onEvent"]["click"]["actions"])):
                    if "script" in j["onEvent"]["click"]["actions"][i]:
                        if j["onEvent"]["click"]["actions"][i]["script"].startswith("!UseFunc("):
                            func_lists.append(j["onEvent"]["click"]["actions"][i]["script"][10:-2])
                            j["onEvent"]["click"]["actions"][i][
                                "script"] = f"""var func = '{p}/{j["onEvent"]["click"]["actions"][i]["script"][10:-2]}'; try {{ $['func'][func](event, context, doAction); }} catch (e) {{ $['utils']['toast_error']('Action Error: ' + e.message, doAction) }}"""
    return j


p = input("请输入路由相对位置: ")
js_full_path = os.path.abspath('..') + "/www/static/pages/" + p + ".js"
json_full_path = os.path.abspath('..') + "/www/static/pages/" + p + ".amis.json"
r_json_full_path = os.path.abspath('..') + "/www/static/pages/" + p + ".json"
print("输出JS文件位置: " + js_full_path)
print("输入JSON文件位置: " + json_full_path)
f = open(json_full_path, encoding='utf-8')
src_json = json.loads(f.read())
src_json["onEvent"] = {
    "init": {
        "weight": 0,
        "actions": [
            {
                "ignoreError": False,
                "script": f"var path = '{p}'; $['utils']['load_js']('/static/pages/' + path + '.js')",
                "actionType": "custom"
            }
        ]
    }
}
print(json.dumps(src_json))
f.close()
r_json = json.dumps(run_foreach(src_json, p), sort_keys=True, indent=2, separators=(',', ':'), ensure_ascii=False)
fmt_js = format_js(json.dumps(name2id_mapping, sort_keys=True, indent=2, separators=(',', ':'), ensure_ascii=False), p)
print(fmt_js)

print(r_json)
g = open(js_full_path, encoding='utf-8', mode='w')
g.write(fmt_js)
g.close()
g = open(r_json_full_path, encoding='utf-8', mode='w')
g.write(r_json)
g.close()
