title: Promise
---

>参考
>http://lucifier129.github.io/nodeppt/20150528/promise.htm
>http://efe.baidu.com/blog/promises-anti-pattern/
> http://www.html5rocks.com/zh/tutorials/es6/promises/#toc-api

###使用浏览器的Promise
将一个非Promise变成Promise

``` javascript
    function get(url) {
        // 返回一个新的 Promise
        return new Promise(function(resolve, reject) {
            // 经典 XHR 操作
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function() {
                // 当发生 404 等状况的时候调用此函数
                // 所以先检查状态码
                if (req.status == 200) {
                    // 以响应文本为结果，完成此 Promise
                    resolve(req.response);
                } else {
                    // 否则就以状态码为结果否定掉此 Promise
                    // （提供一个有意义的 Error 对象）
                    reject(Error(req.statusText));
                }
            };

            // 网络异常的处理方法
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // 发出请求
            req.send();
        });
    }
    story = get('story.json');
    story.then(function(res){
        return JSON.parse(res);
    }).then(function(obj){
        console.log(obj);
    });
```

再来一个例子
我把ajax的例子放在前面是因为我觉得 ajax的使用场景会更容易理解
``` javascript
    var getData = function(){
        var data;
        setTimeout(function(){
            data = 'data';
        },0);
        return data;
    }
    console.log(getData()); //undefined //显然这样是得不到结果的
    //所以我们必须传入一个回调函数
    var getData = function(callback){
        var data;
        setTimeout(function(){
            data = 'data';
            callback(data);
        },0);
    }
    getData(function(data){
        console.log(data)
    });
```
改成Promise
``` javascript
    var getData = function(){
        var promise = new Promise(function(resolve, reject){
            setTimeout(function(){
                resolve('data');
            },0);
        });
        return promise;
    }
    getData().then(function(data){
        console.log(data);
    });

```
###关于defer
下面是用Q.js 的defer
 > http://efe.baidu.com/blog/promises-anti-pattern/ 这里建议不在使用defer
> 尽管这个写法在https://github.com/kriskowal/q 中可以看到

``` javascript
    function load(url) {
        var deferred = Q.defer();
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                deferred.resolve(req.responseText);
            }
        }
        req.open('GET', url, true);
        req.send();
        return deferred.promise;
    }
    load('story.json').then(function(data) {
        console.log(data);
    });
```
最好这么用 (这里实际上就是告诉你如何用Q.js包装出一个Promise)
``` javascript
    function load(url){
        return Q.Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    resolve(req.responseText);
                }
            }
            req.open('GET', url, true);
            req.send();
        });
    }
    load('story.json').then(function(data) {
        console.log(data);
    });
```

###链式操作
比如我需要等意见事情做完了再做另一件事情
最容易想到的
``` javascript
    get('story.json').then(function(data){
        get('story.txt').then(function(data2){
            get('xxx').then(function(data3){
                //.....
            })
        })
    });
```
突然觉得不对  不是说Promise是用来解决嵌套的问题嘛  这看起来还是在嵌套啊

我们需要return一个promise对象  这才是真正解决深层嵌套
```javascript
    get('story.json').then(function(data){
        return get('story.txt');
    }).then(function(rs){
        console.log(rs); //虽然前一个Promise返回的是一个Promise对象  但是这里的rs并不是一个Promise  而是前面的Promise对象resolve的结果 //也就是story.txt中的内容
        return get('xxx');
    }).then(function(xxx){
        return get('dot');
    }).then(function(dot){
        //...
    })
```
>当然了 假如你需要某次回调中得到所有异步的结果  你可以用第一种嵌套形式
>或者使用Promise.all

###Promise.all

``` javascript
    var p1 = Promise.resolve(1),
        p2 = Promise.resolve(2),
        p3 = Promise.resolve(3);
    Promise.all([p1, p2, p3]).then(function (results) {
        console.log(results);  // [1, 2, 3]
    });
    //Promise.all 常用在 forEach 中
    //比如
    get('story.json').then(function(story){
        var promiseArr = story.chapters.map(function(chapter){
            return get(chapter.url);
        });
        return Promise.all(promiseArr);
    }).then(function(resultsArr){
        //resultsArr 是一个数组
    })

```
