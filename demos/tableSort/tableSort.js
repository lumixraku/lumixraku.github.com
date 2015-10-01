var employees = [];
employees[0] = {
    name: "George",
    age: 32,
    retiredate: "March 12, 2014"
};
employees[1] = {
    name: "Edward",
    age: 17,
    retiredate: "June 2, 2023"
};
employees[2] = {
    name: "Christine",
    age: 58,
    retiredate: "December 20, 2036"
};
employees[3] = {
    name: "Sarah",
    age: 62,
    retiredate: "April 30, 2020"
};

//如何对上述数据排序呢?
//实际上是利用arr.sort(function...)
//而不是将某一列的数据都找出来排好序后  再去找对应的行

function sortBy(arr, prop, descend) {
    //descend表示升序还是降序
    descend = descend ? 1 : -1;
    arr.sort(function (a, b) {
        if (a[prop] < b[prop]) {
            return -1 * descend;
        } else if (a[prop] > b[prop]) {
            return 1 * descend;
        } else return 0;
    });
}
sortBy(employees, 'name', true);
console.log(employees);

function sortOrigin() {
    var oTable = document.getElementById('tableTest');
    var oHead = oTable.tHead;
    var colHeads = oHead.getElementsByTagName('td');
    var oTbody = oTable.tBodies[0];
    var oBtn = document.getElementById('sort');
    var arr = []; //用来存放每一个tr
    var isAsc = true; //用来判断升序，还是降序

    var colHeadsArr = [];
    for (var i = 0, len = colHeads.length; i < len; i++) {
        colHeadsArr.push(colHeads[i]);
    }
    //表头事件代理
    oHead.addEventListener('click', function (e) {
        var target = e.target;
        if (target.tagName.toLowerCase() === 'td') {
            var idx = colHeadsArr.indexOf(target); //对第几列进行排序
            //和colHeads一样 oTbody.rows只是NodeList不是数组
            for (var i = 0; i < oTbody.rows.length; i++) {
                arr[i] = oTbody.rows[i];
            }
            //此时arr是行构成的数组
            arr.sort(function (v1, v2) {
                if (v1.cells[idx].innerText < v2.cells[idx].innerText) {
                    return -1;
                } else if (v1.cells[idx].innerText > v2.cells[idx].innerText) {
                    return 1;
                } else {
                    return 0;
                }
            });
            for (var j = 0; j < arr.length; j++) {
                oTbody.appendChild(arr[j]);
            }
        }
    }, false);

}

