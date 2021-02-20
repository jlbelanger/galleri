const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

function css() {
	return gulp.src(['./scss/*.scss', './demo/scss/*.scss'])
		.pipe(sass())
		.pipe(rename({ suffix: '.min' }))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(gulp.dest('demo/public'));
}

function distCss() {
	return gulp.src(['./demo/public/*.css'])
		.pipe(gulp.dest('dist/css'));
}

function distJs() {
	return gulp.src(['./demo/public/*.js'])
		.pipe(gulp.dest('dist/js'));
}

gulp.task('default', () => {
	(gulp.parallel('css', 'dist:css', 'dist:js')());
	gulp.watch(['scss/**/*.scss', 'demo/scss/**/*.scss'], css);
	gulp.watch(['demo/public/*.css'], distCss);
	gulp.watch(['demo/public/*.js'], distJs);
});

gulp.task('css', () => css());

gulp.task('dist:css', function () {
	return distCss();
});

gulp.task('dist:js', function () {
	return distJs();
});
