/**
 ****************************************************
 * Gulp plugins
 ****************************************************
 */
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    merge = require('merge-stream'),
    clean = require('gulp-clean'),
    file = require('gulp-file'),
    runSequence = require('run-sequence'),

    concat = require('gulp-concat'),
    rename = require('gulp-rename'),

    htmlmin = require('gulp-htmlmin'),
    htmlPartial = require('gulp-html-partial'),

    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    purify = require('gulp-purifycss'),
    bulkSass = require('gulp-sass-bulk-import'),
    autoprefixer = require('gulp-autoprefixer'),

    uglify = require('gulp-uglify'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    exorcist    = require('exorcist'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    assign = require('lodash.assign'),
    babelify    = require('babelify'),

    imageResize = require('gulp-image-resize'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    spritesmith = require('gulp.spritesmith'),

    deploy = require('gulp-gh-pages');

/**
 ****************************************************
 * File destinations
 ****************************************************
 */

var htmlFiles = 'src/html/**/*.html',
    sassFiles = 'src/sass/**/*.sass',
    jsFiles = 'src/js/**/*.js',
    imgFiles = 'src/img/**/*.+(png|jpg|gif)',

    htmlDest = 'dist/',
    cssDest = 'dist/css',
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
var onError = function(err) {
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
 * 5. Image tasks (INCOMPLETE)
 * 6. Test tasks (INCOMPLETE)
 * 8. Deploy task (Pushed to gh-pages)
 * 7. Build tasks (creates separate HTML/CSS/Javascript builds and a
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
    gulp.watch(sassFiles, ['sass-compile']);
    gulp.watch(htmlFiles, ['html-partial']);
    gulp.watch(imgFiles, ['img-min']);
});

gulp.task('browserSync', ['bundle'], function() {
    browserSync.init({
        server: {
            baseDir: htmlDest
        },
    });
});

/**
 ****************************************************
 * HTML tasks
 ****************************************************
 */

gulp.task('html-partial', function() {
    return gulp.src([htmlFiles])
        .pipe(htmlPartial({
            basePath: 'src/html/partials/'
        }))
        .pipe(gulp.dest(htmlDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html-minify', function() {
    return gulp.src('dist/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(htmlDest));
});

gulp.task('html-remove-partials', function() {
    console.log('Removing partials from dist directory');
    return gulp.src('dist/partials', {
            read: false
        })
        .pipe(clean());
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
    console.log('Compiling SASS including autoprefixer, sourcemaps and bulk imports');
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
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('css-purify', function() {
    console.log('Removing unused CSS');
    return gulp.src('dist/css/main.min.css')
        .pipe(purify([jsFiles, htmlFiles]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssDest));
});

/**
 ****************************************************
 * Javascript tasks
 ****************************************************
 */

gulp.task('js-purify', function() {
    console.log('Minifying all js files apart form jquery (which is already minified)');
    return gulp.src(['!src/js/lib/jquery.min.js', jsFiles])
        .pipe(gulp.dest('src/js'))
        .pipe(uglify());
});

gulp.task('js-concat', function() {
    console.log('Concatenating all js files and renaming it to main.min.js');
    return gulp.src(['src/js/lib/jquery.min.js', jsFiles])
        .pipe(concat('main.js'))
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

///////////////////////////////////////////

// Watchify args contains necessary cache options to achieve fast incremental bundles.
// See watchify readme for details. Adding debug true for source-map generation.
watchify.args.debug = true;
// Input file.
var bundler = watchify(browserify('./src/js/app.js', watchify.args));

// Babel transform
bundler.transform(babelify.configure({
    sourceMapRelative: 'app/js'
}));

// On updates recompile
bundler.on('update', bundle);

function bundle() {

    gutil.log('Compiling JS...');

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(exorcist('.dist/js/bundle.js.map'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream({once: true}));
}

/**
 * Gulp task alias
 */
gulp.task('bundle', function () {
    return bundle();
});

gulp.task('js-bundle-minify', function() {
    console.log('Minifying the bundle');
    return gulp.src('dist/js/bundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

/**
 ****************************************************
 * TODO: Fix sprite tasks - Need a solution for resizing the sprite easily
 ****************************************************
 */
gulp.task('sprite-generator', function() {
    // Generate our spritesheet
    var spriteData = gulp.src('dist/img/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite-sheet.sass',
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        // DEV: We must buffer our stream into a Buffer for `imagemin`
        // .pipe(buffer())
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/css'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(gulp.dest('src/sass/helpers'));

    var spriteSass = {
        spriteImport: '@import \'_sprite-sheet\'',
        spriteInclude: '@include sprites($spritesheet-sprites)'
    };

    var makeSpriteSheet = file('_sprite.sass', spriteSass.spriteImport + '\n\n' + spriteSass.spriteInclude, {
            src: true
        })
        .pipe(gulp.dest('src/sass/helpers'));

    // Return a merged stream to handle both `end` events
    console.log('Creating sprite.png and inserting it into dist/css');
    console.log('Also creates sprite sass files with image name as class name');
    return merge(imgStream, cssStream, makeSpriteSheet);
});

gulp.task('img-min', function() {
    console.log('Minfication of images to reduce size');
    gulp.src('src/img/*')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            verbose: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('img-resize', function() {
    console.log('Reducing image to specified size');
    gulp.src('dist/img/image-2.png')
        .pipe(imageResize({
            width: 200,
            height: 200,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest('dist/img'));
});
/**
 ****************************************************
 * TODO: Add a test automation workflow
 ****************************************************
 */

/**
 ****************************************************
 * Deploy task
 *      pushes to gh-pages
 *      url: username.github.io/[repo-name]
 ****************************************************
 */
gulp.task('deploy', function() {
    console.log('Creates a gh pages branch and deploys to github pages from the dist directory');
    return gulp.src("dist/**/*")
        .pipe(deploy());
});

/**
 ****************************************************
 * Build tasks
 ****************************************************
 */

gulp.task('html', function(callback) {
    console.log('Adding html partials, minifes them and removes the partials from dist');
    runSequence('html-partial', 'html-minify', 'html-remove-partials');
});

gulp.task('css', function(callback) {
    console.log('Performs sass compilation and removes unused css');
    runSequence('sass', 'css-purify');
});

gulp.task('build', function(callback) {
    console.log('Performing all html and css tasks');
    runSequence('html', 'css', 'js-bundle-minify');
});
