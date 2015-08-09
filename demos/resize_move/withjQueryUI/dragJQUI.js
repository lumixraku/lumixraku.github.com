var set_position = function(width, height){
  $('.ui-resizable-n').css('left', (width/2-4)+'px');
  $('.ui-resizable-e').css('top', (height/2-4)+'px');
  $('.ui-resizable-s').css('left', (width/2-4)+'px');
  $('.ui-resizable-w').css('top', (height/2-4)+'px');
};


$(".box").resizable({
  handles: {
    'n':'.ui-resizable-n',
    'e':'.ui-resizable-e',
    's':'.ui-resizable-s',
    'w':'.ui-resizable-w',
    'ne': '.ui-resizable-ne',
    'se': '.ui-resizable-se',
    'sw': '.ui-resizable-sw',
    'nw': '.ui-resizable-nw'
  },
  // grid: [ 10, 10 ],
  create: function( event, ui ) {
    var width = $(event.target).width();
    var height = $(event.target).height();
    set_position(width, height);
  },
  resize: function(event, ui){
    var width = $(event.target).width();
    var height = $(event.target).height();
    set_position(width, height);
  },
  alsoResize: "#rect1"
});

$( ".box" ).draggable({
  grid: [ 10, 10 ]
});
