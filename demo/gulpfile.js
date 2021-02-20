const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

function css() {
	return gulp.src(['./scss/*.scss'])
		.pipe(sass())
		.pipe(rename({ suffix: '.min' }))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(gulp.dest('public'));
}

gulp.task('default', () => {
	css();
	gulp.watch([
		'scss/**/*.scss',
		'node_modules/jlbelanger-robroy/scss/**/*.scss',
	], css);
});

gulp.task('css', () => css());
