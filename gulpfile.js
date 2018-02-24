var gulp  = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
var jsonminify = require('gulp-jsonminify');
var development = true;

// Operação padrão: chame 'gulp' no terminal
gulp.task('init', ['build-app'/*, 'build-MBooclass',
	'build-less', 'build-html', 'build-json', 'build-fonts'*/]);

// Operação padrão: chame 'gulp' no terminal
gulp.task('default', ['init', 'watch']);

// Operação de produção
gulp.task('deploy', ['dev-false', 'init'], function(){
	development = true;
});
gulp.task('dev-false', function(){
	development = false;
});

// Constroi 1 único arquivo app.js
gulp.task('build-app', function() {
	return gulp.src([
		'./src/main/webapp/angular-templates/**/*.js',
		'./src/main/webapp/views/**/*.js'])
	.pipe(gulpif(development, sourcemaps.init()))
	.pipe(concat('app.js'))
	.pipe(uglify().on('error', function(e){
        console.log(e);
    }))
	.pipe(gulpif(development, sourcemaps.write()))
	.pipe(gulp.dest('./src/main/webapp/dist/'));
});

// Constroi 1 único arquivo mbooclass.js
/*gulp.task('build-MBooclass', function() {
	return gulp.src('./src/MBooclass/**//*.js')
	.pipe(gulpif(development, sourcemaps.init()))
	.pipe(concat('mbooclass.js'))
	.pipe(uglify())
	.pipe(gulpif(development, sourcemaps.write()))
	.pipe(gulp.dest('./public/dist/js'));
});

// Constroi 1 único arquivo .less
gulp.task('build-less', function(){
	return gulp.src('./src/**//*.less')
	.pipe(gulpif(development, sourcemaps.init()))
	.pipe(less())
	.pipe(concat('styles.css'))
	.pipe(uglifycss())
	.pipe(gulpif(development, sourcemaps.write()))
	.pipe(gulp.dest('./public/dist/css'));
});

// Constroi 1 único arquivo fonts
gulp.task('build-fonts', function(){
	return gulp.src('./src/**//*.fonts')
	.pipe(gulpif(development, sourcemaps.init()))
	.pipe(less())
	.pipe(concat('fonts.css'))
	.pipe(uglifycss())
	.pipe(gulpif(development, sourcemaps.write()))
	.pipe(gulp.dest('./public/dist/css'));
});

// Realoca arquivos html
gulp.task('build-html', function(){
	return gulp.src('./src/**//*.html')
	.pipe(gulpif(!development, htmlmin({collapseWhitespace: true})))
	.pipe(gulp.dest('./public/dist/html'));
});

// Realoca arquivos json
gulp.task('build-json', function(){
	return gulp.src('./src/**//*.json')
	.pipe(gulpif(!development, jsonminify()))
	.pipe(gulp.dest('./public/dist/html'));
});*/

// Observa por mudanças nos arquivos
gulp.task('watch', function() {
	//gulp.watch('./src/MBooclass/**/*.js', ['build-MBooclass']);
	gulp.watch('./src/main/webapp/angular-templates/**/*.js', ['build-app']);
	//gulp.watch('./src/**/*.less', ['build-less']);
	//gulp.watch('./src/**/*.html', ['build-html']);
	//gulp.watch('./src/**/*.json', ['build-json']);
	//gulp.watch('./src/**/*.fonts', ['build-fonts']);
});