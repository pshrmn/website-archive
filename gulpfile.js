var gulp = require("gulp");
var jshint = require("gulp-jshint");
var sass = require("gulp-sass");
var mocha = require("gulp-mocha");
var react = require("gulp-react");
var prefix = require("gulp-autoprefixer");

gulp.task("sass", function() {
    return gulp.src("./dev/scss/**/*.scss")
        .pipe(sass())
        .pipe(prefix({
            browsers: ["last 2 versions"],
            cascade: true
        }))
        .pipe(gulp.dest("./public/css/"));
});

gulp.task("test", function () {
    return gulp.src("specs/**/*.js")
        .pipe(mocha({
            reporter: "spec"
        }));
});

gulp.task("jsx", function() {
    return gulp.src("./dev/jsx/**/*.jsx")
        .pipe(react({harmony: true}))
        .pipe(gulp.dest("./public/js"));
});

gulp.task("lint", ["jsx"], function() {
    return gulp.src("public/js/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task("client-js", ["jsx", "lint", "test"]);

gulp.task("watch", function() {
    gulp.watch("./dev/scss/**/*.scss", ["sass"]);
    gulp.watch("./dev/jsx/**/*.jsx", ["client-js"]);
});

gulp.task("default", ["client-js", "sass"]);
