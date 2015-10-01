title: WebWorker
---
###WebWorker 是什么?
- 为 JavaScript 引入线程技术  不必再用  setTimeout()、setInterval()、XMLHttpRequest 来模拟并行
- Worker 利用类似线程的消息传递实现并行。这非常适合您确保对 UI 的刷新、性能以及对用户的响应。
- Web Worker 的三大主要特征：能够长时间运行（响应），理想的启动性能以及理想的内存消耗。

它允许在 Web 程序中并发执行多个 JavaScript 脚本，每个脚本执行流都称为一个线程，彼此间互相独立，并且有浏览器中的 JavaScript 引擎负责管理。这将使得线程级别的消息通信成为现实。使得在 Web 页面中进行多线程编程成为可能。

专用 Web Worker (Dedicated Web Worker) 提供了一个简单的方法使得 web 内容能够在后台运行脚本。一旦 worker 创建后，它可以向由它的创建者指定的事件监听函数传递消息，这样该 worker 生成的所有任务就都会接收到这些消息。


###WebWorker 的类型
一个是专用线程 Dedicated Worker(普通的Worker)，一个是共享 Shared Worker。
后来又有了Service Worker

###Webworker的支持情况
http://caniuse.com/#search=shared
Service Worker 支持情况不佳 Chrome 40+ 才支持

###使用入门
和windows线程通信一个机制  发消息 接收消息
>参考
>http://www.html5rocks.com/zh/tutorials/workers/basics/
>http://www.ibm.com/developerworks/cn/web/1112_sunch_webworker/
>http://tutorials.jenkov.com/html5/web-workers.html



##Debug
chrome://inspect/#workers   Worker Debug页
通过这个页面可以确定


###专用Worker  Dedicated Worker
创建一个新的 worker 十分简单。你所要做的就是调用 Worker() 构造函数，指定一个要在 worker 线程内运行的脚本的 URI，如果你希望能够收到 worker 的通知，可以将 worker 的 onmessage 属性设置成一个特定的事件处理函数。
``` javascript
var myWorker = new Worker("my_task.js");
myWorker.onmessage = function (oEvent) {
    console.log("Called back by the worker!\n");
};
```
或者，你也可以使用 addEventListener()：
``` javascript
var myWorker = new Worker("my_task.js");
myWorker.addEventListener("message", function (oEvent) {
    console.log("Called back by the worker!\n");
}, false);
    myWorker.postMessage(""); // start the worker.
```

>停止 Worker 的方法有两种：在主网页中调用 worker terminate()，或在 Worker 本身内部调用 self.close()。

###Worker的作用域
self 和 this 指的都是 Worker 的全局作用域
因此下面两种方式是相同的
``` javascript
self.addEventListener('message', function(e) {
      self.postMessage('Unknown command: ' + data.msg);
}, false);
addEventListener('message', function(e) {
      postMessage('WORKER STARTED: ' + data.msg);
}, false);
```

>一些Demo参考 https://github.com/greenido/Web-Workers-Examples-   (SharedWorker也包含在内)

###import 和 子worker(Chrome并不支持)
import可以引入其他的JS

###WebWorker限制
- DOM（非线程安全）
- window 对象
- document 对象
- parent 对象


###SharedWorker
>参考
>https://github.com/mdn/simple-shared-worker
>http://tutorials.jenkov.com/html5/web-workers.html
An ordinary web worker is only accessible by the page that created it. If you want to share a web worker between multiple pages, you can use a SharedWorker. A SharedWorker is accessible by all pages that are loaded from the same origin (domain).

The SharedWorker interface represents a specific kind of worker that can be accessed from several browsing contexts, such as several windows, iframes or even workers. They implement an interface different than dedicated workers and have a different global scope,

>If SharedWorker can be accessed from several browsing contexts, all those browsing contexts must share the exact same origin (same protocol, host and port).

###创建一个SharedWorker
``` javascript
var worker = new SharedWorker("/html5/web-worker-shared.js");
worker.port.addEventListener("message",
        function(event) {
            alert(event.data);
        }
        , false
);
worker.port.start();
```
或者使用
``` javascript
        worker.port.onmessage = function(e){
            log.textContent = e.data;
            console.log(e.data);
        };
```
此种方式不需要worker.port.start();  但是存在事件被覆盖的问题

###实现SharedWorker

``` javascript
onconnect = function (e) {
    var port = e.ports[0];
    port.postMessage('A new connection! The current connection number is ' + connect_number);
    port.onmessage = function (e) {
        var instruction = e.data.instruction || e.data;
        var results = execute_instruction(instruction);
        port.postMessage('...');
    };
    port.start();
};
```

>Demo参考https://github.com/mdn/simple-shared-worker


###SharedWorker 可以做什么
- load further scripts with importScripts()
- attach error handlers, and
- run the port.close() method to prevent further communication on a specific port.

Shared web workers probably won’t be a viable technology for a couple of years, but they raise exciting opportunities for the future of JavaScript development. Let’s hope browser vendors can supply a few decent tracing and debugging tools!

###WebWorker和SharedWorker区别
Very basic distinction: a Worker can only be accessed from the script that created it, a SharedWorker can be accessed by any script that comes from the same domain.

SharedWorker's seem to have more functionality then Worker.
Among that functionality is :
- A shared global scope. All SharedWorker instances share a single global scope.
- A shared worker can work with multiple connections. It posts messages to ports to allow communication between various scripts.
- A dedicated worker on the other hand is simply tied to its main connection and cannot post messages to other scripts (workers).


###ServiceWorker
A Service Worker inherits all the limitations and behaviors available to HTML5 Shared Workers. It can create XMLHttpRequests, use WebSockets, receive messages from windows and the browser, use IndexedDB, and post messages to other windows.

Service workers are expected to provide a function at global scope, named onconnect. The browser will invoke onconnect at startup time, passing in an event. The worker should access the ports property of this event to extract a stable communication port back to the browser, and persist it for the life of the worker

>参考
>http://www.w3ctech.com/topic/866
http://www.html5rocks.com/en/tutorials/service-worker/introduction/
>http://www.html5online.com.cn/articles/2015051201.html
>https://github.com/csbun/blog/blob/master/_posts/2015-06-02-service-worker.markdown

####我的Demo
https://github.com/lumixraku/repo/tree/master/WebWorker/ServiceWorker


###ServiceWorker 和 SharedWorker
The ServiceWorker is like a SharedWorker in that it:

- Runs in its own global script context (usually in its own thread)
- Isn't tied to a particular page
- Has no DOM access

Unlike a SharedWorker, it:
- Can run without any page at all
- Can terminate when it isn't in use, and run again when needed (e.g., it's event-driven)
- Has a defined upgrade model
- Is HTTPS only (more on that in a bit)
>关于第一点  如果所有引用SharedWorker的页面都关了话  SharedWorker就不存在了  ServiceWorker不是

http://stackoverflow.com/questions/28882289/service-worker-vs-shared-worker

A service worker has additional functionality beyond what's available in shared workers, and it has a longer lifespan
serviceworker要比SharedWorker多一些功能 且有更长的生命周期
service和shared一样可以对 message 作响应
service还可以处理fetch事件(可以拦截网络请求)  以及从cache中做出响应
还有个区别就是生命周期
一个service注册到一个域名后  就是永久注册 (如果相关文件改变了 service就会更新)


###We can use ServiceWorker:

- To make sites work faster and/or offline using network intercepting
- As a basis for other 'background' features such as push messaging and background synchronization

现在service worker的最佳使用场景是提供离线能力。开发人员可以注册一个service worker作为网络代理提供网络拦截。即使没有可用的网络时，这个代理也能够对缓存的数据和资源或者是已经生成的内容作出响应

和现有的HTML5数据缓存功能有很大的不同，service worker的离线能力是可编程的。Russell称它是一个：“让你做出选择去做哪些事的、可编程的、浏览器内置的代理”。由于service worker运行于后台，它和当前的Web页面完全独立

>由于安全问题，ServiceWorker 只能在 HTTPS 环境下运行, 另外localhost 也OK。

###更新service worker
如果sw有更新  下次访问的时候就会重新下载sw 且重新触发install
但是此时旧的worker仍然在管理着cache  新sw处于waiting状态
现有页面关闭后旧的sw就会被清掉  新sw接管 触发activate事件


