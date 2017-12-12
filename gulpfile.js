var gulp = require('gulp')
var concat = require('gulp-concat')
//var uglify = require('gulp-uglify-es').default
//var sourcemaps = require('gulp-sourcemaps')
var buffer = require('vinyl-buffer')
//var gutil = require('gulp-util')

var browserify = require('browserify')
var source = require('vinyl-source-stream')

var del = require('del')

const outputDirectory = './dist/lib'

gulp.task('build', (cb) => {
    return browserify({
        basedir: './src',
        debug: true,
        entries: ['OxPlayer.js'],
        cache: {},
        packageCache: {}
    })
    .transform('babelify', { presets: ['env'] })
    .bundle()
    .pipe(source('oxplayer.js'))
    .pipe(buffer())
    /*.pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({output: {comments: true}}))
    .pipe(sourcemaps.write('sourcemaps'))*/
    .pipe(gulp.dest(outputDirectory))
})

gulp.task('clean', () => {
    return del(['dist/lib'])
})