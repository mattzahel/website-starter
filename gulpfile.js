var gulp = require('gulp');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');
var plumber = require('gulp-plumber');
var deploy = require('gulp-gh-pages');

var config = {
    dist: 'dist/',
    src: 'src/',
    cssin: 'src/css/**/*.css',
    jsin: 'src/js/**/*.js',
    imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
    htmlin: 'src/*.html',
    scssin: 'src/scss/**/*.scss',

    cssout: 'dist/css/',
    jsout: 'dist/js/',
    imgout: 'dist/img/',
    htmlout: 'dist/',
    scssout: 'src/css/',
    cssoutname: 'style.css',
    jsoutname: 'script.js',
    
    cssreplaceout: 'css/style.css',
    jsreplaceout: 'js/script.js'
}

gulp.task('reload', function(){
    browserSync.reload();
})

gulp.task('serve', ['sass'], function() {
    browserSync({
        server: config.src
    });
    gulp.watch([config.htmlin, config.jsin], ['reload']);
    gulp.watch(config.scssin, ['sass']);
})

gulp.task('sass', function() {
    gulp.src(config.scssin)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('erorr', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(config.scssout))
        .pipe(browserSync.stream());
})

gulp.task('css', function() {
    return gulp.src(config.cssin)
        .pipe(concat(config.cssoutname))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.cssout));
})

gulp.task('js', function() {
    return gulp.src(config.jsin)
        .pipe(concat(config.jsoutname))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest(config.jsout));
})

gulp.task('img', function() {
    return gulp.src(config.imgin)
        .pipe(changed(config.imgout))
        .pipe(imagemin())
        .pipe(gulp.dest(config.imgout));
})

gulp.task('html', function() {
    return gulp.src(config.htmlin)
        .pipe(htmlReplace({
            'css' : config.cssreplaceout,
            'js' : config.jsreplaceout
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.dist))
});

gulp.task('clean', function(){
    return del([config.dist]);
});

gulp.task('build', function() {
    sequence('clean', ['html', 'css', 'js', 'img']);
})

gulp.task('deploy', function () {
    return gulp.src("./dist/**/*")
      .pipe(deploy());
  });

gulp.task('default', ['serve']);