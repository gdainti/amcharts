var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    nodemon = require('gulp-nodemon'),
    htmlmin = require('gulp-htmlmin');

var paths = {
    src: {
        scripts: ['js/*.js'],
        styles: 'scss/**/*.scss',
        mainScss: 'scss/main.scss',
        images: 'images/**/*.{png,jpg,gif}',
        html: 'html/*.html'
    },
    public: {
        scripts: '../js',
        styles: '../css',
        images: '../img',
        html: '../'
    }
};

// compile scss
gulp.task('styles', function () {
    gulp.src(paths.src.mainScss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(rename({basename: 'style',suffix: '.min'}))
        .pipe(gulp.dest(paths.public.styles))
        .pipe(livereload());
});

// concat, minify js
gulp.task('scripts', function(){
    gulp.src(paths.src.scripts)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat("script.js"))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.public.scripts))
        .pipe(livereload());
});

// html
gulp.task('html', function(){
    gulp.src(paths.src.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.public.html))
        .pipe(livereload())
    ;
});

//optimize images
gulp.task('images', function() {
    return gulp.src(paths.src.images)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(paths.public.images));
});

//clean image folder
gulp.task('cleanImages', function(cb) {
    del(paths.public.images, {force: true}, cb)
});

//clean all folders
gulp.task('cleanAll', function(cb) {
    del(paths.public.images, {force: true}, cb);
    del(paths.public.scripts, {force: true}, cb);
    del(paths.public.styles, {force: true}, cb);
});

var nodemonOptions = {
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    verbose: false,
    ignore: [],
    watch: ['server.js']
};

gulp.task('server', function () {
    nodemon(nodemonOptions)
        .on('restart', function () {
            console.log('restarted!')
        });
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.src.styles, ['styles']);
    gulp.watch(paths.src.scripts, ['scripts']);
    gulp.watch(paths.src.images, ['images']);
    gulp.watch(paths.src.html, ['html']);
});

gulp.task('default', ['server', 'html', 'images',  'styles', 'scripts', 'watch']);

