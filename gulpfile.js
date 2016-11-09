'use strict';

var gulp = require('gulp');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var pkg = require('./package.json');

// Minify compiled CSS
gulp.task('minify-css', function() {
  return gulp.src('css/creative.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css'));
});

// Minify JS
gulp.task('minify-js', function() {
  return gulp.src('js/creative.js')
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'));
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('jshint', function() {
  return gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    .pipe(gulp.dest('vendor/bootstrap'));

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'));

  gulp.src(['node_modules/magnific-popup/dist/*'])
    .pipe(gulp.dest('vendor/magnific-popup'));

  gulp.src(['node_modules/scrollreveal/dist/*.js'])
    .pipe(gulp.dest('vendor/scrollreveal'));

  gulp.src(['bower_components/parallax.js/*.js'])
    .pipe(gulp.dest('vendor/parallax.js'));

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
  ])
    .pipe(gulp.dest('vendor/font-awesome'));

  gulp.src(['vendor/bourbon/**'])
    .pipe(gulp.dest('sass/vendor/bourbon'));
})

gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  });
});
 
gulp.task('reload', function () {
  gulp.src('./index.html')
    .pipe(connect.reload());
});
 
gulp.task('watch', function () {
  gulp.watch(['./*.html', './img/*', './fonts/*'], ['reload']);
  gulp.watch(['./js/**/*.js'], ['jshint', 'reload']);
  gulp.watch(['./sass/**/*.scss'], ['sass', 'reload']);
});
 
// For development
gulp.task('default', ['jshint', 'sass', 'copy', 'connect', 'watch']);

// When ready to deploy
gulp.task('package', ['jshint', 'sass', 'minify-css', 'minify-js', 'copy'])
