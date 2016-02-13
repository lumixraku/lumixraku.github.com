document.addEventListener('DOMContentLoaded', function() {
    var center = document.querySelector('.center');
    var layer = document.querySelector('.layer-wrapper');
    var expand = new Expand(center, layer);
    expand.init();
}, false);

function Expand(wrapper,layer) {
    this.wrapper = $(wrapper);
    this.layer = $(layer);
    this.img = this.layer.find('.layer-img');
    this.originStyle = {};
    this.opend = false;
    //start   =============================
}

Expand.prototype = {
    init: function() {
        var self = this;
        self.wrapper.on('click', '.img-wrapper', function(e) {
            //在这里  this就是 $('.img-wrapper')
            var target = $(e.target);// target 是 img
            var imgOriginSrc;
            var style;

            target = $(target);
            style = {
                top: target.offset().top,
                left: target.offset().left,
                width: target.width(),
                height: target.height(),
                background: "url(" + target.data('origin') + ")",
                "background-size": "cover"
            };
            self.createLayer(style,target.data('origin'));
            self.bindEvents();
        })
    },
    createLayer: function(style, url){
        var self = this;
        var layer = self.layer;
        var img = self.img;

        //start =============================
        self.opend = true;
        layer.addClass('opend');
        $.extend(self.originStyle, style);
        img.css(style);
        img[0].src = url;
        $('<img>')
        .attr('src', url)
        .load(function(){
            style = (function(){
                var w = this.width;
                var h = this.height;
                var outerW = document.body.clientWidth;
                var outerH = document.body.clientHeight;
                return {
                    left: (outerW - w )/2,
                    top: (outerH - h)/2,
                    width: w,
                    height: h
                }
            }.bind(this))();
            setTimeout(function(){
                img.css({
                    top: style.top,
                    left: style.left,
                    width: style.width,
                    height: style.height,
                    transition: "all 1000ms ease"
                });
            },0);
        })
    },
    bindEvents: function(){
        var self = this;
        var img = self.img;
        var style  = self.originStyle;
        var layer = self.layer;
        layer.on('click', function(){
            img.css({
                top: style.top,
                left: style.left,
                width: style.width,
                height: style.height,
                transition: 'all 1000ms ease'
            });
            self.opend = false;
        });
        img.on('transitionend', function(e){
            console.log(e.originalEvent);
            if(e.originalEvent.propertyName == 'left'){
                if(!self.opend){
                    layer.removeClass('opend');
                }
            }
        });
    }
}
