title: HTTP && 缓存
---
###一个GET请求
GET请求的所有参数都会在URL中体现

GET http://admin_test.oa.com/qvideo_check?m=release&a=recommend_check&ticket=xxx HTTP/1.1
Host: qunadmin_test.oa.com
Connection: keep-alive
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36
Accept-Encoding: gzip, deflate, sdch
Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2
Cookie: pgv_pvi=33174528; pgv_pvid=5511540156; ext-terminal=n%3A1; km_u=d8e2d0f081e337e5f39795c8200e49f21d12548710fc0d9d40cc134f3bea57ff5f4f2963cb532c97; t_uid=rakuluo; km_uid=luo; ; TCOA_TICKET=436F5964EBF9BFE887E534515FA5327F46673896BF686CC0FFA2D92CEFE263CEE2ED2082BFFC0F363DBA8AD2B5D38F12E53AB0E2D263E8B2AABAB1FA42EB5D9BCA53A608B9DA7B8FF26947AA9150049D86798FEF9F71BEADED4133410949366B66ABFA3CAC6859F1B4C8D1825E42637AC5AA0A2697B8FB0A0F277AE69EE65C7488BC1F641175932A2447540815637B78AC7B0F202B7798D2A2AF6CC502621AE55E3320B1C5A0D4F7767F50D3B4980DC4E099583885644566; ticket=436F5964EBF9BFE887E534515FA5327F3FC0EC28BB30AB7113E34EEA91ACF0A49D54D2F81DC1CEE81693AFCA142CDC90220CEB2729C8D92A93C338D292E5083BB74AC565C96148284E04B136BFD6837E9B5C9817CA57B3D2E673CB640C41238B426EF92B41AC12CA82827F631B52EEE1CCD21E694AD93D1B4DFEB63DA6AE16A90359666D500357DCA5AF5258D6848A7826AC58480D0B9A357D08B936C085E53CDD84C55636F973840



###一个POST请求
包括请求头和请求体(请求体内含参数)两个部分 中间是一个空行
很容易看出这是一个HTTP 1.1类型的请求
POST http://admin_test.oa.com/qvk HTTP/1.1
Host: qunadmin_test.oa.com
Connection: keep-alive
Content-Length: 196
Origin: http://admin_test.oa.com
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Accept: */*
Referer: http://admin_test.com/.....
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2
Cookie: pgv_pvi=33174528; pgv_pvid=5511540156; ext-terminal=n%3A1; km_u=d8e2d0f081532c97; t_uid=rakuluo; km_uid=rakuluo; t_u=3eaac1dbd7b54763%7C845b1588bc2614cb

m=release&a=account_check&ticket=6eb657ca-a01f-11e3-9337-001517bed8zae6&json=%7B%22gid%22%3A1234567%2C%22owner_uin%22%3A1234567%2C%22audit_status%22%3A2%2C%22audit_reason%22%3A%22no%20reason%22%7D


###一个上传图片的POST请求
POST http://localhost/github/repo/drag/ImgUpload/upload.php HTTP/1.1
Host: localhost
Connection: keep-alive
Content-Length: 138569
Origin: http://localhost
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryV9kSbS9Xym2YSdfs
Accept: */*
Referer: http://localhost/github/repo/drag/ImgUpload/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2

------WebKitFormBoundaryV9kSbS9Xym2YSdfs
Content-Disposition: form-data; name="file"; filename="2015-06-19 162748.jpg"
Content-Type: image/jpeg
 ! Exif  MM *
....




### Keep Alive
Connection请求头的值为Keep-Alive时，客户端通知服务器返回本次请求结果后保持连接；Connection请求头的值为close时，客户端通知服务器返回本次请求结果后关闭连接
#### 持久连接是HTTP1.1 中的

普通模式  每个请求/应答客户和服务器都要新建一个连接，完成之后立即断开连接

从HTTP/1.1起，默认都开启了Keep-Alive，保持连接特性，简单地说，当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接。

　　Keep-Alive不会永久保持连接，它有一个保持时间，可以在不同的服务器软件（如Apache）中设定这个时间。

###Keep Alive 应用场景
> 参考
>  http://blog.csdn.net/hguisu/article/details/8608888

访问一个包含有许多图像的网页文件的整个过程包含了多次请求和响应，每次请求和响应都需要建立一个单独的连接，每次连接只是传输一个文档和图像，上一 次和下一次请求完全分离。即使图像文件都很小，但是客户端和服务器端每次建立和关闭连接却是一个相对比较费时的过程，并且会严重影响客户机和服务器的性能。

HTTP1.1支持持久连接，在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟。一个包含有许多图像的网页文件的多个请求和应答可以在一个连接中传输


### 响应长度
- 若响应中出现了Transfer-Encoding:chucked  表示响应长度不固定
transfer-length由“chunked” 传输编码定义，除非消息由于关闭连接而终止
- 若响应中出现的是 Content-Length: xxx  其值表示 entity-length（实体长度）和transfer-length（传输长度）[一般情况下他们长度是一致的  不一致则不能响应 Content-Length]
同时接收到Transfer-Encoding字段和Content-Length头字段，那么必须忽略Content-Length字段
>响应长度的计算方式
>一个字符算一个长度  一个中文字符2个

###204和304
不含有消息体的响应1xx  204[请求成功 不用刷新也不用重定向]  304

###缓存
> 参考
> http://blog.csdn.net/hguisu/article/details/8608888

在HTTP/1.0中，使用Expire头域来判断资源的fresh或stale，并使用条件请求（conditional request）来判断资源是否仍有效。例如，cache服务器通过If-Modified-Since头域向服务器验证资源的Last-Modefied头域是否有更新，源服务器可能返回304（Not Modified），则表明该对象仍有效；也可能返回200（OK）替换请求的Cache对象

为了使caching机制更加灵活，HTTP/1.1增加了Cache-Control头域（请求消息和响应消息都可使用），它支持一个可扩展的指令子集：例如max-age指令支持相对时间戳；private和no-store指令禁止对象被缓存；no-transform阻止Proxy进行任何改变响应的行为。

HTTP/1.1中引入了一个ETag头域用于重激活机制，它的值entity tag可以用来唯一的描述一个资源。请求消息中可以使用If-None-Match头域来匹配资源的entitytag是否有变化。
例如响应的ETag:"553dcec3-3fd"
If-None-Match:"553dcec3-3fd"  他们是匹配的 可以从缓存拿


### 请求头总结
> 参考
> https://www.byvoid.com/blog/http-keep-alive-header
> http://blog.csdn.net/hguisu/article/details/8683290

####Transport头域
-  Connection: close（告诉WEB服务器或者代理服务器，在完成本次请求的响应后，断开连接，不要等待本次连接的后续请求了）  keepalive（告诉WEB服务器或者代理服务器，在完成本次请求的响应后，保持连接，等待本次连接的后续请求）
- Host：指定被请求资源的Internet主机和端口号

####Client 头域
- Accept：告诉WEB服务器自己(浏览器)接受什么介质类型(MIME)，* 代表任意类型  Accept: */*  代表浏览器可以处理所有类型

- Accept-Encoding  告诉服务器,声明浏览器支持的编码方法  通常指定压缩方法，是否支持压缩，支持什么压缩方法（gzip，deflate），（注意：这不是只字符编码）;
                                Accept-Encoding: compress, gzip //支持compress 和gzip类型
>在Linux中经常会用到后缀为.gz的文件，它们就是GZIP格式的。现今已经成为Internet 上使用非常普遍的一种数据压缩格式
 - Accept-Charset: 浏览器申明自己接收的字符集

####Cache头域
- Cache-Control[响应中也有次头域]
    -  no-cache  请求的资源不会缓存
    -  max-age（只接受 Age 值小于 max-age 值，并且没有过期的对象
    -  min-fresh：（接受其新鲜生命期大于其当前 Age 跟 min-fresh 值之和的缓存对象）

-  If-Modified-Since：把浏览器端缓存资源的最后修改时间发送到服务器去.务器会把这个时间与服务器上实际文件的最后修改时间进行对比。如果时间一致，那么返回304，客户端就直接使用本地缓存文件。如果时间不一致，就会返回200和新的文件内容。客户端接到之后，会丢弃旧文件，把新文件缓存起来，并显示在浏览器中。[不同的机器可能会有时间不同步的问题  所以HTTP1.1引入Etag]
-  If-Node-Match: If-None-Match和ETag一起工作，工作原理是在HTTP Response中添加ETag(类似于MD5一样的文件标识码)信息。 如果服务器验证资源的ETag没有改变（该资源没有更新），将返回一个304状态告诉客户端使用本地缓存文件。否则将返回200状态和新的资源和Etag.
请求If-None-Match:"5551df47-6c4"
响应头中ETag:"5551df47-6c4"        两者匹配  可以从缓存中取资源
- Pargma只有一个用法， 例如： Pragma: no-cache 请求的资源不会被缓存

####Cookie头域
Cookie: 最重要的header, 将cookie的值发送给HTTP 服务器


####Entity头域
- Content-Length作用：发送给HTTP服务器数据的长度。即请求消息正文的长度
- Content-Type:application/x-www-form-urlencoded

####其他域
-  Referer：浏览器向 WEB 服务器表明自己是从哪个 网页/URL 获得/点击 当前请求中的网址/URL

###响应头总结
####Cache头域
- Date: 响应的时间(服务器时间)
- Expired[HTTP 1.0]：资源国企时间

####Cookie/Login 头域
- p3p: 用于跨域设置Cookie, 这样可以解决iframe跨域访问cookie的问题
- Set-Cookie 用于把cookie 发送到客户端浏览器

####Entity实体头域
- ETag[HTTP1.1]：就是一个对象（比如URL）的标志值，就一个对象而言，比如一个 html 文件，如果被修改了，其 Etag 也会别修改，所以ETag 的作用跟 Last-Modified 的作用差不多，主要供 WEB 服务器判断一个对象是否改变了
比如前一次请求某个 html 文件时，获得了其 ETag，当这次又请求这个文件时，浏览器就会把先前获得的 ETag 值发送给WEB 服务器，然后 WEB 服务器会把这个 ETag 跟该文件的当前 ETag 进行对比，然后就知道这个文件有没有改变了。
-  Last-Modified：WEB 服务器认为对象的最后修改时间，
- Content-Type：WEB服务器告诉浏览器自己响应的对象的类型和字符集,
- Content-Encoding:  gzip  WEB服务器表明自己使用了什么压缩方法（gzip，deflate）
- Content-Length： WEB 服务器告诉浏览器自己响应的对象的长度。例如：Content-Length: 26012
- Content-Type： WEB 服务器告诉浏览器自己响应的对象的类型。例如：Content-Type：application/xml


####Transport头域
- Connection
    - Connection: keep-alive   当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接
    - Connection: close  代表一个Request完成后，客户端和服务器之间用于传输HTTP数据的TCP连接会关闭， 当客户端再次发送Request，需要重新建立TCP连接。


####其他头域
- Server：Apache/2.2.8 (Win32) PHP/5.2.5

-  Age：当代理服务器用自己缓存的实体去响应请求时，用该头部表明该实体从产生到现在经过多长时间了。

-  Transfer-Encoding: WEB 服务器表明自己对本响应消息体（不是消息体里面的对象）作了怎样的编码，比如是否分块（chunked）

