var gulp = require("gulp");
var browserify = require("gulp-browserify");
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;
// Set up an express server (not starting it yet)
var server = express();
// Add live reload
server.use(livereload({port: livereloadport}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
  res.sendfile('index.html', { root: 'dist' });
});


// Dev task
gulp.task('dev', ['lint','browserify'], function() { });
// Browserify task
gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out)
  gulp.src(['app/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: false
  }))
  // Bundle to a single file
  .pipe(concat('compiled.js'))
  // Output it to our dist folder
  .pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
  gulp.src('app/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

//watch file change
gulp.task('watch', ['lint'], function() {
  // Start webserver
  server.listen(serverport);
  // Start live reload
  refresh.listen(livereloadport);

  // Watch our scripts, and when they change run browserify
  gulp.watch(['app/*.js'],[
    'browserify'
  ]);

  gulp.watch('./dist/**').on('change', refresh.changed);

});

//只需gulp 即可  default任务是默认任务
gulp.task('default', ['dev', 'watch']);


//原先这里的browserify 就是 npm browserify 的模块
//现在改为gulp-browserify
// gulp.task("browserify", function () {
//     var b = browserify({
//         entries: "main.js",
//         debug: true
//     });

//     return b.bundle()
//         .pipe(source("compiled.js"))
//         .pipe(buffer())
//         .pipe(sourcemaps.init({loadMaps: true}))
//         .pipe(sourcemaps.write("."))
//         .pipe(gulp.dest("./"));
// });