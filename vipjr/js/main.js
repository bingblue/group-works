//test
var tokenServerUrl = "http://121.196.222.36/WechatToken/getJsConfig";
document.write("<script src='" + tokenServerUrl + "?url=" + encodeURIComponent(window.location.href) + "&debug=1&jsApiList=startRecord,stopRecord,onVoiceRecordEnd,uploadVoice'><\/script>");
//test end
$(function() {
    var game1Result = false;
    var game2Result = false;
    var evaluationUrl = "http://121.196.222.36/vipjr/evaluation";
    var game2NowStge = 1;

    $(".back").click(function() {
        history.go(-1);
    });
    if (localStorage.gameOne) {
        $(".game1-complate").show();
    }
    if (localStorage.gameTwo) {
        $(".game2-complate").show();
    }
    //GameOne
    for (var i = 0; i < 9; i++) {
        $(".animate li:eq(0)").insertAfter($(".animate li:eq(" + Math.floor(Math.random() * 9) + ")"));
    }
    $(".animate li").click(function() {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
        game1Result = false;
        $(".active").each(function(i) {
            if ($(".active").eq(i).attr("data-result") == "yes" && $(".active").length == 6) {
                game1Result = true;
            } else {
                game1Result = false;
                return false;
            }
        });
    });
    $(".game1-ok").click(function() {
        if (game1Result) {
            localStorage.setItem("gameOne", "true");
            $(".mask.success").show();
        } else {
            $(".mask.error").show();
        }
    });
    //GameOne End
    //GameTwo
    //判定语音分数和是否跳出结果
    window.game2ResultFun = function($this, result, score) {
        $this.siblings("span").text(score).animate({
            "opacity": 0
        });
        $this.siblings("span").animate({
            "opacity": 1
        }, 200);
        $this.attr("data-result", result);
        $(".item .read").each(function(i) {
            if ($(".item .read").eq(i).attr("data-result") == "yes") {
                game2Result = true;
                localStorage.setItem("gameTwo", "true");
            } else {
                game2Result = false;
                return false;
            }
        });
        setTimeout(function() {
            if (game2Result) {
                $(".mask.good").show();
            }
        }, 900);
    };
    function getGame2ResultFun($this) {
        $this.removeClass('active');
        //第二次点击录音结束提交
        //doing something and ajax
        $this.siblings("span").text("评测中……").animate({
            "opacity": 0
        });
        $this.siblings("span").animate({
            "opacity": 1
        }, 200);
        wx.stopRecord({
            success: function(res) {
                var record_localId = res.localId;
                wx.uploadVoice({
                    localId: record_localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function(res) {
                        var serverId = res.serverId; // 返回音频的服务器端ID
                        evaluation($this, serverId);
                    }
                });
            }
        });
    }
    $(".read").click(function() {
        //改变图片
        var $this = $(this);
        if ($this.parents(".item").siblings(".item").find('.read.active').length > 0) {
            return false;
        }
        if ($this.hasClass('active')) {
            getGame2ResultFun($this);
        } else {
            //第一次点击开始录音
            $this.addClass('active');
            //doing something
            nowStge = $this.attr("data-stage");
            wx.startRecord();
            setTimeout(function() {
                if ($this.hasClass('active')) {
                    getGame2ResultFun($this);
                }
            }, 5000);
        }
    });
    //评测
    function evaluation($this, mediaId) {
        $.ajax({
            type: "post",
            url: evaluationUrl,
            dataType: "json",
            data: {
                stage: nowStge,
                mediaId: mediaId
            },
            async: true,
            success: function(data) {
                if (data.Code === '0') {
                    window.game2ResultFun($this, (data.Score == 'Good' || data.Score == 'Excellent') ? "yes" : "no", data.Score);
                } else {
                    window.game2ResultFun($this, "no", data.Msg);
                }
            }
        });
    }
    //GameTwo End
    //GameThree

    if(!localStorage.getItem("UserMobile") == null){
      $(".mask.people").show();
    }
    //抽奖中奖
    function getWinResult($this, winName, winPic) {
        //$(this).attr("src",$(".anti ul").attr("data-src"));
        $this.find('img:eq(1)').attr('src', winPic);
        $this.find('img').removeClass("ani0");
        $this.find('img').addClass("ani-game3-win");
        $(".mask.win h3").text(winName);
        setTimeout(function() {
            $(".mask.win").show();
        }, 1800);
    }
    setTimeout(function() {
        $(".anti li").click(function() {
            //ajax and doing somthing
            getWinResult($(this), 'Vipjr课程包', 'img/3.png');
        });
    }, 4000);
    //GameThree End
    //样本播放
    $(".item1 .listen").on('touchstart', function() {
        var media1 = $("#media1").get(0);
        media1.play();
    });
    $(".item2 .listen").on('touchstart', function() {
        var media2 = $("#media2").get(0);
        media2.play();
    });
    $(".item3 .listen").on('touchstart', function() {
        var media3 = $("#media3").get(0);
        media3.play();
    });

});
