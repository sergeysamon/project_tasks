'use strict';

var gulp       = require('gulp');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function () {
    return gulp.src('./app/assets/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/assets/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./app/assets/**/*.scss', ['sass']);
});


gulp.task('default', ['sass', 'sass:watch']);

