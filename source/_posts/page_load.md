title:提高页面访问速度
---
>参考
>https://developer.yahoo.com/performance/rules.html
>http://www.ghugo.com/performance-rules-web-site/(中文)

###减少请求
- 图片合并
- HTTP1.1 Keep-Alive

###GET缓存
GET 一个相同的URL 只有一个结果[相同是指 整个URL字符串完全匹配]
所以 第二次访问的时候 如果 URL字符串没变化 浏览器是 直接拿出了第一次访问的结果

>若我希望GET每次都是新的结果  则需加上 ？+new Date();，[总之就是使每次访问的URL字符串不一样的]

对于AJAX的GET请求还可以这样
> - setRequestHeader("If-Modified-Since","0");
> - setRequestHeader("Cache-Control","no-cache");

###GET POST究竟有什么区别
> 参考http://www.zhihu.com/question/31640769

一般来说 GET 传送数据量有限(某些ie版本的限制)，安全性低，会被缓存，而POST反之。
![enter image description here](http://pic3.zhimg.com/ad46b512903694303423954df74aafd6_r.jpg)


- 请求中的URL可以被手动输入
- 请求中的URL可以被存在书签里，或者历史里，或者快速拨号里面，或者分享给别人。(搜索引擎，可以用get分享搜索结果)
- 请求中的URL是可以被搜索引擎收录的。
- 带云压缩的浏览器，比如Opera mini/Turbo 2, 只有GET才能在服务器端被预取的。
- 请求中的URL可以被缓存。

get表达的是一种幂等的[也就是请求1次和n次是一样的]，只读的，纯粹的操作，即它除了返回结果不应该会产生其它副作用（如写数据库），因此绝大部分get请求（通常超过90%）都直接被CDN缓存了，这能大大减少web服务器的负担。

既然GET是幂等 所以用来添加删除之类的操作是不合适的


####为什么GET不安全
显然Chrome Fiddler等都是可以看到POST请求中的数据的  所以说GET的请求在地址栏中会被看到所以不安全这个说法并不成立
当然了POST也只比GET安全那么一点点而已 所以HTTPS还是很有必要的

- GET请求会被历史记录
- 服务器会在日志中记录所有的GET请求  linux中是 access_log  windows中是access.log这个文件, 而日志并没有记录POST

>MORE
>http://www.w3schools.com/tags/ref_httpmethods.asp
>http://stackoverflow.com/questions/198462/is-either-get-or-post-more-secure-than-the-other

###预加载


###后加载

###使用GET来完成AJAX请求

###服务端
- 使用内容分发网络CDN
是由一系列分散到各个不同地理位
置上的Web服务器组成的，它提高了网站内容的传输速度.拥有最少网络跳数（network hops）和响应速度最快的服务器会被选定
- 为文件头指定Expires或Cache-Control
- Gzip压缩文件内容
- 配置ETag


###css
- 样式表置顶
如果将样式表放在底部，浏览器会拒绝渲染已经下载的网页，因为大多数浏览器在实现时都努力避免重绘

- 避免使用CSS表达式（Expression）
- 使用外部文件JavaScript和CSS
外部文件可以提高页面速度，因为JavaScript和CSS文件都能在浏览,器中产生缓存。内置在HTML文档中的JavaScript和CSS则会在每次请求中随HTML文档重新下载
- 压缩JavaScript和CSS
- 用link代替@import
前面的最佳实现中提到 CSS 应该放置在顶端以利于有序加载呈现 因为@import规则有可能胡导致白屏现象，即使把@import规则放在文档的head标签中也是如此。import中的css将会后加载
- 避免使用滤镜

###JS
- 把脚本置于页面底部
脚本带来的问题就是它阻止页面平行下载 HTTP1.1建议 每个主机名的并行下载内容不超过两个。如果你的图片放在多个主机名上，你可以在每个并行下载中同时下载 2个以上的文件。但是当下载脚本时，浏览器就不会同时下载其它文件了，即便是主机名不相同。
- 削减JavaScript和CSS
- 减少DOM访问
- 开发智能事件处理程序
如果你在一个div中有 10 个按钮，你只需要在div上附加一次事件句柄就可
以了，而不用去为每一个按钮增加一个句柄。事件冒泡时你可以捕捉到事件并判断出是
哪个事件发出的。

###其它
- 减小Cookie的体积
注意在适应级别的域名上设置 coockie 以便使子域名不受影响
- 对静态内容的请求是无coockie的请求。创建一个子域名并用他来存放所有静态内容。
- favicon.ico 要小而且可缓存
