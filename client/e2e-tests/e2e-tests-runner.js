#!/usr/bin/env node

/**************************
* Install dependencies with
* npm i --only=dev
*/

var fs = require('fs');

var config = {
    basePath: __dirname + '/../',
    testPath: 'e2e-tests/tests/'
};
config.nightwatchConfig = config.basePath + "e2e-tests/nightwatch.config.json";
config.nightwatchBin = config.basePath + "node_modules/nightwatch/bin/nightwatch";

// remove . (eg .DS_Store) dirs from list
var tmpDirs = fs.readdirSync(config.basePath+config.testPath);
var testDirs = [];
var i;
// console.log('tmpDirs', tmpDirs);
for(i=0;i<tmpDirs.length;i++) {
    if(tmpDirs[i] && tmpDirs[i].indexOf('.') === -1) {
        testDirs.push(tmpDirs[i]);
    }
}

// list-dir sync version
var getFiles = function(path){
  var walkSync = function(currentDirPath, callback) {
      var fs = require('fs'),
          path = require('path');
      fs.readdirSync(currentDirPath).forEach(function (name) {
          var filePath = path.join(currentDirPath, name);
          var stat = fs.statSync(filePath);
          if (stat.isFile()) {
              callback(filePath, stat);
          } else if (stat.isDirectory()) {
              walkSync(filePath, callback);
          }
      });
  };

  var data = [];
  walkSync(path, function(file){
    // don't add files started with dot (eg /.DS_Store)
    if(file.indexOf('.')!==0){
      data.push(file);
    }
  });
  return data;
};


var tmpFiles = getFiles(config.basePath+config.testPath);
var testFiles = [];
var i;
// console.log('tmpFiles', tmpFiles);
for(i=0; i<tmpFiles.length; i++) {
    if(tmpFiles[i].indexOf('/.') === -1) {
        testFiles.push(tmpFiles[i]);
    }
}
// define options
var options = {
    testDirs: testDirs,
    testFiles: testFiles
};

var files = options.testFiles;
if(files[0]){
    var paths = files[0].split(config.testPath);
    config.replacePath = paths[0]+config.testPath;
}
var fileString = ''; //'Use first integer as option value: ';
for(var i=0; i<files.length; i++){
    var newPath = files[i].replace(config.replacePath, '');
    fileString += i +'...' + newPath + '\n';
}
options.testFiles = fileString;


var argv = require('yargs')
.usage('Usage: $0 [options]')

.alias('e', 'env')
.describe('e', 'Envs: chrome, firefox, saucelabs, noselenium or locally use chrome-open for debugging.')

.alias('t', 'test')
.describe('t', 'Run single test file. (1st # or path/filename.js) '+options.testFiles )

.alias('d', 'dir')
.describe('d', 'Run all tests from a directory')
.choices('d', options.testDirs)

.alias('a', 'tag')
.describe('a', 'Run tests with specific tag (stage, prod, e2e, integration, daily, hourly) or a combination of it.')

.alias('r', 'retries')
.describe('r', 'How often should testSuites be retried. Default e2e: 0, integration: 3')

.alias('p', 'priorities')
.describe('p', 'Does not run any test but shows all defined test cases with their piorities')

.example('./$0 -f 0', 'Chrome with first test')
.example('./$0 -f checkout/checkout-content.js', 'Chrome with checkout content')
.example('./$0 -e firefox --dir checkout', 'Firefox and Checkout Tests')
.example('./$0 -e noselenium --tag integration', 'All integrations tests at once')

.help('h')
.alias('h', 'help')

// .epilog('hybris - copyright 2016')

.check(function(argv){

    // if p is defined, everything is ok
    if(argv.p){
      return true;
    }
    // Its not allowed to have two similar options at the same time!
    // Options --test, --dir and --tag cannot be used together.
    var f = (typeof argv.t !== 'undefined') ? true : false;
    if(!f && !argv.d && !argv.a){
        return 'Error: Option --test, --dir or --tag missing.';
    } else
    if(f && argv.d || f && argv.a || argv.d && argv.a){
        return 'Error: Options --test, --dir and --tag cannot be used together.';
    }
    return true;
})

.argv;

var nightwatchArgs = ['--config', config.nightwatchConfig];
if(argv.t || Number(argv.t) === 0){ // converting to number, else it will fail if you provide -t 0
    // if filename is string, get integer from files array
    if(typeof argv.t === 'string'){
      for(var i=0;i<files.length;i++){
        if(files[i].indexOf(argv.t)!==-1){
          argv.t = i;
          break;
        }
      }
    }
    if(!files[argv.t]){
        console.error('Error: file could not be found, be sure to only specify a single integer or partial filepath');
        return false;
    }
    nightwatchArgs.push('-t', files[argv.t]);
} else if(argv.d){
    nightwatchArgs.push('--group', config.basePath + config.testPath + argv.d + '/');
} else if(argv.a){
    argv.a = (typeof argv.a === 'string') ? [argv.a] : argv.a;
    // old --tag syntax
    argv.a.forEach(function(tag) {
      nightwatchArgs.push('--tag', tag);
    });
    // new --tags syntax, enable once https://github.com/nightwatchjs/nightwatch/issues/955 is merged and closed
    // nightwatchArgs.push('--tags', argv.a.join(','));
} else if(argv.skiptags){
  nightwatchArgs.push('--skiptags', argv.skiptags);
}

// generate list of test files
if(argv.p){
  var reqContent, reqKeys = {};
  var skipKeysStartingWith = ['@', 'after', 'before'];
  for(var index in files){
    // skip files if tag is defined
    if(argv.a && files[index].indexOf(argv.a)===-1){
      continue;
    }

    reqContent = require(files[index]);
    reqKeys[ files[index].replace(config.replacePath, '') ] = Object.keys(reqContent).filter(function(value){
      var takeThis = true;
      skipKeysStartingWith.filter(function(skipKey){
        if(value.indexOf(skipKey)===0){
          takeThis = false;
          return;
        }
      });
      return takeThis;
    });
  }

  // output in wiki pastable format (markdown), which you can enter to
  // https://wiki.hybris.com/pages/editpage.action?pageId=258943838
  // with Insert > {} Markdown
  for(var testfilename in reqKeys){
    console.log('');
    console.log('**' + testfilename + '** \r\n');
    // console.log('');
    for(var index in reqKeys[testfilename]){
      var testname = reqKeys[testfilename][index].replace('PARTIAL', '**PARTIAL**').replace('MAJOR', '**MAJOR**');
      console.log('* ' + testname);
    }
  }

  process.exit(100);
  return false;
}
// ######### TEST RUNNER ###########
var runNightwatchTests = function(){
  console.log('Running: ', nightwatchArgs.join(' '));
  var nw = require('child_process').spawn(config.nightwatchBin, nightwatchArgs, { cwd: __dirname + '/../' });

  nw.stdout.on('data', function (data) {
      data = data+'';
      data = data.replace('\n', '');
      console.log(data);
  });

  nw.on('error', function (data) {
    console.log('');
    if(data.code==='ENOENT'){
      console.error('ERROR, Executable does not exist:');
      console.error(data.path);
    } else {
      console.error('spawn error: ', JSON.stringify(data, null, 2));
    }
    console.error('');
  });

  nw.stderr.on('data', function (data) {
      console.error('nw.stderr.data: ' + data);
  });

  nw.stderr.on('error', function (data) {
      console.error('nw.stderr.error: ' + data);
  });

  nw.on('exit', function (code) {
    if(code===0){
      console.log('nightwatch exited with success.');
    } else {
      console.error('nightwatch exited unsuccessful: ' + code);
    }
    process.exit(code);
  });
};


// ######### ENVIRONMENT DISTINCTION ###########
var doesNotRequireSelenium = false;
var isIntegrationTest = (argv.a && argv.a.indexOf('integration') > -1) || (argv.t && files[argv.t].indexOf('integration') > -1);
process.env.isIntegrationTest = isIntegrationTest;
if(!argv.e && !isIntegrationTest){
  argv.e = 'chrome'; // default browser
}

if(isIntegrationTest){
  argv.e = 'noselenium';
  doesNotRequireSelenium = true;
}
// Resilience. I sometimes mistype and use environment integration instead of noselenium ;)
argv.e = (argv.e === 'integration') ? 'noselenium' : argv.e;

// Override setting depending on bamboo environment vars
if(process.env && process.env.bamboo_capability_agent_category){
  // UI: nightwatch configs without -selenium prefix
  // pool / smallbuild: nightwatch configs with -selenium prefix
  console.log('process.env.bamboo_capability_agent_category', process.env.bamboo_capability_agent_category);
  switch(process.env.bamboo_capability_agent_category){
    case 'ui':
      argv.e = argv.e.replace('-selenium', '');
      doesNotRequireSelenium = true;
      console.log('process.env.bamboo_capability_agent_category chosen setting', argv.e);
      break;
    case 'pool':
    case 'aas':
      // override env and set to saucelabs on bamboo
      argv.e = !isIntegrationTest ? 'saucelabs' : argv.e;
      break;
    default:
      argv.e = argv.e.indexOf('-selenium')>-1 ? argv.e : argv.e + '-selenium';
  }
}
process.env.selectedEnvironment = argv.e;
nightwatchArgs.push('-e', argv.e);

// ######### RETRIES #########
// Retry default values if not defined, depending on environment
if(typeof argv.r === 'undefined'){
  switch(argv.e){
    case 'noselenium':
    case 'integration':
      argv.r = 2;
      break;
    default:
      argv.r = 1;
  }
}
if(argv.r){
  nightwatchArgs.push('--suiteRetries', argv.r);
  // nightwatchArgs.push('--retries', argv.r); // TODO: enable once retry strategy is fixed in tests (beforeEach instead of before for creating)
}

// ######### INSTALL SELENIUM ###########
var seleniumAlreadyInstalled = false;
try{
  var seleniumDir = fs.readdirSync(config.basePath+'node_modules/selenium-standalone');
  seleniumAlreadyInstalled = (seleniumDir.indexOf('.selenium') !== -1);
} catch(e){}

if(isIntegrationTest || doesNotRequireSelenium || seleniumAlreadyInstalled){
  runNightwatchTests();
} else {
  console.log('Selenium Server not installed, running installer.');
  var sel = require('child_process').spawn(config.basePath + '/node_modules/selenium-standalone/bin/selenium-standalone', ['install', '--version=2.53.0']);

  sel.stdout.on('data', function (data) {
    console.log(''+data);
  });

  sel.on('error', function (data) {
    console.log('');
    if(data.code==='ENOENT'){
      console.log('ERROR, Executable does not exist:');
      console.log(data.path);
    } else {
      console.log('spawn error: ', JSON.stringify(data, null, 2));
    }
    console.log('');
  });

  sel.stderr.on('data', function (data) {
    console.log('sel.stderr.data: ' + data);
  });

  sel.stderr.on('error', function (data) {
    console.log('sel.stderr.error: ' + data);
  });

  sel.on('exit', function (code) {
    if(code===0){
      runNightwatchTests();
    } else {
      console.log('Error installing selenium: ' + code);
    }
  });
}
