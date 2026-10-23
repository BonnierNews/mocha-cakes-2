'use strict';

var util = require('util');
var path = require('path');
var execFile = util.promisify(require('child_process').execFile);
var Mocha = require('mocha'); Mocha = Mocha.default || Mocha;

var Base = Mocha.reporters.Base;

// Mocha (and the libraries it uses for colors) may emit ANSI escape codes even
// when colors are disabled, e.g. `Base.symbols.ok` is colored at load time when
// the `CI` environment variable is set, or when the parent process runs in a
// TTY while the child's output is piped. Strip them from both the output and
// the symbol so that the same assertions work in every environment.
var strip = util.stripVTControlCharacters;
var ok = strip(Base.symbols.ok);

var rootDir = path.join(__dirname, '..');
// Run the child processes with the exact same mocha copy as this process.
var mochaBin = require.resolve('mocha/bin/mocha.js');

var testEnv = Object.assign({}, process.env, { NODE_PATH: __dirname });

var defaultOpts = {
  reporter: 'spec'
};

var formatRegexp = /%[ds]/

var interfaces = {
  cli: function(file, opts) {
    opts = Object.assign({}, defaultOpts, opts);
    var args = [
      mochaBin,
      // Ignore the configuration for the outer test run, both config files and
      // the `mocha` key in package.json.
      '--no-config',
      '--no-package',
      '--require', path.join(__dirname, 'setup.js'),
      '--require', path.join(__dirname, '../mocha-cakes.js'),
      '--ui', '@bonniernews/mocha-cakes-2',
      '--reporter', opts.reporter,
      '--no-color',
      // Be explicit, so a future default of `--forbid-only` in CI doesn't
      // change the outcome of the tests.
      opts.forbidOnly ? '--forbid-only' : '--no-forbid-only'
    ];
    if (opts.forbidPending) args.push('--forbid-pending');
    if (opts.grep) args.push('--grep', opts.grep);
    args.push(path.join(__dirname, file));

    return execFile(process.execPath, args, { env: testEnv, cwd: rootDir })
      .then(function(result) {
        return strip(result.stdout);
      }, function(err) {
        err.stdout = strip(err.stdout || '');
        throw err;
      });
  },

  api: function(file, opts) {
    opts = Object.assign({}, defaultOpts, opts);

    // The set up from requiring mocha-cakes and running chai.should() in `run-api.js`
    // is inherited here so we don't need to set them up for each file we run.

    var mocha = new Mocha({
      ui: 'mocha-cakes-2',
      reporter: opts.reporter,
      // Since we're intercepting the console messages before they're formatted
      // we would get the color strings in the output, but that doesn't happen
      // in the CLI output since the colors are formatted and won't appear in the
      // strings, so we disable colors here so we don't have to strip them from
      // the output, and we can use the same test assertions with both interfaces.
      color: false,
      forbidOnly: !!opts.forbidOnly,
      forbidPending: !!opts.forbidPending,
      grep: opts.grep
    });

    mocha.addFile(path.join(__dirname, file));

    // Load the files the same way the CLI does: this supports ES modules and
    // turns errors thrown while loading (e.g. `--forbid-only`) into rejections.
    return mocha.loadFilesAsync().then(function() {
      return runLoaded(mocha);
    }, function(err) {
      // Clean up the `require` cache when loading fails too.
      mocha.unloadFiles();
      throw err;
    });
  }
}

function runLoaded(mocha) {
  return new Promise(function(resolve, reject) {
    // Override console.log() so we can get the output from the reporter.
    var logs = [];
    var originalLog = console.log;
    var originalBaseLog = Base.consoleLog;
    // Mocha.run() will store the 'useColors' option internally, outside of the
    // options we've set for this instance, so if the Mocha instance that's
    // running this has a different 'useColors' value it won't be restored.
    var previousUseColors = Base.useColors;

    function capture() {
      var args = Array.prototype.slice.call(arguments);
      if (args.length < 2) {
        logs.push(args[0] || '');
      } else {
        var str = args.reduce(function(str, arg) {
          if (formatRegexp.test(str)) {
            return str.replace(formatRegexp, arg);
          }
          return str + ' ' + arg;
        });
        logs.push(str);
      }
    }

    function restore() {
      console.log = originalLog;
      Base.consoleLog = originalBaseLog;
      Base.useColors = previousUseColors;
    }

    console.log = capture;
    // The reporters log through Base.consoleLog, a reference to the original
    // console.log() taken when mocha was loaded.
    Base.consoleLog = capture;

    try {
      mocha.run(function(failures) {
        restore();
        // Remove the files from the `require` cache, otherwise loading the same
        // file again with another Mocha instance won't register any suites, and
        // remove the `process` listeners the runner added.
        mocha.dispose();

        var output = strip(logs.join('\n'));
        if (failures > 0) {
          var err = new Error('mocha reported ' + failures + ' failure(s)');
          err.code = failures;
          err.stdout = output;
          return reject(err);
        }
        resolve(output);
      });
    } catch (err) {
      restore();
      mocha.unloadFiles();
      reject(err);
    }
  });
}

function execTestFile(file, opts) {
  var interfaceName = process.env.MOCHA_INTERFACE || 'cli';
  var func = interfaces[interfaceName];
  if (!func) {
    var actual = typeof interfaceName !== 'undefined' ? JSON.stringify(interfaceName) : 'undefined';
    var valid = Object.keys(interfaces).join(', ');
    throw new Error('The MOCHA_INTERFACE environment variable is set to ' + actual + ', valid values are: ' + valid);
  }
  return func(file, opts);
}

// Resolves with the error a mocha run was rejected with, and fails if it succeeds.
function expectFailure(promise) {
  return promise.then(function() {
    throw new Error('Expected the mocha run to fail');
  }, function(err) {
    return err;
  });
}

module.exports = {
  execTestFile: execTestFile,
  expectFailure: expectFailure,
  ok: ok
};
