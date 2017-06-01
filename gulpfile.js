/**
 ****************************************************
 * Gulp plugins
 ****************************************************
 */
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    uglifycss = require('gulp-uglifycss'),
    sourcemaps = require('gulp-sourcemaps'),
    purify = require('gulp-purifycss'),
    bulkSass = require('gulp-sass-bulk-import'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlPartial = require('gulp-html-partial'),
    runSequence = require('run-sequence');

/**
 ****************************************************
 * File destinations
 ****************************************************
 */

var sassFiles = 'src/sass/**/*.sass',
    cssDest = 'dist/css',
    jsFiles = 'src/js/**/*.js',
    jsDest = 'dist/js';

/**
 ****************************************************
 * Error function for SASS compilation
 ****************************************************
 */

/**
 * Produces an error via plumber during sass compile
 * @param  {string} err [error produced from SASS file]
 * @return {object}     [details the SASS error]
 */
var onError = function (err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
};

/**
 ****************************************************
 * Task definitons
 *
 * 1. Server and browser reload
 * 2. HTML tasks
 * 3. SASS/CSS tasks
 * 4. Javascript tasks
 * 5. Build tasks (creates separate HTML/CSS/Javascript builds and a
 * complete build (including all 3))
 *
 ****************************************************
 */


 /**
  ****************************************************
  * Server and browser reload tasks
  ****************************************************
  */

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('src/sass/**/*.sass', ['sass-compile']);
    gulp.watch('src/html/**/*.html', ['html-partial']);
    gulp.watch('src/js/**/*.js', ['js-concat']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
    });
});

/**
 ****************************************************
 * HTML tasks
 ****************************************************
 */

gulp.task('html-partial', function () {
    return gulp.src(['src/html/**/*.html'])
        .pipe(htmlPartial({
            basePath: 'src/html/partials/'
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html-minify', function() {
  return gulp.src('dist/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('html-to-root', [], function() {
  console.log('Moving html to root');
  gulp.src('dist/**/*.html')
      .pipe(gulp.dest(''));
});


/**
 ****************************************************
 * SASS/CSS tasks
 ****************************************************
 */

gulp.task('sass-compile', function() {
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
            .pipe(uglifycss({
                "maxLineLen": 80,
                "uglyComments": true
            }))
            .pipe(gulp.dest(cssDest));
});

/**
 ****************************************************
 * Javascript tasks
 ****************************************************
 */

gulp.task('js-purify', function() {
    return gulp.src(['!src/js/lib/jquery.min.js', jsFiles])
        .pipe(gulp.dest('src/js'))
        .pipe(uglify());
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

/**
 ****************************************************
 * Build tasks
 ****************************************************
 */

gulp.task('html', function(callback) {
    runSequence('html-partial', 'html-minify', 'html-to-root');
});

gulp.task('css', function(callback) {
    runSequence('sass', 'css-purify');
});

gulp.task('js', function(callback) {
    runSequence('js-purify', 'js-concat');
});

gulp.task('build', function(callback) {
    runSequence('html', 'css', 'js');
});
