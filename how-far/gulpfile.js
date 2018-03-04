var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('sass', function () {
  gulp.src('./precompile/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./howfar/static/css'));
});
