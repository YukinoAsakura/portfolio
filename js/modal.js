
$(function(){  
    var a = $('.modalcontainer'),
        b = $('.overlay'),
        c = $('.open'),
        d = $('.close'); 
  
    //OPENをクリックでモーダルを開く
    c.on('click',function(){
      a.fadeIn();
      b.fadeIn();
    });
    
    //CLOSEをクリックでモーダルを閉じる
    d.on('click',function(){
      a.fadeOut();
      b.fadeOut();
    });
    
    //モーダルの周りをクリックで閉じる
    b.on('click',function(){
      a.fadeOut();
      b.fadeOut();
    });
  });