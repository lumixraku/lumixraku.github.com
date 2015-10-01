title: 自定义事件
---
>参考
>http://www.zhangxinxu.com/wordpress/2012/04/js-dom%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6/


一个最简单的自定义事件
这里的自定义事件并不是DOM事件
``` javascript
        var MyEvent = {
            _listener: {},
            addEvent:function(type, fn){
                if(!this._listener[type]){
                    this._listener[type] = []
                }
                this._listener[type].push(fn);

            },
            fireEvent:function(type, caller){
                if(this._listener[type]){
                    this._listener[type].forEach(function(fn){
                        fn.call(caller);
                    });
                }
            },
            removeEvent:function(type, fn){
                if(this._listener[type]){
                    for (var i = 0, len = this._listener[type].length ; i < len; i++) {
                        this._listener[type].splice(i,1);
                    };
                }
            }
        };

        function f1(){
            console.log('f1');
        }

        function f2(){
            console.log('f2');
        }

        event = MyEvent;
        event.addEvent('click', f1);
        event.addEvent('click', f2);
        event.fireEvent('click');
        event.removeEvent('click',f1);
        event.fireEvent('click');
```

OR 使用原型的方式
``` javascript
        var MyEvent = function(){
            this._listener = {};
        }
        MyEvent.prototype = {
            constructor: this,
            addEvent:function(type, fn){
                if(!this._listener[type]){
                    this._listener[type] = [];
                }
                typeof(fn) === 'function' && this._listener[type].push(fn);
            },
            fireEvent:function(type, caller){
                if(this._listener[type]){
                    this._listener[type].forEach(function(fn){
                        fn.call(caller);
                    });
                }
            },
            removeEvent:function(type, fn){
                if(this._listener[type]){
                    for (var i = 0, len = this._listener[type].length ; i < len; i++) {
                        this._listener[type].splice(i,1);
                    };
                }
            }
        };

        function f1(){
            console.log('f1');
        }

        function f2(){
            console.log('f2');
        }

        event = new MyEvent();
        event.addEvent('click', f1);
        event.addEvent('click', f2);
        event.fireEvent('click');
        event.removeEvent('click',f1);
        event.fireEvent('click');
```

###添加参数
``` javascript
        var MyEvent = function(){
            this._listener = {};
        }
        MyEvent.prototype = {
            constructor: this,
            addEvent:function(type, fn){
                if(!this._listener[type]){
                    this._listener[type] = [];
                }
                typeof(fn) === 'function' && this._listener[type].push(fn);
            },
            fireEvent:function(type, scope){
                var realArguments = arguments;
                if(this._listener[type]){
                    this._listener[type].forEach(function(fn){
                        fn.apply(scope, [].slice.call(realArguments, 2));
                    });
                }
            },
            removeEvent:function(type, fn){
                if(this._listener[type]){
                    for (var i = 0, len = this._listener[type].length ; i < len; i++) {
                        this._listener[type].splice(i,1);
                    };
                }
            }
        };

        function f1(){
            console.log('f1');
        }

        function f2(p1, p2){
            console.log(this);
            console.log(this.name)
            console.log('f2 -' + p1 +' -' + p2);
        }
        function Person(name){
            this.name = name;
        }
        event = new MyEvent();
        event.addEvent('click', f1);
        event.addEvent('click', f2);
        event.fireEvent('click');
        event.removeEvent('click',f1);
        event.fireEvent('click', new Person('haha') ,'p1','p2');
```


###自定义DOM事件
话说我在什么情况下需要自定义DOM事件呢
对于input的change事件, 如果是js修改了input的值是无法出发的
所以我们需要这样
```javascript
    var input = document.querySelector('#input');
    input.onchange= function(){
        console.log('hheh');
    }
    input.value = 'wahah';
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    input.dispatchEvent(evt);
```
用上面的风格写一个简单的DOM事件
```javascript
        function DOMEvent(el){
            this.el = el;
        }
        DOMEvent.prototype = {
            constructor: this,
            addEvent: function(type, fn){
                this.el.addEventListener(type, fn, false);
                var ev = document.createEvent('Eventname');
                ev.initEvent(type, false, false);
                this.el['ev' + type] = ev;
            },
            fireEvent: function(type){
                var ev =this.el['ev' + type];
                if(ev){
                    this.el.dispatchEvent(ev);
                }
            }
        };
        var ele = document.querySelector('.test');
        DOMEvent(ele).addEvent('alert', f1);
        DOMEvent(ele).fireEvent('alert');
```
