"use strict";

var gulp        = require('gulp');
var usemin      = require('gulp-usemin');
var uglify      = require('gulp-uglify');
var minifyCss   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass');
var source      = require('vinyl-source-stream');
var browserify  = require('browserify');

var watchFiles = [
    'public/src/js/**/*.js',
    'public/src/scss/**/*.scss',
];

gulp.task('build:sass', function () {
    return gulp.src('./public/src/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/build/styles'));
});

gulp.task('build:js', function () {
    return browserify('./public/src/js/main.js')
        .bundle() // think i can take this out
        .pipe(source('main.js'))
        .pipe(gulp.dest('./public/build/js'));
});

gulp.task('watch:dev', ['build:js', 'build:sass'], function(){
    gulp.watch(watchFiles, ['build:js', 'build:sass']);
});

gulp.task('build', ['build:sass', 'build:js']);

gulp.task('default', ['watch:dev']);