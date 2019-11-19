var gulp = require('gulp');
var htmlClean = require('gulp-htmlclean');
//压缩图片
// var imageMin = require('gulp-imagemin');
//压缩js
var uglify = require('gulp-uglify');
//去掉调试语句
var debug = require('gulp-strip-debug');
//将less转换成css
var less = require('gulp-less');
//压缩css
var cleanCss = require('gulp-clean-css');
//postCss aotoprefixer
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
//开启服务器
var connect = require('gulp-connect');

var folder = {
    src: "src/",
    dist: "dist/"
}

var devMod = process.env.NODE_ENV == "development";
console.log(devMod);
// export NODE_ENV=development

gulp.task("html", function () {
    var page = gulp.src(folder.src + "html/*")
        .pipe(connect.reload())
        if(!devMod){
            page.pipe(htmlClean())
        }
        page.pipe(gulp.dest(folder.dist + "html/"))
})

gulp.task("css", function () {
    var page = gulp.src(folder.src + "css/*")
        .pipe(connect.reload())
        .pipe(less())
        .pipe(postCss([autoprefixer()]))
        if(!devMod){
            page.pipe(cleanCss())
        }
        page.pipe(gulp.dest(folder.dist + "css/"))
})

gulp.task("js", function () {
    var page = gulp.src(folder.src + "js/*")
        .pipe(connect.reload())
        if(!devMod){
            page.pipe(debug())
            .pipe(uglify())
        }
        page.pipe(gulp.dest(folder.dist + "js/"))
})

gulp.task("images", function () {
    gulp.src(folder.src + "images/*")
        // .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + "images/"))
})

gulp.task("server", function () {
    connect.server({
        port: "8899",
        livereload: true
    })
})

//监听文件变化
gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"]);
    gulp.watch(folder.src + "css/*", ["css"]);
    gulp.watch(folder.src + "js/*", ["js"]);
})

gulp.task('default', ["html", "css", "js", "images", "server", "watch"]);