# Mocha Cakes 2

Mocha Cakes is a [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin)/[Cucumber](https://cucumber.io/) syntax integration for the [Mocha](https://mochajs.org/) testing framework.

[![CI](https://github.com/BonnierNews/mocha-cakes-2/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/BonnierNews/mocha-cakes-2/actions/workflows/ci.yml)
[![Sponsored](https://img.shields.io/badge/chilicorn-sponsored-brightgreen.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAMAAADjyg5GAAABqlBMVEUAAAAzmTM3pEn%2FSTGhVSY4ZD43STdOXk5lSGAyhz41iz8xkz2HUCWFFhTFFRUzZDvbIB00Zzoyfj9zlHY0ZzmMfY0ydT0zjj92l3qjeR3dNSkoZp4ykEAzjT8ylUBlgj0yiT0ymECkwKjWqAyjuqcghpUykD%2BUQCKoQyAHb%2BgylkAyl0EynkEzmkA0mUA3mj86oUg7oUo8n0k%2FS%2Bw%2Fo0xBnE5BpU9Br0ZKo1ZLmFZOjEhesGljuzllqW50tH14aS14qm17mX9%2Bx4GAgUCEx02JySqOvpSXvI%2BYvp2orqmpzeGrQh%2Bsr6yssa2ttK6v0bKxMBy01bm4zLu5yry7yb29x77BzMPCxsLEzMXFxsXGx8fI3PLJ08vKysrKy8rL2s3MzczOH8LR0dHW19bX19fZ2dna2trc3Nzd3d3d3t3f39%2FgtZTg4ODi4uLj4%2BPlGxLl5eXm5ubnRzPn5%2Bfo6Ojp6enqfmzq6urr6%2Bvt7e3t7u3uDwvugwbu7u7v6Obv8fDz8%2FP09PT2igP29vb4%2BPj6y376%2Bu%2F7%2Bfv9%2Ff39%2Fv3%2BkAH%2FAwf%2FtwD%2F9wCyh1KfAAAAKXRSTlMABQ4VGykqLjVCTVNgdXuHj5Kaq62vt77ExNPX2%2Bju8vX6%2Bvr7%2FP7%2B%2FiiUMfUAAADTSURBVAjXBcFRTsIwHAfgX%2FtvOyjdYDUsRkFjTIwkPvjiOTyX9%2FAIJt7BF570BopEdHOOstHS%2BX0s439RGwnfuB5gSFOZAgDqjQOBivtGkCc7j%2B2e8XNzefWSu%2BsZUD1QfoTq0y6mZsUSvIkRoGYnHu6Yc63pDCjiSNE2kYLdCUAWVmK4zsxzO%2BQQFxNs5b479NHXopkbWX9U3PAwWAVSY%2FpZf1udQ7rfUpQ1CzurDPpwo16Ff2cMWjuFHX9qCV0Y0Ok4Jvh63IABUNnktl%2B6sgP%2BARIxSrT%2FMhLlAAAAAElFTkSuQmCC)](http://spiceprogram.org/oss-sponsorship)

## Installation

NPM:

```
npm install --save-dev @bonniernews/mocha-cakes-2
```

## Requirements

* Node.js 22.12 or later
* Mocha 11 or 12 (`mocha` is a peer dependency: `mocha >= 11`)

Mocha Cakes 2 is tested on Node.js 22, 24 and 26 with Mocha 11 and 12.

If you're on an older version of Node.js or Mocha, use `mocha-cakes-2@3.3.0`.

## Usage

### Enable the @bonniernews/mocha-cakes-2 integration

To enable the Mocha integration you need to specify `@bonniernews/mocha-cakes-2` in the `ui` option.

#### CLI

Either use the command line argument:

``` javascript
mocha --ui @bonniernews/mocha-cakes-2 path/to/my/tests
```

Or set it in your [Mocha configuration file](https://mochajs.org/running/configuring/), e.g. `.mocharc.json`:

``` json
{
  "ui": "@bonniernews/mocha-cakes-2"
}
```

Or `.mocharc.yml`:

``` yaml
ui: "@bonniernews/mocha-cakes-2"
```

#### API

Either pass it in the options as you construct Mocha:

``` javascript
var Mocha = require('mocha');
// Mocha 12 is an ES module, so `require()` returns its namespace object
Mocha = Mocha.default || Mocha;

var mocha = new Mocha({
  ui: '@bonniernews/mocha-cakes-2'
});
```

Or set it after you've constructed Mocha:

``` javascript
var mocha = new Mocha();
mocha.ui('@bonniernews/mocha-cakes-2')
```

### Test structure

```javascript
require('chai').should();

Feature('Some feature', () => {

  Scenario('Some Scenario', () => {

    let number = 2;

    Given('a number', () => {
      number.should.exist;
    });
    And('that number is 2', () => {
      number.should.equal(2);
    });

    When('adding 40', () => {
      number += 40;
    });

    Then('the number should be 42', () => {
      number.should.equal(42);
    });
  });
});
```

The result will look something like this:

<img src="doc/example-feature-v2.png" width="500" />

The common Mocha functions (`describe`, `it`, `before`, `after`, etc) are also available and can be used together with Mocha Cakes.

### Upgrading from mocha-cakes-2 3.x

Replace the `mocha-cakes-2` dependency with `@bonniernews/mocha-cakes-2` and change the `ui` option to `@bonniernews/mocha-cakes-2`. The old `mocha-cakes-2` ui name still works if the package is loaded with `--require @bonniernews/mocha-cakes-2`.

### Upgrading from version 1.x

Replace the `require('mocha-cakes-2')` statement(s) with the `--ui @bonniernews/mocha-cakes-2` option as described above.

### TypeScript

The TypeScript definitions are bundled together with @bonniernews/mocha-cakes-2.
To use mocha directly with TypeScript you need types for mocha and [ts-node](https://github.com/TypeStrong/ts-node).

```
npm install --save-dev typescript ts-node @types/mocha
```

You should have a `tsconfig.json` in the root of your project like so

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
  }
}
```

Now you can run it like so:

```
mocha -r ts-node/register --ui @bonniernews/mocha-cakes-2  ...
```

Your tests should look like this:

```
import '@bonniernews/mocha-cakes-2';

Feature('Some feature', () => {

  Scenario('Some Scenario', () => {

    let number = 2;

    Given('a number', () => {

    });
    And('that number is 2', () => {

    });

    When('adding 40', () => {

    });

    Then('the number should be 42', () => {

    });
  });
});
```

## API

The Mocha Cakes integration adds the following functions to the global scope:

* `Feature | feature`
  * `Scenario | scenario`
      - `Given | given`
      - `When | when`
      - `Then | then`
      - `And | and`
      - `But | but`

### `.skip`

Skips a test clause. Works on all test functions.

Mocha's `--forbid-pending` option is respected.

```javascript
Feature('Some feature', () => {

  Scenario.skip('Skipped scenario', () => {
    // ...
  });

  Scenario('Ordinary', () => {
    // ...
  });
});
```

<img src="doc/skipped-v2.png" width="400" />

### `.only`

Only run the specified test clause. Works on all test functions.

Multiple `.only` clauses are combined, just like Mocha's `describe.only` and `it.only`, and Mocha's `--forbid-only` and `--grep` options are respected.

```javascript
Feature('Some feature', () => {

  Scenario('First scenario', () => {
    // ...
  });

  Scenario('Second scenario', () => {
    // ...
  });

  Scenario.only('Only I will run!', () => {
    // ...
  });

  // ...
});
```

<img src="doc/only-v2.png" width="400" />

### `beforeEachScenario` and `afterEachScenario`

Executes the provided function only once for each of the scenarios under the current scope.

```javascript
Feature('Some feature', () => {

  beforeEachScenario( () => {
    someSetup();
  });

  afterEachScenario( () => {
    doCleanup();
  });

  Scenario('First scenario', () => {
    // ...
  });

  Scenario('Second scenario', () => {
    // ...
  });

  // ...
});
```

### `beforeEachFeature` and `afterEachFeature`

Executes the provided function only once for each of the features under the current scope.

```javascript
beforeEachFeature( () => {
  someSetup();
});

afterEachFeature( () => {
  doCleanup();
});

Feature('Some feature', () => {
  // ...
});

Feature('Another feature', () => {
  // ...
});

// ...
```

## Development

Run the tests with:

```
npm test
```

This runs the test suite twice, once using Mocha's CLI and once using Mocha's API (see below).

### Continuous integration

The tests are run by [GitHub Actions](https://github.com/BonnierNews/mocha-cakes-2/actions/workflows/ci.yml) on Node.js 22, 24 and 26 with both Mocha 11 and Mocha 12.

### Testing against Mocha 11

Mocha 12 is installed as a development dependency. To run the tests against Mocha 11 locally, install it without saving it to `package.json`:

```
npm install --no-save mocha@11 && npm test
```

Run `npm install` to go back to Mocha 12.

### Testing the CLI and API interfaces

If you use Mocha directly to run the tests you can set the `MOCHA_INTERFACE` environment variable to either `cli` or `api` to choose which Mocha interface to run the tests with. The `api` interface runs the sample tests in the same process, so it also needs `--require ./mocha-cakes.js`:

```
MOCHA_INTERFACE=cli npx mocha test/feature/tests.js
MOCHA_INTERFACE=api npx mocha --require ./mocha-cakes.js test/feature/tests.js
```

`MOCHA_INTERFACE` will default to `cli` if no value is set.

When you run `npm run test:cli` or `npm run test:api` (or `npm test` to run them both), `MOCHA_INTERFACE` is set automatically to the appropriate value.

## Acknowledgements

Mocha Cakes 2 is heavily influenced by **quangv**'s [mocha-cakes](https://github.com/quangv/mocha-cakes/).
