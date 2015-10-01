title: JS 节流阀
---
>参考 https://github.com/hahnzhu/read-code-per-day/issues/5

###节流阀
``` javascipt
var resizeTimer = null;
$(window).on('mousemove', function (e) {
        console.log('move');
    /* 第一次访问，不存在 resizeTimer，跳过这里 */
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    /* 第一次访问，赋值给 resizeTimer，绑定的函数 400ms 后调用 */
    resizeTimer = setTimeout(function(){
        console.log("move timer" /*+ e.clientX + '-' + e.clientY*/ );
    }, 40);
});
```
发现实际中并不是40ms调用一次move timer
原因就在于timeout  它是等这个函数执行完之后间隔40ms 才有机会去执行下一个函数


###函数去抖

``` javascript
    function debounce(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function() {
            console.log('move');// 这个函数是mousemove事件处理的函数
            var context = scope || this;

            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }
    $('body').on('mousemove', function() {
        console.log('move');
    });
    $('body').on('mousemove', debounce(function(event) {
        console.log('tick');
    }, 1000));
```
每次mousemove都是在执行 debounce返回的一个函数
这个返回的函数用到了debounce中的一个变量last
奇怪! 这个last 又不是全局的变量  为什么这个函数每次执行都依赖上次last的结果?  因为这里是一个闭包

### 通过闭包 使局部变量变成全局变量
因为这个a后面一直被fun函数使用  所以这个变量不会被销毁  正是闭包特性
``` javascript
function closure(){
    var a = 1;
    return function(){
        return ++a;
    }
}
fun = closure();
console.log(fun());//2
console.log(fun());//3
console.log(fun());//4
```
