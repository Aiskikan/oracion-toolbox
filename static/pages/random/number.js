(!function () {
    const mapping = {
        "max_number": "u:8f7ee2dafec1",
        "min_number": "u:c1d0656929d7",
        "number_area": "u:54c8dbfc3db4",
        "shengcheng_button": "u:e5291c526983"
    };

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function random_number(e, c, doAction) {
        data = e.context.data
        if (data.min_number > data.max_number) {
            $["utils"]["toast_error"]("min_number > max_number !",doAction);
        }
        $["utils"]["set_value"](mapping.number_area, rand(data.min_number,data.max_number), doAction);
    }

    path = 'random/number';
    var export_list = [random_number,];
    for (var i = 0; i < export_list.length; i++) {
        $['func'][path + '/' + export_list[i].name] = export_list[i];
    }
}())
