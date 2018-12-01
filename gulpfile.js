var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

gulp.task('reload', function(){
    browserSync.reload();
})

gulp.task('serve', ['sass'], function() {
    browserSync({
        server: 'src'
    });
    gulp.watch('src/*.html', ['reload']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
})

gulp.task('sass', function() {
    return gulp.src('src/scss/**/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('erorr', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
})

gulp.task('css', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
})

gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
})

gulp.task('default', ['serve']);