(!function () {
    const mapping = {
        "curve": "u:7efa3144a172",
        "email": "u:5ef4550e22e5",
        "key_len": "u:28bc79eb9873",
        "name": "u:ac9bb719071f",
        "passphrase": "u:53bde5a81d5a",
        "private_key": "u:bfab4f935c3a",
        "public_key": "u:31f10e38f957",
        "shengcheng_button": "u:5ed716d536cb",
        "type": "u:9a6de723639e"
    };


    $['utils']['load_js']('/static/js/lib/opengpg.js');

    async function genKey(e, c, doAction) {
        data = e.context.data
        try {
            const { privateKey, publicKey } = await openpgp.generateKey({
                type: data.type,
                curve: data.curve,
                userIDs: [{ name: data.name, email: data.email }],
                passphrase: data.passphrase,
                format: 'armored'
            });
            console.log(privateKey, publicKey);
            $['utils']['set_value'](mapping['private_key'], privateKey, doAction);
            $['utils']['set_value'](mapping['public_key'], publicKey, doAction);
        } catch (e) {
            $['utils']['toast_error'](e.message, doAction);
        }

    }


    //export
    path = 'crypto/opengpg/genKeyPair';
    var export_list = [genKey,];
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
