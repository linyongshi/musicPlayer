(function ($, root) {
    var frameId = null;
    var dur = 0;
    var lastPer = 0;
    var startTime = null;
    // 当前时间 进度条 总时间

    // 不需要返回值，不用写构造函数

    // 渲染总时间
    function renderTotTime(time) {
        dur = time;
        time = formatTime(time);
        lastPer = 0;
        $('.tot-time').html(time);
    }

    function formatTime(time) {
        time = Math.round(time);
        var m = Math.floor(time / 60);
        var s = time % 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }

    function start(p) {
        lastPer = p == undefined ? lastPer : p;
        startTime = new Date().getTime();

        function frame() {
            var curTime = new Date().getTime();
            var per = lastPer + (curTime - startTime) / (dur * 1000);
            if (per <= 1) {
                update(per);
            }else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }

    function stop() {
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer += (stopTime - startTime) / (dur * 1000);
    }

    function update(per) {
        var time = formatTime(dur * per);
        $('.cur-time').html(time);
        var perX = (per - 1) * 100 + '%';
        $('.pro-top').css({
            transform: 'translateX(' + perX + ')'
        });
    }

    root.pro = {
        renderTotTime: renderTotTime,
        start: start,
        stop: stop,
        update: update
    }
})(window.Zepto, window.player || (window.player = {}));