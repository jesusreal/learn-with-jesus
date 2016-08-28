#!/usr/bin/env node
const yargs = require('yargs');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const argv = yargs.argv;
const basePath = __dirname + '/../..';
const nightwatchExecCommand = ['--config', `${__dirname}/nightwatch.config.json`];
const nightwatchExecPath = basePath + '/node_modules/nightwatch/bin/nightwatch';
const seleniumBasePath = basePath + '/node_modules/selenium-standalone';
const seleniumDirs = fs.readdirSync(seleniumBasePath);
const seleniumPath = seleniumBasePath + '/bin/selenium-standalone';
const testsPath = __dirname + '/tests/';
const tProvided = argv.t !== undefined;

const testFiles = (() => {
  let data = [];
  const walkSync = (currentDirPath) => {
    fs.readdirSync(currentDirPath).forEach((name) => {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if(stat.isFile() && !filePath.startsWith('.')) {
        data.push(filePath);
      } else if(stat.isDirectory()) {
        walkSync(filePath);
      }
    });
  };

  walkSync(testsPath);
  return data;
})();

const fileString = testFiles.reduce((result, f, index) => {
  const fileName = f.substr(f.lastIndexOf('/') + 1);
  return result.concat(`${index} - ${fileName}\n`);
}, '');

yargs
.usage('Usage: $0 [options]')

.alias('e', 'env')
.describe('e', 'Envs: chrome, firefox, saucelabs, noselenium or locally use chrome-open for debugging.')

.alias('t', 'test')
.describe('t', `Run single test file. (1st # or path/filename.js) \n ${fileString}`)

.alias('a', 'tag')
.describe('a', 'Run tests with specific tag')

.help('h')
.alias('h', 'help')

.check((argv) => {
  if((!tProvided && !argv.a) || (tProvided && argv.a)) {
    return 'Error: please provide either option --test or --tag.';
  }
  return true;
});


if(tProvided) {
  if(typeof argv.t === 'string') {
    argv.t = testFiles.findIndex((f) => f.includes(argv.t));
  }
  const file = testFiles[argv.t];
  if(!file) {
    console.error('Error: file could not be found, please specify a single integer or partial filepath');
    return false;
  }
  nightwatchExecCommand.push('-t', file);
} else if(argv.a) {
  nightwatchExecCommand.push('--tag', argv.a);
}


const runNightwatchTests = () => {
  const nightwatchExecCommandStr = nightwatchExecCommand.join(' ');
  console.info('Running:', nightwatchExecCommandStr
    .substring(nightwatchExecCommandStr.lastIndexOf(' -'))
    .replace(__dirname, '')
  );

  const nw = childProcess.spawn(nightwatchExecPath, nightwatchExecCommand, { cwd: basePath });

  nw.stdout.on('data', (data) => {
    console.info(data.toString().replace('\n', ''));
  });

  nw.stderr.on('data', (data) => {
      console.error('nw.stderr.data:', data);
  });

  nw.on('exit', (code) => {
    if(code === 0) {
      console.info('Nightwatch exited successfully.');
    } else {
      console.error('Nightwatch exited unsuccessfully with code:', code);
    }
    process.exit(code);
  });
};


if(seleniumDirs.includes('.selenium')) {
  runNightwatchTests();
} else {
  console.info('Selenium server not installed, running installer.');
  childProcess
    .spawn(seleniumPath, ['install', '--version=2.53.0'])
    .on('exit', (code) => {
      if(code === 0) {
        runNightwatchTests();
      } else {
        console.info('Error installing selenium. Code', code);
      }
    });
}
