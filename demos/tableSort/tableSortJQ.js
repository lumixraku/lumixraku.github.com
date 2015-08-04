;(function ($) {
    $.fn.tableSort = function () {
        //此刻的this是jQ对象
        return this.each(function(){
            //这里的this是HTML元素
            var colHeads = $(this).find('thead');
            var tbody = $(this).find('tbody');
            var rows = tbody.find('tr');
            var desend = [];
            colHeads.on('click', 'td', function (e) {
                var idx = $(this).index();
                desend[idx] = !desend[idx]; //每一列都有一个变量 经过一次排序后下次再排序是反序
                var descendflag = desend[idx] ? 1 : -1;
                if(descendflag == 1){
                    colHeads.find('.icon').removeClass('icon-arrow-up2');
                    colHeads.find('.icon').removeClass('icon-arrow-down2');
                    $(this).find('.icon').addClass('icon-arrow-up2');
                }else{
                    colHeads.find('.icon').removeClass('icon-arrow-up2');
                    colHeads.find('.icon').removeClass('icon-arrow-down2');
                    $(this).find('.icon').addClass('icon-arrow-down2');
                }
                rows.sort(function (v1, v2) {
                    if (v1.cells[idx].innerText < v2.cells[idx].innerText) {
                        return -1 * descendflag;
                    } else if (v1.cells[idx].innerText > v2.cells[idx].innerText) {
                        return 1 * descendflag;
                    } else {
                        return 0;
                    }
                });
                rows.each(function (idx, item) {
                    tbody.append(item); //对于DIV中已经有的元素再操作append 实际上是移动
                });
            });
        });
    };
})(jQuery);

