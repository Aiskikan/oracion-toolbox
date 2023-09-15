(!function () {
    const mapping = {
        "HMAC_checkbox": "u:e5b7d89b1715",
        "HMAC_text": "u:b7c9dbbdb046",
        "MD5_checkbox": "u:ed41acd257c7",
        "MD5_text": "u:df886e52edc3",
        "RIPEMD160_checkbox": "u:858edcb36aae",
        "RIPEMD160_text": "u:9069cd613635",
        "SHA1_checkbox": "u:e3b1aae85c10",
        "SHA1_text": "u:7b24ea9f7b9c",
        "SHA256_checkbox": "u:175a709b146f",
        "SHA256_text": "u:698a740966cf",
        "SHA3_checkbox": "u:1b337c456936",
        "SHA3_text": "u:156c49286cdb",
        "SHA512_checkbox": "u:45da1dd86fd8",
        "SHA512_text": "u:db607ca48f23",
        "jisuan_button": "u:1239a78bc5db",
        "outputLength_select": "u:c1341846274d",
        "textarea": "u:3212cabf0a21"
    };



    $['utils']['load_js']('/static/js/lib/crypto-js.js')
    function run_hash(e, c, doAction) {
        data = e.context.data
        var hash_algo_list = [];
        var hmac = false
        if (data.MD5_checkbox) hash_algo_list.push('MD5');
        if (data.SHA1_checkbox) hash_algo_list.push('SHA1');
        if (data.SHA256_checkbox) hash_algo_list.push('SHA256');
        if (data.SHA512_checkbox) hash_algo_list.push('SHA512');
        if (data.SHA3_checkbox) hash_algo_list.push('SHA3');
        if (data.RIPEMD160_checkbox) hash_algo_list.push('RIPEMD160');
        if (data.HMAC_checkbox) hmac = true;

        for (i in hash_algo_list) {
            if (hash_algo_list[i] != 'SHA3') {
                console.log(hash_algo_list[i], data.HMAC_text)
                $['utils']['set_value'](mapping[hash_algo_list[i] + '_text'], CryptoJS[(hmac ? 'Hmac' : '') + hash_algo_list[i]](data.textarea, (hmac ? data.HMAC_text : undefined)).toString(), doAction)
            }
            else {
                console.log(hash_algo_list[i], data.outputLength_select)
                $['utils']['set_value'](mapping[hash_algo_list[i] + '_text'], CryptoJS[(hmac ? 'Hmac' : '') + hash_algo_list[i]](data.textarea, (hmac ? data.HMAC_text : undefined), { outputLength: data.outputLength_select }).toString(), doAction)
            }
        }

    }

    //export
    path = 'crypto/hash';
    var export_list = [run_hash,];
    for (var i = 0; i < export_list.length; i++) {
        $['func'][path + '/' + export_list[i].name] = export_list[i];
    }
    let amisLib = amisRequire('amis');
    amisLib.toast.success("Success: 加载模块 " + path + " 完成", {
        "position": "top-right",
        "closeButton": true,
        "showIcon": true,
        "timeout": 100,
        "className": "theme-toast-action-scope"
    })
}())
