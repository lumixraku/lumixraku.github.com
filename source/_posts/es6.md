title: ES6
---
>先阅读这个
>http://gejiawen.github.io/2015/07/28/Javascript/ECMAScript6%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E7%B3%BB%E5%88%97/ECMAScript6%E6%96%B0%E7%89%B9%E6%80%A7%E7%AE%80%E4%BB%8B/

ES6的特性在chrome中默认是关闭的
Visit chrome://flags/#enable-javascript-harmony, enable this flag, restart Chrome
>注意
>请在 Chrome Canary 中使用新特性
>至少我这里Chrome 44 在选择打开后仍然无效


###  => 箭头函数
``` javascript
var arr = [1, 2, 3];

// 传统写法
arr.forEach(function (v) {
    console.log(v);
});

// 使用箭头操作符
arr.forEach( v => console.log(v));

```
更多例子

``` javascript
// ES5
var total = values.reduce(function (a, b) {
  return a + b;
}, 0);

// ES6
var total = values.reduce((a, b) => a + b, 0);
```
如果回调函数语句不止一行呢

``` javascript
// ES5
$("#confetti-btn").click(function (event) {
  playTrumpet();
  fireConfettiCannon();
});

// ES6
$("#confetti-btn").click(event => {
  playTrumpet();
  fireConfettiCannon();
});
```

### for of
- forEach有什么缺点呢
不能使用 break 语句来跳出循环，也不能使用 return 语句来从闭包函数中返回。总之 没有办法中止 forEach 循环 如果要中止，可使用  Array.every 或 Array.some

- 如果使用for in呢
``` javascript
for (var index in myArray) {
  console.log(myArray[index]);
}
```
更不推荐  因为会遍历到其他属性上去

- for of 它支持 break、continue 和 return 语句。
```javascript
for (var value of myArray) {
  console.log(value);
}
```

for-of 不仅仅是为数组设计，还可以用于类数组的对象，比如 DOM 对象的集合 NodeList
>代码来自
>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
>目前Chrome Canary 46 并不支持

``` javascript
let articleParagraphs = document.querySelectorAll("article > p");

for (let paragraph of articleParagraphs) {
  paragraph.classList.add("read");
}
```

###Class
>代码来自
>http://gejiawen.github.io/2015/07/28/Javascript/ECMAScript6%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E7%B3%BB%E5%88%97/ECMAScript6%E6%96%B0%E7%89%B9%E6%80%A7%E7%AE%80%E4%BB%8B/

``` javascript
// 类的定义
class Animal {
    // ES6中的构造器，相当于构造函数
    constructor(name) {
        this.name = name;
    }

    // 实例方法
    sayName() {
        console.log('My Name is ' + this.name);
    }
}

// 类的继承
class Programmer extends Animal {
    constructor(name) {
        // 直接调用父类构造器进行初始化
        super(name);
    }

    // 子类自己的实例方法
    program() {
        console.log('I\'am coding...');
    }

    // 静态方法
    static LEVEL() {
        console.log('LEVEL BAD!');
    }
}

// 一些测试
var doggy=new Animal('doggy'),
larry=new Programmer('larry');
doggy.sayName(); // ‘My name is doggy’
larry.sayName(); // ‘My name is larry’
larry.program(); // ‘I'm coding...’
Programmer.LEVEL(); // ‘LEVEL BAD!’

```

###解构赋值
>摘自>http://gejiawen.github.io/2015/07/28/Javascript/ECMAScript6%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E7%B3%BB%E5%88%97/ECMAScript6%E6%96%B0%E7%89%B9%E6%80%A7%E7%AE%80%E4%BB%8B/
利用这个特性，我们可以让一个函数返回一个数组，然后利用解构赋值得到数组中的每一个元素。

``` javascript

function getVal() {
    return [1, 2];
}

var [x, y] = getValue();
var [name, age] = ['larry', 26];
// 交换两个变量的值
var [a, b] = [1, 2];
[a, b] = [b, a];
console.log('a: ' + a + ', b: ' + b);
```

### 新增集合 Map, Set, WeakMap, WeakSet

Set是单纯的集合  很像数组
```  javascript
var s = new Set();
s.add("hello").add("goodbye").add("hello");
s.size === 2;
s.has("hello") === true;
```
Map 很明显啦 key-value
``` javascript
var m = new Map();
m.set("hello", 42);
m.set(s, 34);  //这个s 是上面的set
m.get(s) == 34;
```
WeakSet
``` javascript
var ws = new WeakSet();
ws.add({ data: 42 });
```
WeakMap 简单的键/值映射.但键只能是对象值,不可以是原始值.

``` javascript
var wm1 = new WeakMap();
var o1 = {};
wm1.set(o1, 37);
wm1.get(o1); //37
```
>和Map Set 区别
>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
>references to objects in the collection are held weakly. If there is no other reference to an object stored in the WeakSet, they can be garbage collected. That also means that there is no list of current objects stored in the collection
>The key in a WeakMap is held weakly.  What this means is that, if there are no other strong references to the key, then the entire entry will be removed from the WeakMap by the garbage collector.

###Array.from
这里的links 是真的数组哟  具备 forEach() 函数
``` javascript
var links = Array.from(document.querySelectorAll("aside > a"));
for (var l of links) {
    console.log(l.href);
}

```
