title: Browserfiy
---
###怎么添加lib呢
- 手动去官网下载
- 使用bower

###Bower
>参考
>http://blog.fens.me/nodejs-bower-intro/


Bower 是 twitter 推出的一款包管理工具，基于nodejs的模块化思想，把功能分散到各个模块中，让模块和模块之间存在联系，通过 Bower 来管理模块间的这种联系

简单点说 各种lib下载器 (同时还能下载依赖包)

因为会使用到bower命令 最好全局安装

``` bash
npm install bower -g
```
然后使用下面的命令就能在bower_components中看到文件夹
``` bash
bower install jquery
```
lib都下载好了 就可以再用script标签引入

###Browserify
>参考
>http://javascript.ruanyifeng.com/tool/browserify.html


Browserify是一个node.js模块，主要用于改写现有的CommonJS模块，使得浏览器端也可以使用这些模块。使用下面的命令，在全局环境下安装Browserify。
``` bash
$ npm install -g browserify
```
最好在全局环境中安装,  因为后面要用到Browserify这个命令

用Node 的CMD形式随便写两个模块foo.js 和 main.js
[原博中有]  然后
``` bash
browserify main.js -o compiled.js
```
之后在HTML中引入这个 compiled.js 就可以在浏览器中使用刚才的Node模块了


###Debug
现在Browserify支持 source map
在其官方文档中 https://github.com/substack/node-browserify    有这么一个命令
``` bash
$ browserify main.js --debug | exorcist bundle.js.map > bundle.js
```
将main.js 编译成 bundle.js
PS exorcist  也是一个包  需全局安装
这样之后就生成了 bundle.js 和 bundle.js.map
有了source map debug就很方便

###实时更新 Beefy
http://didact.us/beefy/
全局安装beefy
``` bash
beefy main.js:bundle.js --live
```
无需指定debug参数 默认debug就是打开的
--live 是修改后自动刷新





