$(function(){  
    var overlay = $('.overlay');
    var openButtons = $('.open');
    var closeButtons = $('.close');
    var modalContainers = $('.modalcontainer');
        
  
    //OPENをクリックでモーダルを開く
    openButtons.on('click',function(event){
      var target = $(event.target);
      target.parent().find(".modalcontainer").fadeIn();
      overlay.fadeIn();
    });
    
    //CLOSEをクリックでモーダルを閉じる
    closeButtons.on('click',function(){
      modalContainers.fadeOut();
      overlay.fadeOut();
    });
    
    //モーダルの周りをクリックで閉じる
    overlay.on('click',function(){
      modalContainers.fadeOut();
      overlay.fadeOut();
    });
  });
  
