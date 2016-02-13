function RainAndSnow(canvasId, opt) {
    var rain = [], //雨滴  存放Rain对象
        drops = []; //drops是雨滴落到地面溅起的水花
    //重力加速度  有这个雨会越来越快
    var gravity = opt.gravity || 0.2;

    //横向偏移  也就是雨存在一定倾斜角
    var wind = opt.wind || 0.015;
    //雨滴出现几率
    //使用RAF来控制刷新频率, 所以无法手动设置canvas刷新间隔  使用一个值来控制此次刷新是否产生雨滴
    var rain_chance = opt.rain_chance || 0.4;
    var snow_chance = opt.snow_chance || 0.1;
    var canvas = document.getElementById(canvasId);

    //为了保证在手机上的清晰度, 乘以dpr
    canvas.width = (document.body.clientWidth || opt.width) * window.devicePixelRatio;
    canvas.height = (document.body.clientHeight || opt.height) * window.devicePixelRatio;

    //开始绘制
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = (opt.lineWidth || 1) * window.devicePixelRatio;

    //雨滴/雪  的颜色
    var defaultColorStyle = (opt.type == 'rain') ? 'rgba(127,127,127,0.8)' : 'rgba(255,255,255,0.7)'
    ctx.strokeStyle = ctx.fillStyle = opt.colorStyle || defaultColorStyle ;

    //RAF兼容性处理
    window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    this.init = function() {
        this.update();
    }

    //动态的雨滴下落效果 是每一帧静止的canvas构成的  每次RAF都会重新绘制整个Canvas
    this.update = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var i = rain.length;
        while (i--) {
            //
            var raindrop = rain[i];

            //更新
            raindrop.update();
            //判断雨滴是否落到地面  根据雨滴的y值来判断
            if (opt.type == 'rain' && raindrop.pos.y >= canvas.height) {
                var n = Math.round(4 + Math.random() * 4);
                while (n--)
                    drops.push(new Drop(raindrop.pos.x, canvas.height));
                rain.splice(i, 1);
            }
            raindrop.draw();
        }

        //绘制水花
        i = drops.length;
        while (i--) {
            var drop = drops[i];
            drop.update();
            drop.draw();
            if (drop.pos.y > canvas.height) drops.splice(i, 1);
        }
        if(opt.type == 'rain' && Math.random() < rain_chance){
            rain.push(new Rain());
        }else if(opt.type == 'snow' && Math.random() < snow_chance){
            var y = Math.random() > 0.5 ? 2 : 4;
            rain.push(new Snow(null,y));
        }
        requestAnimFrame(arguments.callee);
    }

    //--------------------------------------------
    //一个雨滴对象
    function Rain(x, y) {
        this.pos = new Vector(Math.random() * canvas.width, -50); //一滴雨的坐标

        //prev 指的是上一帧该雨滴在canvas中的坐标(包含了一条线的起点和终点坐标)
        this.prev = this.pos;
        this.vel = new Vector(x, y); //空Vector得到的坐标是0
    };

    //更新终点坐标(然后该雨滴的起点就是原先的终点)
    //雨滴刚生成时  y方向速度为0   而后越来越快
    Rain.prototype.update = function() {
        this.prev = this.pos.copy();
        this.vel.y += gravity; //雨滴下落的速度越来越快了 因为重力加速度的缘故
        this.vel.x += wind;
        this.pos.add(this.vel); //pos 是一个Vector实例  add表示在原有基础上加坐标值 //计算新坐标
    };
    Rain.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.prev.x, this.prev.y);
        ctx.stroke();
    };
    //------------------------------------------
    function Snow(x, y){
        //这里是一个雪花的初始坐标
        //因为有风的影响  起始点不能只是 [0, width]  要不然飘到底部的时候屏幕就有一部分没有雪花了
        //所以设置位置为 [-width, width ] 这个范围
        this.pos = new Vector((Math.random() * canvas.width * 2) - canvas.width, -10);
        this.vel = new Vector(x || wind, y || 2);
        this.radius = Math.random() > 0.5 ? 4: 2;
    }
    Snow.prototype.update = function(){
        this.vel.x += wind/10;
        this.pos.add(this.vel);
    }
    Snow.prototype.draw = function(){
        var radius = (opt.radius || this.radius) * window.devicePixelRatio;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
    //--------------------------------------------
    // Drop 是当雨水落到地面的水花
    function Drop(x, y) {
        var dist = Math.random() * 7;
        var angle = Math.PI + Math.random() * Math.PI; // angle的取值是PI ~ 2PI
        this.pos = new Vector(x, y);
        this.vel = new Vector( //由于angle取值范围已经限定 所以这里x取值可正可负  y取值为负数（向上的速度）
            Math.cos(angle) * dist,
            Math.sin(angle) * dist
        );
    };
    Drop.prototype.update = function() {
        this.vel.y += gravity; //一个Drop的update函数第一次被调用的时候就是雨滴倒地面的时候， 此时雨滴的速度是向上的， y是负值
        this.vel.x *= 0.95; //溅起的水花下落速度比雨滴慢
        this.vel.y *= 0.95;
        this.pos.add(this.vel);
    };
    Drop.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 1, 0, Math.PI * 2);
        ctx.fill();
    };
    // ---------------------------------------
    //速度对象
    function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };
    Vector.prototype.add = function(v) {
        if (v.x != null && v.y != null) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    };
    Vector.prototype.copy = function() {
        return new Vector(this.x, this.y);
    };
}