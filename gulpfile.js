var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('build', ['copy-html-files', 'copy-files'], function() {
  gulp.src('app/index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify({compress: false})))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-html-files', function () {
  return gulp.src(['app/**/*.html', '!app/bower_components/**/*'])
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-files', ['copy-fonts', 'copy-assets']);

gulp.task('copy-fonts', function() {
  return gulp.src('app/bower_components/font-awesome/fonts/fontawesome-webfont.*')
    .pipe(gulp.dest('dist/fonts'));
});


gulp.task('copy-assets', function() {
  return gulp.src('app/h54sConfig.json')
    .pipe(gulp.dest('dist'));
});
