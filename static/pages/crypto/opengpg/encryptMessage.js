(!function () {
    const mapping = {
        "encrypted": "u:d06b8dd92558",
        "jiami_button": "u:590602640cf7",
        "passphrase": "u:301d1b2e96e7",
        "private_key": "u:cf5f4d64fc63",
        "public_keys": "u:20b0cf0e7541",
        "sign_switch": "u:3e6ce66afd82",
        "text": "u:f5f79fafa103"
    };


    $.utils.load_js('/static/js/lib/opengpg.js');

    async function encrypt(e, c, doAction) {
        data = e.context.data
        try {
            if (data.public_keys.length == 0) {
                $.utils.toast_error('请添加公钥', doAction);
                return;
            }
            const publicKeys = await Promise.all(data.public_keys.map(armoredKey => openpgp.readKey({ armoredKey: armoredKey['public_keys'] })));

            var privateKey = undefined;
            console.log(data.passphrase,data.private_key ,data.sign_switch)
            if (data.sign_switch) {
                privateKey = await openpgp.decryptKey({
                    privateKey: await openpgp.readKey({ armoredKey: data.private_key }),
                    passphrase: data.passphrase
                });
            }
            console.log(privateKey);
            var message = await openpgp.createMessage({ text: data.text });
            const encrypted = await openpgp.encrypt({
                message: message,
                encryptionKeys: publicKeys,
                signingKeys: privateKey
            });
            console.log(encrypted);
            $.utils.set_value(mapping.encrypted, encrypted, doAction);
            console.log(data);
        } catch (e) {
            $.utils.toast_error(e.message, doAction);
        }
    }

    path = 'crypto/opengpg/encryptMessage';
    var export_list = [encrypt,];
    for (var i = 0; i < export_list.length; i++) {
        $['func'][path + '/' + export_list[i].name] = export_list[i];
    }
}())
