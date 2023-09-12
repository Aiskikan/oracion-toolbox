(!function () {
    //关掉烦人的开发提示（
    Vue.config.productionTip = false;

    //引入相关组件
    const history = History.createHashHistory();
    let amis = amisRequire('amis/embed');
    const match = amisRequire('path-to-regexp').match;

    //相对路由转绝对路由
    function normalizeLink(to, location = history.location) {
        to = to || '';
        if (to && to[0] === '#') {
            to = location.pathname + location.search + to;
        } else if (to && to[0] === '?') {
            to = location.pathname + to;
        }
        const idx = to.indexOf('?');
        const idx2 = to.indexOf('#');
        let pathname = ~idx
            ? to.substring(0, idx)
            : ~idx2
                ? to.substring(0, idx2)
                : to;
        let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
        let hash = ~idx2 ? to.substring(idx2) : location.hash;
        if (!pathname) {
            pathname = location.pathname;
        } else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
            let relativeBase = location.pathname;
            const paths = relativeBase.split('/');
            paths.pop();
            let m;
            while ((m = /^\.\.?\//.exec(pathname))) {
                if (m[0] === '../') {
                    paths.pop();
                }
                pathname = pathname.substring(m[0].length);
            }
            pathname = paths.concat(pathname).join('/');
        }
        return pathname + search + hash;
    }

    //是否为当前链接
    function isCurrentUrl(to, ctx) {
        if (!to) {
            return false;
        }
        const pathname = history.location.pathname;
        const link = normalizeLink(to, {
            ...location,
            pathname,
            hash: ''
        });

        if (!~link.indexOf('http') && ~link.indexOf(':')) {
            let strict = ctx && ctx.strict;
            return match(link, {
                decode: decodeURIComponent,
                strict: typeof strict !== 'undefined' ? strict : true
            })(pathname);
        }
        return decodeURI(pathname) === link;
    }

    //即将跳转时
    function when_updateLocation(location, replace) {
        location = normalizeLink(location);
        if (location === 'goBack') {
            return history.goBack();
        } else if (
            (!/^https?\:\/\//.test(location) &&
                location ===
                history.location.pathname + history.location.search) ||
            location === history.location.href
        ) {
            return;
        } else if (/^https?\:\/\//.test(location) || !history) {
            return (window.location.href = location);
        }
        history[replace ? 'replace' : 'push'](location);
    }

    //跳转时
    function when_jumpTo(to, action) {
        if (to === 'goBack') {
            return history.goBack();
        }
        to = normalizeLink(to);

        if (isCurrentUrl(to)) {
            return;
        }
        if (action && action.actionType === 'url') {
            action.blank === false
                ? (window.location.href = to)
                : window.open(to, '_blank');
            return;
        } else if (action && action.blank) {
            window.open(to, '_blank');
            return;
        }
        if (/^https?:\/\//.test(to)) {
            window.location.href = to;
        } else if (
            (!/^https?\:\/\//.test(to) &&
                to === history.pathname + history.location.search) ||
            to === history.location.href
        ) {
            // do nothing
        } else {
            history.push(to);
        }
    }

    //初始化
    function init() {
        const app = {
            type: 'app',
            brandName: 'lizzhh的工具箱',
            logo: './static/image/logo.png',
            header: {
                type: 'tpl',
                inline: false,
                className: 'w-full',
                tpl: '<div class="flex justify-between"><div>lizzhh的工具箱！</div></div>'
            },
            footer: '<div class="p-2 text-center bg-light">powred by <a href="https://aisuda.bce.baidu.com/amis/">amis</a></div>',
            // asideBefore: '<div class="p-2 text-center">菜单前面区域</div>',
            // asideAfter: '<div class="p-2 text-center">菜单后面区域</div>',
            api: '/static/pages/site.json'
        };
        let amisInstance = amis.embed(
            '#root',
            app,
            {
                location: history.location,
                data: {
                },
                context: {
                }
            },
            {
                updateLocation: when_updateLocation,
                jumpTo: when_jumpTo,
                isCurrentUrl: isCurrentUrl,
                theme: 'cxd'
            }
        );
        history.listen(state => {
            amisInstance.updateProps({
                location: state.location || state
            });
        });
    };

    // lizzhh-toolbox,启动！
    init();
}())