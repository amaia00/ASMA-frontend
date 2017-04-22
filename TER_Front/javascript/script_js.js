$(document).ready(function(){
   $(".carte a").click(function()  {


  var height1 = $(".informations").height();
  var height2 = $(".informations").height();
  console.log(height2);
  if(height1>=height2) {
    $("#comparaison").height = height1;
  }
  else {
     $("#comparaison").height = height2;
  }
});


    ///////////////////// Menu a changer /////////////////////////////

$(".nav_menu_left").click(function(){
  var width_window = $(window).width()-320+'px';
  $(".search").css('display', 'block');
  $(".search").css('width', '320px');
  $('#content').css('margin-left', '320px');
  $('#content').css('width', width_window);
  $('#search').css('padding', '20px');
  $("header").css('margin-left', '320px');
  $('header').css('width', width_window);
  $(this).css('display','none');
  $(".form_close").css('display','block');




});

$(".form_close").click(function() {
        $(".search").css('display', 'none');
        $(".nav_menu_left").css('display', 'block');
        $(".form_close").css('display', 'none');
        $(".search").css('width', '0');
        $('#content').css('margin-left', '0');
        $('#search').css('padding', '0');
        $("header").css('margin-left', '0');
        $("header").css('width', '100%');
        $("#content").css('width', '100%');
        $(this).css('display', 'none');

});



////////////////////



 });
