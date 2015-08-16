title: 自制一个简单的模板引擎
---
###原理
我这个模板引擎的原理就是简单的字符串替换

###第一版
``` javascript
{% raw -%}
var data = {
    username: 'Muhha'
}
str = '<%=username%>';
var compile = function(str){
    var tpl = str.replace(/<%=([\s\S]+?)%>/,function(match, p1){
        return 'obj.' + p1;
    }); // 得到 obj.username

    tpl = 'return ' + tpl; // return obj.username
    return new Function('obj',tpl); //function(obj){return obj.username}
}
var compiled = compile(str);
var rs = compiled(data); // Muhha
{%- endraw %}
```
缺点很明显  只能对```<%=obj.xxx%>```这样的部分作替换, 若模板变成```<p><%=username%></p>``` 这样就不能通过

###第二版
上面有缺陷的原因就在于替换的之后只考虑了呗替换的部分, 那些没有被替换的部分 比如   ```<p>``` 没有考虑

``` javascript
{% raw -%}
var data = {
    username: 'Muhha'
}
str = '<p><%=username%></p>';
var compile = function(str){
    var tpl = str.replace(/<%=([\s\S]+?)%>/gi,function(match, p1){
        return  '\'+' + 'obj.' + p1 + '+\'';
    }); // 得到 <p>' + obj.username + '</p>

    tpl = 'return ' + '\'' +tpl + '\''; //return '<p>' + obj.username + '</p>'
    return new Function('obj',tpl); //function(obj){return '<p>' + obj.username + '</p>'}
}
var compiled = compile(str);
var rs = compiled(data); // <p>Muhha</p>
{%- endraw %}
```
多加一个属性
``` javascript
{% raw -%}
var data = {
    username: 'Muhha',
    age: 12
}
str = '<p><%=username%></p><p><%=age%></p>';
var compile = function(str){
    var tpl = str.replace(/<%=([\s\S]+?)%>/gi,function(match, p1){
        return  '\'+' + 'obj.' + p1 + '+\'';
    }); // 得到 <p>' + obj.username + '</p><p> '+ obj.age + '</p>

    tpl = 'return ' + '\'' +tpl + '\''; //return '<p>' + obj.username + '</p><p>'+ obj.age + '</p>'
    return new Function('obj',tpl); //return '<p>' + obj.username + '</p><p>'+ obj.age + '</p>'}
}
var compiled = compile(str);
var rs = compiled(data); // <p>Muhha</p><p>12</p>
{%- endraw %}
```
不过这仍然是有缺陷的, 比如不能使用语句
当模板写成```str = 'if(gender>1){<p><%=username%></p>}<p><%=age%></p>';``` 这样时
得到的结果是```if(gender>1){<p>Muhha</p>}<p>12</p>```
显然这对逻辑没有解析, 原因就在于return太早了
把整个模板当成了一个结果return了
我们期待的模板函数是这样的
``` javascript
{% raw -%}
var tpl = '';
if(gender ==1){
    tpl +='<p>'+ obj.gender +'</p>';
}
tpl += '<p>' + obj.age +'</p>';
return tpl;
{%- endraw %}
```

###第三版
``` javascript
{% raw -%}
var data = {
    username: 'Muhha',
    age: 12,
    gender: 1
}
str = [
    '<p><%=obj.username%></p>',
    '<%if(obj.gender==1){%>',
        '<p><%=obj.gender%></p>',
    '<%}%>',
    '<p><%=obj.age%></p>'].join('\n');
var compile = function(str){
    tpl = str.replace(/\n/g, '')
    //替换变量
    .replace(/<%=([\s\S]+?)%>/gi,function(match, p1){
        return [
        '\'+',
        p1,
        '+\''
        ].join(''); // <%=obj.username%> 变成 ' + obj.username  + '
    })
    //替换执行语句
    .replace(/<%([\s\S]+?)%>/g, function(match, p1){
        return [
        '\';',
        '\n',
        p1,
        '\n',
        'tpl+=\''
        ].join('');  // if(a){ 变成 ';\n   if(a){  tpl+= '
    })

    tpl = '\'' +tpl + '\'';
    //此时tpl
    // '<p>'+obj.username+'</p>';
    // if(obj.gender==1){
    // tpl+='<p>'+obj.gender+'</p>';
    // }
    // tpl+='<p>'+obj.age+'</p>'

    tpl = 'var tpl="";\ntpl+=' + tpl;
    tpl = tpl + ';\nreturn tpl;';
    return new Function('obj',tpl);
}
var compiled = compile(str);
var rs = compiled(data); // <p>Muhha</p><p>1</p><p>12</p>
{%- endraw %}
```
这样还是有缺陷的, 比如某个字段的值为```<script>...</script>``` 这样的话就会向页面中插入了可执行的标签

###第四版
```
{% raw -%}
<script type="text/template" id="temp">
    <p><%=obj.username%></p>
        <%if(obj.gender==1){%>
            <p><%=obj.gender%></p>
        <%}%>
    <p><%=obj.age%></p>
</script>
{%- endraw %}
```
这一版还将模板放在了script标签中
``` javascript
{% raw -%}
var data = {
    username: '\<script\>Muhha\<\/script\>',
    age: 12,
    gender: 1
}
var escape = function(str){
    str = '' + str;
    str= str.replace(/&(?!\w+)/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#039'); // '&#039' 就是单引号 &apos; 这样写是因为IE不支持 &apos;
    return str;
}
var compile = function(str){
    tpl = str
    .replace(/\n/g, '')
    .replace(/\s/g, '')
    //替换变量
    .replace(/<%=([\s\S]+?)%>/gi,function(match, p1){
        return [
        '\'+',
        'escape(' + p1 + ')',
        '+\''
        ].join(''); // <%=obj.username%> 变成 ' + obj.username  + '
    })
    //替换执行语句
    .replace(/<%([\s\S]+?)%>/g, function(match, p1){
        return [
        '\';',
        '\n',
        p1,
        '\n',
        'tpl+=\''
        ].join('');  // if(a){ 变成 ';\n   if(a){  tpl+= '
    })

    tpl = '\'' +tpl + '\'';
    //此时tpl
    // '<p>'+obj.username+'</p>';
    // if(obj.gender==1){
    // tpl+='<p>'+obj.gender+'</p>';
    // }
    // tpl+='<p>'+obj.age+'</p>'

    tpl = 'var tpl="";\ntpl+=' + tpl;
    tpl = tpl + ';\nreturn tpl;';
    return new Function('obj, escape',tpl);
    //得到
    //(function(obj, escape
    // /**/) {
    // var tpl="";
    // tpl+='<p>'+escape(obj.username)+'</p>';
    // if(obj.gender==1){
    // tpl+='<p>'+escape(obj.gender)+'</p>';
    // }
    // tpl+='<p>'+escape(obj.age)+'</p>';
    // return tpl;
    // })
}
var compiled = compile(document.querySelector('#temp').text);  //script标签有text属性  但是其他标签只能用textContent  innerText
var rs = compiled(data, escape); // <p>&lt;script&gt;Muhha&lt;/script&gt;</p><p>1</p><p>12</p>
{%- endraw %}
```
