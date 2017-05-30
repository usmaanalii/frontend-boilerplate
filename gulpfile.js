var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    purify = require('gulp-purifycss'),
    runSequence = require('run-sequence');

var sassFiles = 'src/sass/**/*.sass',
    cssDest = 'dist/css',
    jsFiles = 'src/js/**/*.js',
    jsDest = 'dist/js';

gulp.task('sass', function() {
    return gulp.src(sassFiles)
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        // .pipe(purify([jsFiles, '*.html']))
        .pipe(rename('main.min.css'))
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest(cssDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function() {
    return gulp.src(['src/js/lib/jquery.min.js', jsFiles])
        .pipe(concat('main.js'))
        .pipe(rename('main.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    });
});

gulp.task('build', function(callback) {
    runSequence(['sass', 'js'],
        callback
    );
});
