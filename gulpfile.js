var gulp = require("gulp");
var sass = require("gulp-sass");
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

gulp.task("watch", function() {
    gulp.watch("./dev/scss/**/*.scss", ["sass"]);
});

gulp.task("default", ["lint", "sass"]);
