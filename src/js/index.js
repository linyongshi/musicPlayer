var root = window.player;
var dataList = [];
var len = 0;
var audio = root.audioManager;
var control;
var timer = null;
var duration = 0;

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            root.render(data[2]);
            dataList = data;
            len = data.length;
            control = new root.controlIndex(len);
            audio.getAudio(data[2].audio);
            root.pro.renderTotTime(data[2].duration);
            duration = data[2].duration;
            bindEvent();
            bindTouchEvent();
        },
        error: function () {
            console.log("error");
        }
    })
}

function bindEvent() {
    $('body').on('play:change', function (e, index) {
        root.pro.stop();
        audio.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        root.pro.renderTotTime(dataList[index].duration);
        duration = dataList[index].duration;
        if (audio.status == 'play') {
            audio.play();
            //切歌时清零
            root.pro.start(0);
            rotated(0);
        } else {
            root.pro.update(0);
        }
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            transform: 'rotateZ(0deg)',
            transition: 'none'
        })
    })
    $('.prev').on('click', function () {
        var i = control.prev();
        $('body').trigger('play:change', i);
    });
    $('.next').on('click', function () {
        var i = control.next();
        $('body').trigger('play:change', i);
    });
    $('.play').on('click', function () {
        if (audio.status == 'pause') {
            audio.play();
            // 进度条开始计时
            root.pro.start();
            var deg = $('.img-box').attr('data-deg') || 0;
            rotated(deg);
        } else {
            audio.pause();
            // 进度条停止更新
            root.pro.stop();
            clearInterval(timer);
        }
        $('.play').toggleClass('playing');
    });
    // 歌曲播放完自动切换下一首
    $(audio.audio).on('ended', function () {
        $('.next').trigger('click');
    })
}

function rotated(deg) {
    clearInterval(timer);
    deg = parseInt(deg);
    timer = setInterval(function () {
        deg += 4;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            transform: 'rotateZ(' + deg + 'deg)',
            transition: 'transform 0.2s ease-out'
        })
    }, 200);
}

function bindTouchEvent() {
    var $spot = $('.spot');
    var offset = $('.pro-bottom').offset();
    var left = offset.left;
    var width = offset.width;
    $spot.on('touchstart', function (e) {
        root.pro.stop();
    }).on('touchmove', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if (per > 0 && per < 1) {
            root.pro.update(per);
        }
        if (per <= 0) {
            root.pro.update(0);
        }
        if (per >= 1) {
            root.pro.update(1);
        }

    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if (per > 0 && per < 1) {
            var curTime = per * duration;
            audio.playTo(curTime);
            audio.play();
            root.pro.start(per);
            audio.status = 'play';
            $('.play').addClass('playing');
        }
        if (per <= 0) {
            audio.playTo(0);
            audio.play();
            root.pro.start(0);
            audio.status = 'play';
            $('.play').addClass('playing');
        }
        if (per >= 1) {
            var i = control.next();
            $('body').trigger('play:change', i);
        }
    })
}

getData("../mock/data.json");

// 信息+图片渲染到页面上
// 点击按钮
// 音频的播放与暂停 切歌
// 进度条运动与拖拽
// 图片旋转
// 列表切歌