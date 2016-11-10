'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
    return gulp.src('./assets/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 6 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('./assets/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./assets/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'sass:watch']);