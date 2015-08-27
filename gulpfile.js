var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("sass", function() {
    gulp.src("./dev/scss/*.scss")
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(gulp.dest("./public/css"));
});