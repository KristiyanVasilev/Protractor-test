var HtmlReporter = require('protractor-beautiful-reporter');

exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    //capabilities: {
    //    browserName: 'firefox',
    //},
    specs: ['spec.js'],
    onPrepare: function() {      
      jasmine.getEnv().addReporter(new HtmlReporter({
         baseDirectory: './test reports'
      }).getJasmine2Reporter());
  }};