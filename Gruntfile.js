module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat : {
			options: {
		    separator: '\n '
		  },
	  	libs : {
	  		src : ['bower_components/angular/angular.js'],
	  		dest : 	'dist/<%= pkg.name %>.libs.js'		 
	  	},
	    // angularFiles : {
	    // 	src : ['js/**/*.js'],
	    // 	dest: 'dist/<%= pkg.name %>.js'
	    // },
	    // cssLibs : {
    	// 	src : ['css/libs/*.css',
    	// 			   'bower_components/angular-ui-notification/dist/angular-ui-notification.min.css'],
	    // 	dest : 'dist/<%= pkg.name %>.libs.css'
	    // },
	    // angularCss : {
	    // 	src : ['css/*.css'],
	    // 	dest : 'dist/<%= pkg.name %>.css'
	    // }
		},
		// uglify: {
		//   options: {
		//     banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		//   },
		//   dist: {
		//     files: {
		//       'dist/<%= pkg.name %>.min.js': ['<%= concat.angularFiles.dest %>'],
		//       'dist/<%= pkg.name %>.libs.min.js': ['<%= concat.libs.dest %>']
		//     },
		//     options: {
		// 	    mangle: false
		// 	  }
		//   }
		// },
		// html2js: {
	 //    options: {
	 //      // custom options, see below
	 //      base : "js",
	 //      module : "<%= pkg.name %>.templates",
	 //      htmlmin: {
		// 	    collapseBooleanAttributes: true,
		// 	    collapseWhitespace: true,
		// 	    removeAttributeQuotes: true,
		// 	    removeComments: true,
		// 	    removeEmptyAttributes: true,
		// 	    removeRedundantAttributes: true,
		// 	    removeScriptTypeAttributes: true,
		// 	    removeStyleLinkTypeAttributes: true
		// 	  }
	 //    },
	 //    main: {
	 //      src: ['js/**/*.html'],
	 //      dest: 'dist/templates.js'
	 //    },
	 //  }
	
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	// grunt.registerTask('default', ['concat:libs','concat:angularFiles','concat:cssLibs','concat:angularCss','html2js','uglify']);
	grunt.registerTask('default', ['concat:libs']);
}