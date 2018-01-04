
  window.onload=function(){
	 //音乐开关 
    if($("#audio_btn").attr("url").indexOf("mp3")>1){
	  var url = $("#audio_btn").attr("url"); 
	  var html = '<audio loop  src="'+url+'"  id="media" autoplay="autoplay" ></audio>';
	  setTimeout(function(){
		  $("#audio_btn").html(html);
		  $("#audio_btn").show().attr("class","on");
		  
	 },300);
	  
	  $("#audio_btn").click(function(){
		  var type = $("#audio_btn").attr("class");
		  var media = $("#media").get(0);
		  if(type=="on"){
		    media.pause(); 
			$("#audio_btn").attr("class","off");
		  }else{
			media.play();
			$("#audio_btn").attr("class","on"); 
	      }  
	  })
    }
	
	
} 
