// Grunt configuration updated to latest Grunt.  That means your minimum
// version necessary to run these tasks is Grunt 0.4.
module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    // Empty and remove build directory.
    // NOTE: This is a forced clean.
    clean: {
      options: { force: true },
      build: {
        src: ["<%= pkg.buildDir %>/<%= pkg.name %>"]
      }
    },

    // Run your source code through JSHint's defaults.
    jshint: ["app/**/*.js"],

    // This task uses James Burke's excellent r.js AMD builder to take all
    // modules and concatenate them into a single file.
    requirejs: {
      release: {
        options: {
          // Include the main ration file.
          mainConfigFile: "app/config.js",

          // Setting the base url to the distribution directory allows the
          // Uglify minification process to correctly map paths for Source
          // Maps.
          baseUrl: "<%= pkg.buildDir %>/<%= pkg.name %>/app",

          // Include Almond to slim down the built filesize.
          name: "almond",

          // Set main.js as the main entry point.
          include: ["main"],
          insertRequire: ["main"],

          // Since we bootstrap with nested `require` calls this option allows
          // R.js to find them.
          findNestedDependencies: true,

          // Wrap everything in an IIFE.
          wrap: true,

          // Output file.
          out: "<%= pkg.buildDir %>/<%= pkg.name %>/source.min.js",

          // Enable Source Map generation.
          generateSourceMaps: true,

          // Do not preserve any license comments when working with source maps.
          // These options are incompatible.
          preserveLicenseComments: false,

          // Minify using UglifyJS.
          optimize: 'none'
        }
      }
    },

    // Move vendor and app logic during a build.
    copy: {
      release: {
        files: [
          { expand: true, src: ["app/**"], dest: "<%= pkg.buildDir %>/<%= pkg.name %>/" },
          { expand: true, src: "vendor/**", dest: "<%= pkg.buildDir %>/<%= pkg.name %>/" }
        ]
      }
    },

    delta: {
      scripts: {
        files: ['app/**/*.js'],
        tasks: ['default']
      }
    }
  });

  // Grunt contribution tasks.
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Grunt BBB tasks.
  grunt.loadNpmTasks("grunt-bbb-requirejs");

  // Watch Alias
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', [ 'build', 'delta' ]);

  // The default command
  grunt.registerTask('default', ['clean', 'build']);

  // The build command.
  // NOTE: This will NOT clean the directory first. This task
  // expects that you will have done that in the parent runner.
  grunt.registerTask("build", ["jshint", "copy", "requirejs"]);

};
