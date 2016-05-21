var gulp  	    = require( 'gulp' ),
    gutil       = require( 'gulp-util' ),
    browserify	= require( 'gulp-browserify' ),
    autoprefix	= require( 'gulp-autoprefixer' ),
    minifycss   = require( 'gulp-minify-css' ),
    watch       = require( 'gulp-watch' ),
    uglify      = require( 'gulp-uglify' ),
    sass        = require( 'gulp-sass' ),
    plumber     = require( 'gulp-plumber' ),
    browserSync = require( 'browser-sync' ),
    jshint      = require( 'gulp-jshint' ),
    stylish     = require( 'jshint-stylish' ),
    reload      = browserSync.reload;

var phpSources	= [ './**/*.php' ],
    sassSources	= [ './scss/**/*.scss' ],
    jsSources   = [ './js/**/*.js' ];

var onError = function( err ){
  	gutil.beep();
  	console.log( 'An error has occured:', err );
  	this.emit( 'end' );
};

gulp.task( 'server', function(){
    browserSync.init({
        // change 'playground' to whatever your local Nginx/Apache vhost is set
        // most commonly 'http://localhost/' or 'http://127.0.0.1/'
        // See http://www.browsersync.io/docs/options/ for more information
        proxy: 'playground'
    });

    watch( phpSources, reload );

    watch( sassSources, function(){
        gulp.start( 'scss' );
    });

    watch( jsSources, function(){
        gulp.start( 'jshint' );
    });
});

// Processes SASS and reloads browser.
gulp.task( 'scss', function(){
    return gulp.src( './scss/style.scss' )
        .pipe( plumber({ errorHandler: onError }) )
        .pipe( sass() ).on( 'error', gutil.log )
        .pipe( autoprefix({
        browsers: [ 'last 2 versions' ],
        cascade: true
        }) )
        .pipe( gulp.dest( '.' ) )
        .pipe( reload({ stream: true }) );
});

// Jshint outputs any kind of javascript problems you might have
// Only checks javascript files inside /js directory
gulp.task( 'jshint', function(){
    return gulp.src( jsSources )
        .pipe( jshint( '.jshintrc' ) )
        .pipe( jshint.reporter( stylish ) )
        .pipe( jshint.reporter( 'fail' ) )
        .pipe( plumber({ errorHandler: onError }) )
        .pipe( browserify() )
        .pipe( reload({ stream: true }) );
});

// The default task. When developting just run 'gulp' and this is what will be ran.
// Note the second parameter, those are dependency tasks which need to be done
// before the main function (third parameter) is called.
gulp.task( 'default', [ 'scss', 'server' ], function(){
    console.log( 'done' );
});
