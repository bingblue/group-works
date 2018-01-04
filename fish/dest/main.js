$(function(){
  $(".jq-rule").click(function(){
    $(".mask-rule").show();
  });
  $(".jq-close").click(function(){
    $(".jq-mask").hide();
    window.location.href = 'index.html'
  });
  $(".jq-invite").click(function(){
    $(".mask-invite").show();
  });
  $(".jq-myprice").click(function(){
    $(".mask-prize").show();
  });
});