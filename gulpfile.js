var package = require('./package.json');

var options = {};

options.sass = {
    errLogToConsole: true,
    sourceMap: 'sass',
    sourceComments: 'map',
    style: 'compressed',
    precision: 10,
    imagePath: '/img',
    includePaths: [
    'scss/*.scss',
    ]
};
options.autoprefixer = {
    map: true,
    from: 'asset',
    to: 'asrp.min.css'
};

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    livereload = require('gulp-livereload');

gulp.task('js-custom', function () {
    return gulp.src('js/*.js')
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'));
});

gulp.task('js-plugins', function () {
    return gulp.src('js/plugins/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('/plugins.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
    gulp.src('scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(options.sass))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', options.autoprefixer))
    .pipe(gulp.dest('./css'))
    .pipe(minifycss())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css'))
    .pipe(livereload())
    ;
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('js/*.js', ['js-custom']);
    gulp.watch('js/plugins/**/*.js', ['js-plugins']);
});

gulp.on('err', function(err){
    console.log(err);
});
