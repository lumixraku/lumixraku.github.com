title: Canvas 雾玻璃
---
>
>Demo http://lumixraku.github.io/demos/Fog/Fog.html

###Canvas tutorial
给大家安利一个学习Canvas的站点
>http://www.html5canvastutorials.com/

###用到的方法
在开始之前, 最好了解一下Canvas的最基本的使用
- stroke()

- save() clip()  restore()
    http://jo2.org/html5-canvas-clip/
    http://www.html5canvastutorials.com/advanced/html5-canvas-clipping-region-tutorial/

- drawImage()
  http://www.w3school.com.cn/tags/canvas_drawimage.asp

- createPattern()
  https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/createPattern




###关于雾化特效
>http://www.cnblogs.com/dson/p/4390641.html

需要明白的是  雾气效果的实际实现和物理现实是相反的,
我们并不是用手指把雾抹掉, 而是用手指画出没有雾的图像.


###图片自适应
如果你是希望从一个图片中读取, 那么坐标是相对图片的实际大小, 所以你对图片设置的 width height是木有意义的, 解决办法就是再用一个 temp Canvas , 将图片读入到这个Canvas中  然后用这个temp Canvas 作为图片源



