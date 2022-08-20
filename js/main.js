function dropdown(){
    // #navi直下のli要素をマウスオーバー
    $("#menu").children("li").hover(function(){
      // 下層ナビゲーションの表示を切り替える
      console.log("TEST")
      $(this).children("ul").stop().slideToggle(100);
    });
  };

function dropdown_sp(){
  $("body").on({
    "touchstart": function() {
      return $(this).off("mouseover mouseout");
    },
    "touchstart mouseover": function() {
      return $(this).addClass("hover");
    },
    "touchend touchmove mouseout click": function() {
      return $(this).removeClass("hover");
    }
  }, ".touch-hover");
  
  // #navi直下のli要素をマウスオーバー
  $("#menu").children("li").hover(function(){
    // 下層ナビゲーションの表示を切り替える
    console.log("TEST")
    $(this).children("ul").stop().slideToggle(100);
  });
};

var windowWidth = $(window).width();
var windowSm = 768;

$(window).on('load',function(){
  if (windowWidth <= windowSm) {
    dropdown_sp();
} else {
    dropdown();
}
});
