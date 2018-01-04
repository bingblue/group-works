(function($) {       
	$.fn.fish = function(options) {
		var defaults = {
			time : 60,
			man : {"id":1,"width":75,"height":75,"image":"images/man.png"},
			moon : {"id":2,"width":100,"height":80,"image":"images/fish01.png","scoreImg":"images/J1.png","score":30},
			moon2 : {"id":3,"width":100,"height":80,"image":"images/fish04.png","scoreImg":"images/J1.png","score":40},
			moon3 : {"id":4,"width":100,"height":80,"image":"images/fish05.png","scoreImg":"images/J1.png","score":50},
			moon4 : {"id":5,"width":100,"height":80,"image":"images/fish06.png","scoreImg":"images/J1.png","score":60},
			moon5 : {"id":6,"width":100,"height":80,"image":"images/fish07.png","scoreImg":"images/J1.png","score":70},
			moon6 : {"id":7,"width":100,"height":80,"image":"images/fish10.png","scoreImg":"images/J1.png","score":80},
			moon7 : {"id":8,"width":100,"height":80,"image":"images/fish11.png","scoreImg":"images/J1.png","score":90},
			moon8 : {"id":9,"width":100,"height":80,"image":"images/fish11.png","scoreImg":"images/J1.png","score":100},
			bomb : {"id":5,"width":60,"height":40,"image":"images/bomb.png","score":-1},
			bomb2 : null,
			over : function(score){
				//location.href = "over.html?score="+score;
			},
			success : function(score){
				//location.href = "over.html?score="+score;
			}
		  };
		var opts = $.extend(defaults, options);
		var $this = $(this);
		//掉落时间(毫秒)
		var $fishrodBox = $(".fishrod-box");
		var rodTopAndHeight = $fishrodBox.offset().top + $fishrodBox.height() - ($fishrodBox.find(".fishhook").height()/5);
		var boxWidth = $this.width();
		var boxHeight = $this.height();
		var downTime = 800;
		var downTime2 = 20;
		var man = opts.man;
		var moon = opts.moon;
		var moon4 = opts.moon4;
		var moon5 = opts.moon5;
		var moon6 = opts.moon6;
		var moon7 = opts.moon7;
		var moon8 = opts.moon8;
		var moon2 = opts.moon2==null?opts.moon:opts.moon2;
		moon2.id = 3;
		var moon3 = opts.moon3==null?opts.moon:opts.moon3;
		moon3.id = 4;
		var bomb = opts.bomb;
		var bomb2 = opts.bomb2==null?opts.bomb:opts.bomb2;
		bomb2.id = 6;
		var isLine = false;

		var kind = [moon,moon2,moon3,moon4,moon5,moon6,moon7,moon8]
		var probability = [30,40,50,60,70,80,90,100];
		var x = 0;
		var y = 0;
		var score = 0;
		var t;
		var s;
		var rodT = null;
		var time = opts.time;
		var timeT = null;
		//随机 位置
		function randPos(num){ 
			return Math.ceil(Math.random()*(boxHeight-num)); 
		} 
		//随机种类ss
		function randKind(){ 
			var num = Math.ceil(Math.random()*100); 
			if(num<probability[0]){
				return kind[0];
			}else if(num<probability[1]){
				return kind[1];
			}else if(num<probability[2]){
				return kind[2];
			}else if(num<probability[3]){
				return kind[3];
			}else if(num<probability[4]){
				return kind[4];
			}else if(num<probability[5]){
				return kind[5];
			}else if(num<probability[6]){
				return kind[6];
			}else if(num<probability[7]){
				return kind[7];
			}
		} 
		function checkScore(left,top,kind,img,ct){
			//if(left<=(x+man.width-25)&&left>=x&&top>=y&&top<(y+man.height)){
			if(left+100-10>=x&&left+50+10<=x&&top+80-30>=y&&top+10<=y){
				clearInterval(ct);
				score += kind.score;
				img.css({
					left : "+=30",
					top : "+=30"
				});
				var imgClone = img.clone();
				imgClone.css({
					position: "relative",
				  right: "-87%",
				  display: "block",
				  top : "-16px",
				  left : "auto",
				  "-webkit-transform": "rotate(-90deg)"
				});
				imgClone.appendTo(".fishrod-box").animate({
					"-webkit-transform": "rotate(-90deg)"
				},1000);
				img.remove();
			  $(".add-score").text("+"+kind.score).css({
			  	top : y - 30,
			  	left : x + 30
			  }).show();
				x = 0;
				y = 0;
				setTimeout(function(){
					$fishrodBox.find(".fishline").animate({
			    	height : 0,
			    },500,function(){
						imgClone.remove();
						$(".add-score").hide();
						//isLine = false;
			    });
			   //  img.animate({
			   //  	top : 0
			   //  },500,function(){
						// img.remove();
			   //  });
				},100);
				$(".score b").text(score);
				opts.success();
				//opts.over(score);
				// if(kind.score == -1){
				// 	clearInterval(ct);
				// 	$(".score").text(0);
				// 	var tmp = score;
				// 	score = 0;
				// 	img.remove();
				// 	opts.over(tmp);
				// }else{
				// 	clearInterval(ct);
				// 	score += kind.score;
				// 	img.attr({
				// 		src: kind.scoreImg,
				// 	}).css({
				// 		left: '-=20',
				// 		top : "-=20",
				// 		width : 40,
				// 		height : 20,
				// 	});
				// 	setTimeout(function(){img.remove()},500);
				// 	$(".score").text(score);
				// }
			}
		}
		function createKing(){
			var k = randKind();
			var hhh;
			if(k.height){
				hhh = k.height;
			}else{
				hhh = 80;
			}
			var l = randPos(hhh);
			var left = l;
			var nowX = x;
			var img = $("<img class='fish-item' width='"+k.width+"' height='"+ hhh +"' />").attr({
				src: k.image
			}).css({
				left: -k.width,
				top : l,
			}).appendTo($this);
			var i=-k.width;
			var ct = setInterval(function(){
			 	if (i<(boxWidth)) {
			 		// if (k.id == 6) {
			 		// 	if (left!=nowX) {
			 		// 		left = left<nowX?++left:--left;
			 		// 	}else{
			 		// 		img.attr({
			 		// 			width : bomb.width,
			 		// 			height : bomb.height,
			 		// 			src : bomb.image
			 		// 		});
			 		// 	}
			 		// }
			 		img.css({
			 			top: left,
			 			left : i
			 		});
			 		var topI = img.offset().top;
			 		if(x!=0&&y!=0){
			 			checkScore(i,topI,k,img,ct);
			 		}
			 	}else{
			 		clearInterval(ct);
			 		img.remove();
			 	}
			 	i+=2;
			 },downTime2);
		}
		t = setInterval(createKing,downTime);
		timeT = setInterval(function(){
			--time;
			if (time<10) {
				$(".time b").text("00:0"+time);
			}else{
				$(".time b").text("00:"+time);
			}
			if(time <= 0){
				time = 0;
				clearInterval(t);
				clearInterval(timeT);
				$(".fish-item").remove();
				x = 0;
				y = 0;
				opts.over(score);
			}
		},1000);
		var init = {l:x,t:y,sx:0,sy:0,ex:0,ey:0};
		var obj = $(".fish-box")[0];
		obj.addEventListener("touchstart",function(event){
		    //鱼竿滑动钓鱼
	    	if(rodT != null || isLine == true){
	    		return false;
	    	}
	    	isLine = true;
    		y = 0;
    		x = 0;
		    init.sx = event.targetTouches[0].pageX;
		    init.sy = event.targetTouches[0].pageY;
		    init.ex = init.sx;
		    init.ey = init.sy;
		    $(".sight").css({
		    	top : init.sy-($(".sight").height()/2),
		    	left : init.sx-($(".sight").width()/2)
		    }).fadeIn(200,function(){
		    	$(this).fadeOut(1500);
		    });
		    // $fishrodBox.find(".fishline").animate({
		    // 	height : 0,
		    // },200);
		    var fishrodBoxLeft = init.sx - boxWidth;
		    var fishrodBoxHeight = init.sy - rodTopAndHeight;
		    $fishrodBox.animate({
		    	left : fishrodBoxLeft,
		    },500,function(){
		    	var heightI = 0;
		    	rodT = setInterval(function(){
		    		if(heightI < fishrodBoxHeight){
		    			heightI = heightI + 2;
		    		}else{
		    			heightI = fishrodBoxHeight;
		    			clearInterval(rodT);
		    			rodT = null;
			    		y = heightI + rodTopAndHeight;
			    		x = init.sx;
			    		setTimeout(function(){
			    			x = 0;
			    			y = 0;
			    			$fishrodBox.find(".fishline").animate({
			    				height : 0,
			    			},200,function(){
			    				isLine = false;
			    			});
			    		}, 500);
		    		}
		    		//console.log("heightI="+ heightI + ":fishrodBoxHeight="+fishrodBoxHeight+":rodX=" + x + ":rodY=" + y);
		    		$fishrodBox.find(".fishline").css({
		    			height : heightI,
		    		});
		    	},2);
		    });
		    //console.log(fishrodBoxHeight+":y="+init.sy);
		    event.stopPropagation();
			  event.preventDefault();
		}, false);
		/*obj.addEventListener("touchmove",function(e) {
		    init.ex = event.targetTouches[0].pageX;
		    init.ey = event.targetTouches[0].pageY;
		    var changeX = (init.ex-init.sx) + init.l;
		    var changeY = init.t - (init.sy-init.ey);
		    if(changeX < 0){
		    	changeX = 0;
		    }
		    if (changeX > (boxWidth-man.width)){
		    	changeX = boxWidth-man.width;
		    };
		    if(changeY < 0){
		    	changeY = 0;
		    }
		    if (changeY > (boxHeight-man.height)){
		    	changeY = boxHeight-man.height;
		    };
		    x = changeX;
		    y = changeY;
		   	$(".man").css({
		   		left: x,
		   		top : y
		   	});
		   	e.stopPropagation();
			  e.preventDefault();
		}, false);
		obj.addEventListener("touchend",function(e) {
			init.l = x;
			init.t = y;
			$("#man").attr("src",man.image);
			e.stopPropagation();
			e.preventDefault();
		}, false);*/

		document.body.addEventListener('touchmove', function(e) {
	    //e.stopPropagation();
	    //e.preventDefault();
		});

		//取消右键效果
		function Click(){ 
			window.event.returnValue=false; 
		} 
		document.oncontextmenu=Click;
	};     
})(jQuery);