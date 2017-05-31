var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    uglifycss = require('gulp-uglifycss'),
    purify = require('gulp-purifycss'),
    bulkSass = require('gulp-sass-bulk-import'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence');

var sassFiles = 'src/sass/**/*.sass',
    cssDest = 'dist/css',
    jsFiles = 'src/js/**/*.js',
    jsDest = 'dist/js';

var onError = function (err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
};

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

gulp.task('sass', function() {
    return gulp.src('src/sass/main.sass')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(bulkSass())
        .pipe(
            sass({
                includePaths: ['src/sass']
            }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
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

gulp.task('css-purify', function() {
    return gulp.src('dist/css/main.min.css')
            .pipe(purify([jsFiles, '*.html']))
            .pipe(gulp.dest(cssDest));
});

gulp.task('js-purify', function() {
    return gulp.src(['!src/js/lib/jquery.min.js', jsFiles])
        .pipe(uglify())
        .pipe(gulp.dest('src/js'));
});

gulp.task('js-concat', function() {
    return gulp.src(['src/js/lib/jquery.min.js', jsFiles])
        .pipe(concat('main.js'))
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function(callback) {
    runSequence('js-purify', 'js-concat');
});

gulp.task('build', function(callback) {
    runSequence(['css-purify', 'js'],
        callback
    );
});
