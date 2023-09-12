(!function () {
    path = 'random/number/';
    function action(e,c,doAction){
        $['utils']['toast_success']('测试OK！',doAction);
    }
    //export
    var export_list = [action];
    for (var i = 0; i < export_list.length; i++) {
        $['func'][path + export_list[i].name] = export_list[i];
    }
}())