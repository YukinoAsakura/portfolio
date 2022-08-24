//ドロップダウンメニュー機能
function dropdown(){
    // #navi直下のli要素をマウスオーバー
    $("#menu").children("li").hover(function(){
      // 下層ナビゲーションの表示を切り替える
      $(this).children("ul").stop().slideToggle(100);
    });
  };

function touchHover(){
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

};

//ページトップリンクの出現
function PageTopAnime() {
	var scroll = $(window).scrollTop();
	if (scroll >= 150){
		$('#page_top').removeClass('downMove');
		$('#page_top').addClass('upMove');
	}else{
		if($('#page_top').hasClass('upMove')){
			$('#page_top').removeClass('upMove');
			$('#page_top').addClass('downMove');
		}
	}
}

var windowWidth = $(window).width();
var windowSm = 768;

$(window).on('load',function(){
  if (windowWidth <= windowSm) {
    dropdown_sp();
} 
dropdown();
});


$(window).scroll(function () {
	PageTopAnime();
});

$('#page_top a').click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 500);
    return false;
});
