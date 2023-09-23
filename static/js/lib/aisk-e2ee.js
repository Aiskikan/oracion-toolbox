(!function(){
    var BaseCN = {
        _KeyDict: '而何乎乃其且若所为焉也以因于与则者之哀爱安按案拔白败拜报暴备被倍悲北背奔本彼逼辟蔽毕便遍表并伯薄泊博步裁苍操草策曾差尝长超朝陈称诚出除辞驰冲传垂次刺促错处达殆怠旦独笃度断夺发法反放非分奉服伏复盖苟鼓固寡国过何恨厚胡患或疾即既将解结矜竟就绝堪克困怜弥靡莫能内迫期奇迁劝却如若稍色甚审识适是书数孰疏率私遂涕图徒王望微闻恶悉相谢幸延阳要宜狱再造贼振志治置诸族左昂傲包比鄙兵病察彻乘从当道得定伐犯方负赋更故顾观归好号还会惠及极济计加假间简见交竭尽进居举具俱聚决类临虑论漫灭明名命谋难平戚启强请穷求取去全任入塞善少舍涉生胜',
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
    var aiskE2ee = {
        generatePrivate: () => {
            var ecc_key =  eccryptoJS.generatePrivate();
            var cn_key = BaseCN.encode(ecc_key);
            return cn_key;
        },
        getPublic: (private) => {
            var ecc_private_key =  eccryptoJS.arrayToBuffer(BaseCN.decode(private));
            var ecc_public_key = eccryptoJS.getPublicCompressed(ecc_private_key);
            var cn_key = BaseCN.encode(ecc_public_key);
            return cn_key;
        }
    }
    window['aiskE2ee'] = aiskE2ee;
}())