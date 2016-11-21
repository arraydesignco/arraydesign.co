'use strict';

var gulp = require('gulp');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var del = require('del');
var fs = require('fs');
var pkg = require('./package.json');

// Minify compiled CSS
gulp.task('minify-css', function () {
  return gulp.src('css/main.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css'));
});

// Minify JS
gulp.task('minify-js', function () {
  return gulp.src('js/main.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'));
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('jshint', function () {
  return gulp.src(['js/**/*.js', '!js/**/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Copy assets into the right areas
gulp.task('copy', function () {
  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    .pipe(gulp.dest('assets/bootstrap'));

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('assets/jquery'));

  gulp.src(['node_modules/magnific-popup/dist/*'])
    .pipe(gulp.dest('assets/magnific-popup'));

  gulp.src(['node_modules/scrollreveal/dist/*.js'])
    .pipe(gulp.dest('assets/scrollreveal'));

  gulp.src(['bower_components/parallax.js/*.js'])
    .pipe(gulp.dest('assets/parallax.js'));

  gulp.src([
    'node_modules/font-awesome/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ])
    .pipe(gulp.dest('assets/font-awesome'));

  gulp.src(['assets/bourbon/**'])
    .pipe(gulp.dest('sass/assets/bourbon'));
})

gulp.task('connect', function () {
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
  gulp.watch(['./js/**/*.js'], function () {
    runSequence('jshint', 'minify-js', 'reload');
  });
  gulp.watch(['./sass/**/*.scss'], function () {
    runSequence('sass', 'minify-css', 'reload');
  });
});

// For development
gulp.task('default', function () {
  runSequence('copy', ['jshint', 'sass'], ['minify-css', 'minify-js'], 'connect', 'watch');
});
