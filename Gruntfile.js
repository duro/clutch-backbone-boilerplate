// Grunt configuration updated to latest Grunt.  That means your minimum
// version necessary to run these tasks is Grunt 0.4.
module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    // Empty and remove `dist/` directory.
    clean: ["<%= pkg.buildDir %>/<%= pkg.name %>"],

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
    }
  });

  // Grunt contribution tasks.
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-copy");

  // Grunt BBB tasks.
  grunt.loadNpmTasks("grunt-bbb-requirejs");

  // When running the default Grunt command, just lint the code.
  grunt.registerTask("default", [
    "clean", "jshint", "copy", "requirejs"
  ]);

};
