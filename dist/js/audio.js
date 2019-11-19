(function ($, root) {
    function AudioManger(src) {
        //创建一个audio对象
        this.audio = new Audio();
        this.src = src;
        //audio默认状态
        this.status = 'pause';
    }
    AudioManger.prototype = {
        play: function () {
            this.audio.play();
            this.status = 'play';
        },
        pause: function () {
            this.audio.pause();
            this.status = 'pause';

        },
        getAudio: function () {
            this.audio.src = this.src;
            this.audio.load();
        }
    }

    root.AudioManger = AudioManger(src);

})(window.Zepto, window.player || (window.player = {}))