/**
 * Order Management Portal
 * by Nikhil(Martian)
 */

// Declaring gulp variable
var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  $ = require('gulp-load-plugins')(),
  del = require('del'),
  runSequence = require('run-sequence'),
  cleanCSS = require('gulp-clean-css'),
  RevAll = require('gulp-rev-all'),
  rev = require('gulp-rev'),
  revReplace = require('gulp-rev-replace'),
  revDel = require('rev-del'),
  revDelOriginal = require('gulp-rev-delete-original'),
  path = require('path'),
  Server = require('karma').Server,
  uglify = require('gulp-uglify');




//Browser-sync tasks: START
////////////////////////////////////////////////////

// Browser-sync
gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: "./src/"
    },
    port: 7777
  });
});

// Reload all Browsers
gulp.task('bs-reload', function () {
  browserSync.reload();
});

// Start webserver
gulp.task('serve', function (done) {
  return browserSync({
    server: {
      baseDir: './src/'
    },
    port: 8888
  }, done);
});

// Start webserver from _build folder
gulp.task('serve-build', function (done) {
  return browserSync({
    server: {
      baseDir: './_build/'
    },
    port: 3000
  }, done);
});

////////////////////////////////////////////////////
//Browser-sync tasks: END//

// Clean build folder
gulp.task('clean:build', function (cb) {
  del([
    '_build/**.**',
    '_build/app/',
    '_build/assets/',
    '_build/favicon/',
    '_build/bower_components/',
    '!_build/WEB-INF/'
    // if we don't want to clean any file we can use negate pattern
    //'!dist/mobile/deploy.json'
  ], cb);
});



// copy fonts from a module outside of our project (like Bower)
// need to update !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
gulp.task('fonts', function () {
  gulp.src('./src/**/**/**/*.{ttf,woff,eof,eot}')
    .pipe($.rename({
      dirname: ''
    }))
    .pipe(gulp.dest('./_build/assets/fonts'));
});


// Optimize images
gulp.task('images', function () {
  return gulp.src('./src/assets/images/**/*.*') //only two level subfolders considered * Standard practice
    .pipe($.changed('./_build/src/assets/images/'))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./_build/assets/images/'));
});




// minify HTML
gulp.task('minify-html', function () {
  gulp.src(['./src/**/**/*.html', '!./src/bower_components/**/*.html'])
    .pipe($.bytediff.start())
    .pipe($.htmlmin({
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
      removeComments: true
    }))
    .pipe($.bytediff.stop(bytediffFormatter))
    .pipe(gulp.dest('./_build/'));
});

// minify HTML
gulp.task('minify-index-html', function () {
  gulp.src(['./_build/*.html'])
    .pipe($.bytediff.start())
    .pipe($.htmlmin({
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
      removeComments: true
    }))
    .pipe($.bytediff.stop(bytediffFormatter))
    .pipe(gulp.dest('./_build/'));
});




// minify CSS
// minifying @src/assets/css only
gulp.task('copy-css', function () {
  gulp.src(['./src/assets/css/**/*.css', '!./src/assets/css/bootstrap_custom/**/*.css', '!./src/assets/css/grid.css'])
    .pipe($.bytediff.start())
    .pipe($.autoprefixer(['last 2 versions']))
    .pipe(cleanCSS({
      rebase: false
    }))
    .pipe($.bytediff.stop(bytediffFormatter))
    .pipe(gulp.dest('./_build/assets/css/'));
});




// ngAnnotate and minify JS
gulp.task('minify-js', function () {
  gulp.src(['./src/app/**/*.js', '!./src/app/**/*.spec.js', '!./src/app/*.js'])
    .pipe($.ngAnnotate({
      add: true,
      single_quotes: true
    }))
    .pipe($.bytediff.start())
    .pipe(uglify())
    .pipe($.bytediff.stop(bytediffFormatter))
    .pipe(gulp.dest('_build/app'));
});





/*
 *SASS task, will run when any SCSS files change &
 *BrowserSync will auto-update browsers
 */
gulp.task('sass', function () {
  return gulp.src('./src/assets/css/sass/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      style: 'expanded'
    }))
    // .on('error', $.notify.onError({
    //   title: 'SASS Failed',
    //   message: 'Error(s) occurred during compile!'
    // }))
    .pipe($.autoprefixer(['last 2 versions']))
    .pipe(gulp.dest('./src/assets/css/sass/'))
    .pipe(reload({
      stream: true
    }));
    // .pipe($.notify({
    //   message: 'Styles task complete'
    // }));
});





// index.html build
// script/css concatenation n versioning
//
// Change log- Autoprefixer removed : creating problem in iPad/safari browser
gulp.task('usemin', function () {
  return gulp.src('./src/index.html')
    // add templates path
    .pipe($.htmlReplace({
      'templates': '<script type="text/javascript" src="js/templates.js"></script>'
    }))
    .pipe($.usemin({
      css: [cleanCSS()],
      angularlibs: [uglify()],
      appcomponents: [$.ngAnnotate({
        add: true,
        single_quotes: true
      }), uglify()]
    }))
    .pipe(gulp.dest('./_build/'));
});

// Rename assets based on content cache
gulp.task('revision', function () {
  return gulp.src(['./_build/**/**/*.{js,css}'])
    .pipe(RevAll.revision())
    .pipe(revDelOriginal())
    .pipe(gulp.dest('./_build'))
    .pipe(RevAll.manifestFile())
    .pipe(revDel({
      dest: './_build'
    }))
    .pipe(gulp.dest('./_build'));
});

// Replace URLs with hashed ones based on rev manifest.
// Runs immediately after revision:
gulp.task('revreplace', ['revision'], function () {
  var manifest = gulp.src('./_build/rev-manifest.json');

  return gulp.src('./_build/**/*.{html,js}')
    .pipe(revReplace({
      manifest: manifest
    }))
    .pipe(gulp.dest('./_build'));
});




// calculate build folder size
gulp.task('build:size', function () {
  var s = $.size();

  return gulp.src('./_build/**/*.*')
    .pipe(s);
    // .pipe($.notify({
    //   onLast: true,
    //   message: function () {
    //     return 'Total build size ' + s.prettySize;
    //   }
    // }));
});




// Copy All Files At The Root Level (app) as well some JSp pages
gulp.task('copy', function () {
  return gulp.src([
    './src/*.*',
    '!./src/*.html',
    '!./src/*js'
  ], {
    dot: true
  }).pipe(gulp.dest('./_build'));
});

// Copy All Files from Favicon
gulp.task('copy:favicon', function () {
  return gulp.src([
    './src/favicon/*'
  ], {
    dot: true
  }).pipe(gulp.dest('./_build/favicon/'));
});


// SW-precache Swervice worker generator
gulp.task('sw', function (callback) {
  var swPrecache = require('sw-precache');
  var rootDir = './_build';

  swPrecache.write(path.join(rootDir, '/sw.js'), {
    staticFileGlobs: [
      rootDir + '/app/**/**.*',
      rootDir + '/assets/**/**.*',
      rootDir + '/favicon/**.*'
    ],
    stripPrefix: rootDir
  }, callback);

});

// minify SW
gulp.task('minify-js-sw', ['sw'], function () {
  gulp.src(['./_build/sw.js'])
    .pipe($.bytediff.start())
    .pipe(uglify())
    .pipe($.bytediff.stop(bytediffFormatter))
    .pipe(gulp.dest('./_build/'));
});




//SUPPORTING FUNCTIONS
/////////////////////////////////////////////////////////

function bytediffFormatter(data) {
  var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
  return data.fileName + ' went from ' +
    (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' +
    ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference;
}

function formatPercent(num, precision) {
  return (num * 100).toFixed(precision);
}






// Default task to be run with `gulp` command
// this default task will run BrowserSync & then use Gulp to watch files.
// when a file is changed, an event is emitted to BrowserSync with the filepath.
gulp.task('default', ['browser-sync', 'sass'], function () {
  gulp.watch('./src/assets/css/*.min.css', function (file) {
    if (file.type === "changed") {
      reload(file.path);
    }
  });
  gulp.watch(['./src/**/**/*.html', './src/app/**/**/**/*.html'], ['bs-reload']);
  gulp.watch(['./src/app/**/**/*.js', './src/**/**/**/*.js'], ['bs-reload']);
  gulp.watch(['./src/assets/css/*.css', './src/assets/css/**/*.css'], ['bs-reload']);
  gulp.watch(['./src/assets/css/**/*.scss'], ['sass']);
});




/**
 * build task:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 * 9. copy files from root folders like favicon
 * 10. Generate Service Worker at build folder
 */
gulp.task('build', function (callback) {
  runSequence(
    'clean:build',
    'sass',
    'minify-html',
    'copy-css',
    'minify-js',
    'images',
    'usemin',
    'minify-index-html',
    'fonts',
    'build:size',
    'copy:favicon',
    'copy',
    'revreplace',
    callback);
});

// SW generation removed

//Testing with Karma and Jasmine
///////////////////////////////////////////////

//Single sun Karma test

gulp.task('test', function (done) {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

//Continuous run Karma test

gulp.task('test-auto', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});



