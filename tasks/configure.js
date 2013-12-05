function loadEnv(envFile) {
  require('fs').readFileSync(envFile)
    .toString()
    .split('\n')
    .forEach(function(line) {
      var segments = line.split('='),
          variable = segments[0],
          value = segments[1];

      if ( variable && value ) {
        process.env[variable] = value;
      }
    });
}

function ensureInEnv(variables) {
  variables.forEach(function(variable) {
    if ( !process.env[variable] ) {
      console.log(variable, 'is needed in .env.')
      process.exit();
    }
  });
}

module.exports = function(grunt) {
  grunt.registerTask('configure:development', 'Configure for the development environment.', function() {
    loadEnv('.env');
    ensureInEnv(['PARSE_DEV_APP_ID', 'PARSE_DEV_JS_KEY']);

    process.env.PARSE_APP_ID = process.env.PARSE_DEV_APP_ID;
    process.env.PARSE_JS_KEY = process.env.PARSE_DEV_JS_KEY;
  });

  grunt.registerTask('configure:production', 'Configure for the production environment.', function() {
    loadEnv('.env');
    ensureInEnv(['PARSE_PROD_APP_ID', 'PARSE_PROD_JS_KEY']);

    process.env.PARSE_APP_ID = process.env.PARSE_PROD_APP_ID;
    process.env.PARSE_JS_KEY = process.env.PARSE_PROD_JS_KEY;
  });
};
