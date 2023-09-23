(!function () {
    const mapping = {
        "decrypted": "u:d06b8dd92558",
        "jiemi_button": "u:590602640cf7",
        "passphrase": "u:301d1b2e96e7",
        "private_key": "u:cf5f4d64fc63",
        "public_keys": "u:20b0cf0e7541",
        "sign_must_switch": "u:8657067c417d",
        "sign_switch": "u:3e6ce66afd82",
        "text": "u:f5f79fafa103"
    };

    $.utils.load_js('/static/js/lib/opengpg.js');


    async function decrypt(e, c, doAction) {
        data = e.context.data
        try {
            var publicKeys = undefined
            var privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readKey({ armoredKey: data.private_key }),
                passphrase: data.passphrase
            });
            if (data.sign_switch) {
                publicKeys = await Promise.all(data.public_keys.map(armoredKey => openpgp.readKey({ armoredKey: armoredKey['public_keys'] })));
            }
            var message = await openpgp.readMessage({ armoredMessage: data.text });
            const { data: decrypted, signatures } = await openpgp.decrypt({
                message,
                decryptionKeys: privateKey,
                expectSigned: data.sign_must_switch,
                verificationKeys: publicKeys
            });
            console.log(signatures);
            if(data.sign_switch){
                try {
                    await signatures[0].verified;
                    $.utils.toast_success(`签名校验完成 \n签名时间:${(await signatures[0].signature)['packets'][0]['created']}`, doAction, 0xffff);
                } catch (e) {
                    $.utils.toast_warn('签名校验失败', doAction, 0xffff);
                }
            }
            $.utils.set_value(mapping.decrypted, decrypted, doAction);
        } catch (e) {
            $.utils.toast_error(e.message, doAction);
        }
    }

    //export
    path = 'crypto/opengpg/decryptMessage';
    var export_list = [decrypt,];
    for (var i = 0; i < export_list.length; i++) {
        $['func'][path + '/' + export_list[i].name] = export_list[i];
    }
}())
