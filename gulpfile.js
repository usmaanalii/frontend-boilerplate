var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    imageMin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    runSequence = require('run-sequence');


gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    });
});

gulp.task('useref', function() {
    return gulp.src('*.html')
        .pipe(useref())
        // Minifies only if it's a javascript file
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a css file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imageMin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', function(callback) {
    runSequence(['sass', 'useref', 'images'],
        callback
    );
});
