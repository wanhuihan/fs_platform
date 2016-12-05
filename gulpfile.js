var gulp = require('gulp');

var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// optimizing css and Js files
// var useref = require('gulp-useref');
// var uglify = require('gulp-uglify');
// var gulpIf = require('gulp-if');
// var cssnano = require('gulp-cssnano');

var runSequence = require('run-sequence');

gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass()) // Using gulp-sass
	.pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
  		stream: true
    }))
});

gulp.task('browserSync', function() {
    // var files = [
    //     '**/*'
    // ];
	browserSync.init({
		server: {
	  		baseDir: 'app'
		},
	})

	
})

// gulp.task('useref', function(){
// 	return gulp.src('app/*.html')
// 	.pipe(useref())
// 	.pipe(gulpIf('*.js', uglify()))
// 	.pipe(gulpIf('*.css', cssnano()))
// 	.pipe(gulp.dest('dist'))
// });

// Gulp watch syntax
gulp.task('watch', ['browserSync','sass'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']); 
	gulp.watch("app/*.html").on('change', browserSync.reload);
	// Other watchers
})