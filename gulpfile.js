var gulp = require("gulp");
var jshint = require("gulp-jshint");
var sass = require("gulp-sass");
var mocha = require("gulp-mocha");
var react = require("gulp-react");

gulp.task("sass", function() {
    return gulp.src("./dev/scss/**/*.scss")
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(gulp.dest("./public/css"));
});

gulp.task("test", function () {
    return gulp.src("specs/**/*.js")
        .pipe(mocha({
            reporter: 'nyan'
        }));
});

gulp.task("jsx", function() {
    return gulp.src("./dev/jsx/**/*.jsx")
        .pipe(react({harmony: true}))
        .pipe(gulp.dest("./public/js"))
});

gulp.task("lint", ["jsx"], function() {
    return gulp.src("public/js/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task("js", ["jsx", "lint", "test"]);

gulp.task("default", ["js", "sass"]);
