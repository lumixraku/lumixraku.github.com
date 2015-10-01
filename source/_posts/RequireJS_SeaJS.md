title: RequireJS SeaJS
---
- 一种是AMD模块规范，针对模块的异步加载，主要用于浏览器端
- 另一种是CommonJS规范，针对模块的同步加载，主要用于服务器端，即node.js环境

###CMD规范
CommonJS的规范： 根据CommonJS规范，一个单独的文件就是一个模块。加载模块使用require方法，该方法读取一个文件并执行，最后返回文件内部的exports对象

###SeaJS定义模块方式
在 SeaJS 里，模块只有一种书写格式
``` javascript
define(function(require, exports, module) {
    var A = require('a');
    A.do();
    return function () {};
});
```

###RequireJS定义模块方式
在 RequireJS 里，模块有多种书写格式，推荐的是
``` javascript
define(['dep1', 'dep2'], function (dep1, dep2) {
    //Define the module value by returning a value.
    dep1.do();
    return function () {};
});
```
>现在RequireJS 也提供了CMD的写法
>模块的依赖可以像 CommonJS 一样「就近定义」
>PS 两者都是以文件做为模块 一个文件一个模块

###AMD执行策略
http://imququ.com/post/amd-simplified-commonjs-wrapping.html
AMD 运行时核心思想是「Early Executing」 也就是提前执行依赖  尽早执行
``` javascript
define(['a', 'b'], function(A, B) {
    //运行至此，a.js 和 b.js 已下载完成（运行于浏览器的 Loader 必须如此）；
    //A、B 两个模块已经执行完，直接可用（这是 AMD 的特性）；

    return function () {};
});
```

###CMD的执行策略
按需执行  CMD 推崇 as lazy as possible.
[只是执行时间晚了 但是加载和RequireJS是一样的]
``` javascript
//main.js
define(function(require, exports, module) {
    //运行至此，mod1.js 和 mod2.js 已经下载完成；

    console.log('require module: main');

    var mod1 = require('./mod1'); //这里才执行 mod1
    mod1.hello();
    var mod2 = require('./mod2'); //这里才执行 mod2
    mod2.hello();

    return {
        hello: function() {
            console.log('hello main');
        }
    };
});
```
写法上可能更易读  「就近」书写

### SeaJS RequireJS 区别   知乎篇
http://www.zhihu.com/question/20342350

- requirejs：一个模块的factory函数执行是紧跟随在define(也就是Evaluate Script脚本模块文件)之后
- seajs: 执行一个模块的factory函数需要等待所有模块define完毕。
- RequireJS的异步模块加载迎合了浏览器端JS程序员固有的异步思维，学习成本低
- RequireJS和Sea.js在资源加载的时间点都是一样的，所以论“懒”的程度都是一样的。差别仅仅在于加载的脚本什么时候执行。RequireJS的依赖模块在回调函数执行前执行完毕，而Sea.js的依赖模块在回调函数执行require时执行。
- 对于非AMD规范的js插件，require js提供了shim支持，非常方便。RequireJS早有了Shim等支持,不需要修改第三方类库就可以完全支持.如Ember,JQuery等引用,都直接可以异步加载为一个模块.
- requirejs目前支持了sourcemap，配合grunt，简直爽爆了。


###SeaJS与RequireJS最大的区别  豆瓣篇
http://www.douban.com/note/283566440/
这篇文章的结论似乎有误  作者最开头也已经注明了
作者一开始认为requeireJS有bug  实际上不是
原因是即使是RequireJS采用了CMD的写法
实际上还是的执行还是不变  也就是预先加载并执行了依赖

关于豆瓣的这个例子 在这篇博文中也有说明
http://imququ.com/post/amd-simplified-commonjs-wrapping.html



####结论
>RequireJS的做法是并行加载所有依赖的模块, 并完成解析后, 再开始执行其他代码, 因此执行结果只会"停顿"1次, 完成整个过程是会比SeaJS要快.
>
>而SeaJS一样是并行加载所有依赖的模块, 但不会立即执行模块, 等到真正需要(require)的时候才开始解析(也就是执行),

####评论
AMD
我个人感觉requirejs更科学，所有依赖的模块要先执行好。被依赖的模块必须先于当前模块执行，而没有依赖关系的模块，可以没有先后。

AMD规范了"依赖提前加载提前执行"的根本

###合并
RequireJS 有 r.js  SeaJS 有spm 来合并
为什么不直接用grunt的concat呢  因为这两者有个要求就是一个模块对应一个文件

###Browserify
Browserify 是一个基于 Node 模块化方案的浏览器端版本

browserify查找语法树种global域下的require和module变量，对其调用进行变形替换。这是静态分析，像module[‘exp‘+’ort’] = {} , require('path'+'to'+‘file')目前还无法被正确替换。

Browserify的出现，不仅仅是让NPM（或者说之前适用于Node.js）上的代码可以给浏览器端使用。更重要的意义，是Browserify代码组织更符合CommonJS规范，让浏览器前端代码也可以通过预编译实现CommonJS规范

###SeaJS和Browserify
>参考
>http://www.zhihu.com/question/20941305

browserify不需要 define(function(require, exports, module) {...}) 。代码更符合CommonJS模块化规范，可以和nodejs共同require同一个文件，以及node_modules里的库

依赖分析时机不一样：SeaJS是在客户端运行时解析依赖，可以说是“运行时”解析；而Browserify是在服务端就依赖分析打包成单个文件，可以说是“预编译”



