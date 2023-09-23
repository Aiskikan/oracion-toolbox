(!function () {
    const mapping = {
        "algo": "u:09eda8ceef79",
        "basecn_dict": "u:7bfdfedc9ebf",
        "bianma_button": "u:4ffaeada9d40",
        "data_input": "u:283de4ca407e",
        "data_output": "u:97b65e727f29",
        "jiema_button": "u:cdab5c6002af",
        "moren_button": "u:6746119145f8"
    };

    $.utils.load_js('/static/js/lib/base-encode.js');



    function Base64_encode(str) {
        return btoa(encodeURIComponent(str))
    }
    function Base64_decode(str) {
        return decodeURIComponent(atob(str))
    }
    function Base58_encode(str) {
        return Base58.encode(new TextEncoder().encode(str))
    }
    function Base58_decode(str) {
        return new TextDecoder().decode(Base58.decode(str))
    }
    function Base91_encode(str) {
        return base91Encode(encodeURIComponent(str))
    }
    function Base91_decode(str) {
        return decodeURIComponent(base91Decode(str))
    }

    var BaseCN = {
        _KeyDict: "的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其见明问力理尔点文几定本公特做外孩相西果走将月十实向声车全信重三机工物气每并别真打太新比才便夫再书部水像眼等体却加电主界门利海受听表德少克代员许稜先口由死安写性马光白或住难望教命花结乐色进此话常与活正感更拉东神记处让母父应直字场平报友关放至张认接告入",
        encode: function (e/*uint8array */) {
            var res = [];
            for (var i = 0; i < e.length; i++) {
                res.push(this._KeyDict.charAt(e[i]));
            }
            return res.join('');
        },
        decode: function (e/*str */) {
            var res = new Uint8Array(e.length);
            for (var i = 0; i < e.length; i++) {
                res[i] = this._KeyDict.indexOf(e[i]);
            }
            return new Uint8Array(res);
        }
    }
    function BaseCN_encode(str) {
        return BaseCN.encode(new TextEncoder().encode(str))
    }
    function BaseCN_decode(str) {
        return new TextDecoder().decode(BaseCN.decode(str))
    }



    function encode(e, c, doAction) {
        data = e.context.data
        output = "";
        if (data.algo == "Base64") {
            output = Base64_encode(data.data_input);
        } else if (data.algo == "Base64(noUrlEncode)") {
            output = btoa(data.data_input);
        } else if (data.algo == "Base91") {
            output = Base91_encode(data.data_input)
        } else if (data.algo == "Base58") {
            output = Base58_encode(data.data_input);
        } else if (data.algo == "Base中文") {
            BaseCN._KeyDict = data.basecn_dict;
            output = BaseCN_encode(data.data_input);
        }
        $.utils.set_value(mapping.data_output, output, doAction);
    }

    function decode(e, c, doAction) {
        data = e.context.data
        output = "";
        if (data.algo == "Base64") {
            output = Base64_decode(data.data_input);
        } else if (data.algo == "Base64(noUrlEncode)") {
            output = atob(data.data_input);
        } else if (data.algo == "Base91") {
            output = Base91_decode(data.data_input)
        } else if (data.algo == "Base58") {
            output = Base58_decode(data.data_input);
        } else if (data.algo == "Base中文") {
            BaseCN._KeyDict = data.basecn_dict;
            output = BaseCN_decode(data.data_input);
        }
        $.utils.set_value(mapping.data_output, output, doAction);
    }

    path = 'crypto/base';
    var export_list = [encode, decode,];
    for (var i = 0; i < export_list.length; i++) {
        $['func'][path + '/' + export_list[i].name] = export_list[i];
    }
}())
