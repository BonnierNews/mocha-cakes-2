'use strict';

var helpers = require('./../helpers');
var execTestFile = helpers.execTestFile;
var expectFailure = helpers.expectFailure;
var ok = helpers.ok;

describe('Mocha Cakes', function () {

  describe('A basic feature test', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/simple-feature-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should have the correct `Feature` title', function () {
      output.should.contain('Feature: Mocha Cakes');
    });

    it('should have the correct `Scenario` title', function () {
      output.should.contain('Scenario: Testing mocha cakes');
    });

    it('should have the correct `Given` clause', function () {
      output.should.contain(ok + ' Given that 1 + 1 is 2');
    });

    it('should have the correct `And` clause', function () {
      output.should.contain(ok + ' And 2 + 2 is 4');
    });

    it('should have the correct `But` clause', function () {
      output.should.contain(ok + ' But 2 + 3 is not 4');
    });

    it('should have the correct `When` clause', function () {
      output.should.contain(ok + ' When something is true');
    });

    it('should have the correct `Then` clause', function () {
      output.should.contain(ok + ' Then everything should be ok');
    });
  });

  describe('A feature test with skipped scenario', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/skipped-tests.js')
        .then(function (result) {
          output = result;
        });
    });

    it("should have 6 pending tests", function () {
      output.should.contain('4 passing');
      output.should.contain('6 pending');
    });

    it("should skip all tests in a skipped Scenario", function () {
      output.should.contain('- Given test 1');
      output.should.contain('- And test 2');
      output.should.contain('- But test 3');
      output.should.contain('- When test 4');
      output.should.contain('- Then test 5');
    });

    it("should be able to skip individual tests", function () {
      output.should.contain('- But test 8');
    });
  });

  describe('A feature test with exclusive Scenario', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/scenario-with-only-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it("should only run the specified scenario", function () {
      var expected = [
        'Feature: Mocha Cakes',
        'Scenario: Exclusive Scenario',
        ok + ' Given test 1',
        ok + ' And test 2',
        ok + ' But test 3',
        ok + ' When test 4',
        ok + ' Then test 5'
      ];
      const formatted = output.trim().split('\n').map(function (s) {
        return s.trim();
      }).slice(0, 7);

      formatted.should.eql(expected);
      output.should.contain('5 passing');
    });
  });

  describe('A feature test with exclusive test', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/single-only-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should only run the specified test', function () {
      output.should.contain('Feature: Mocha Cakes');
      output.should.contain('Scenario: Exclusive test');
      output.should.contain(ok + ' Given test 1');
      output.should.contain('1 passing');
    });
  });

  describe('A Scenario with `before` and `after` clauses', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/before-and-after-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should execute the before clause before the first test clause', function () {
      output.should.contain('before clause');

      var scenarioIndex = output.indexOf('Scenario:');
      var beforeIndex = output.indexOf('before clause');
      var firstTestClauseIndex = output.indexOf('Given');

      scenarioIndex.should.be.below(beforeIndex);
      beforeIndex.should.be.below(firstTestClauseIndex);
    });

    it('should execute the after clause after the final test clause', function () {
      output.should.contain('after clause');

      var finalTestClauseIndex = output.indexOf('Then');
      var afterIndex = output.indexOf('after clause');

      finalTestClauseIndex.should.be.below(afterIndex);
    });
  });

  describe("A Scenario with beforeEach and afterEach clauses", function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/beforeEach-and-afterEach-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should execute the beforeEach clause before each test clause', function () {
      var pattern = /beforeEach clause/g;

      output.match(pattern).length.should.equal(5);

      var testClauses = output.split(pattern);
      testClauses[0].should.contain('Scenario:');
      testClauses[1].should.contain('Given');
      testClauses[2].should.contain('And');
      testClauses[3].should.contain('But');
      testClauses[4].should.contain('When');
      testClauses[5].should.contain('Then');
    });

    it('should execute the afterEach clause after the final test clause', function () {
      var pattern = /afterEach clause/g;

      output.match(pattern).length.should.equal(5);

      var testClauses = output.split(pattern);
      testClauses[0].should.contain('Given');
      testClauses[1].should.contain('And');
      testClauses[2].should.contain('But');
      testClauses[3].should.contain('When');
      testClauses[4].should.contain('Then');
    });
  });

  describe("A test file with Hooks per type", function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/hooks-per-type-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should execute the beforeEachFeature clause before each feature', function () {
      output.match(/Global beforeEachFeature/g).length.should.equal(2);
    });

    it('should execute the afterEachFeature clause after each feature', function () {
      output.match(/Global afterEachFeature/g).length.should.equal(2);
    });

    it('should not execute the beforeEachFeature clause in absence of nested Features', function () {
      output.should.not.match(/Feature internal beforeEachFeature/g);
    });

    it('should not execute the afterEachFeature clause in absence of nested Features', function () {
      output.should.not.match(/Feature internal beforeEachFeature/g);
    });

    it('should execute the beforeEachScenario clause before each scenario', function () {
      output.match(/Global beforeEachScenario/g).length.should.equal(3);
    });

    it('should execute the afterEachScenario clause after each scenario', function () {
      output.match(/Global afterEachScenario/g).length.should.equal(3);
    });

    it('should execute the beforeEachScenario clause on nested scenarios', function () {
      output.match(/Feature internal beforeEachScenario/g).length.should.equal(2);
    });

    it('should execute the afterEachScenario clause on nested scenario', function () {
      output.match(/Feature internal afterEachScenario/g).length.should.equal(2);
    });

    it('should not execute the beforeEachScenario clause in absence of nested Scenarios', function () {
      output.should.not.match(/Feature internal beforeEachFeature/g);
    });

    it('should not execute the afterEachFeature clause in absence of nested Features', function () {
      output.should.not.match(/Feature internal beforeEachFeature/g);
    });
  });

  describe('Lower-case aliases', function () {
    var output;

    before(function () {
      return execTestFile('feature/sample-tests/lower-case-aliases.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should have the correct `feature` title', function () {
      output.should.contain('Feature: Mocha Cakes');
    });

    it('should have the correct `scenario` title', function () {
      output.should.contain('Scenario: Testing mocha cakes');
    });

    it('should have the correct `given` clause', function () {
      output.should.contain(ok + ' Given that 1 + 1 is 2');
    });

    it('should have the correct `and` clause', function () {
      output.should.contain(ok + ' And 2 + 2 is 4');
    });

    it('should have the correct `but` clause', function () {
      output.should.contain(ok + ' But 2 + 3 is not 4');
    });

    it('should have the correct `when` clause', function () {
      output.should.contain(ok + ' When something is true');
    });

    it('should have the correct `then` clause', function () {
      output.should.contain(ok + ' Then everything should be ok');
    });
  });

  describe('A describe and it test', function () {
    var output;

    before(function () {
      return execTestFile('feature/sample-tests/describe-and-it-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should work', function () {
      output.should.contain(ok + ' should work');
    });

    it('should also work', function () {
      output.should.contain(ok + ' should also work');
    });

    it('should always work', function () {
      output.should.contain(ok + ' should always work');
    });

    it('should execute the outer before clause', function () {
      output.match(/outer before executed/g).length.should.equal(1);
    });

    it('should execute the outer before each clause', function () {
      output.match(/outer before each executed/g).length.should.equal(3);
    });

    it('should execute the outer after clause', function () {
      output.match(/outer after executed/g).length.should.equal(1);
    });

    it('should execute the outer after each clause', function () {
      output.match(/outer after each executed/g).length.should.equal(3);
    });

    it('should execute the inner before clause', function () {
      output.match(/inner before executed/g).length.should.equal(1);
    });

    it('should execute the inner before each clause', function () {
      output.match(/inner before each executed/g).length.should.equal(2);
    });

    it('should execute the inner after clause', function () {
      output.match(/inner after executed/g).length.should.equal(1);
    });

    it('should execute the inner after each clause', function () {
      output.match(/inner after each executed/g).length.should.equal(2);
    });
  });

  describe('A feature test with multiple exclusive Scenarios and steps', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/multiple-only-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should run all the exclusive scenarios and steps', function () {
      output.should.contain(ok + ' Given step A');
      output.should.contain(ok + ' Given step C');
      output.should.contain(ok + ' Given step D');
      output.should.contain(ok + ' Then step F');
      output.should.contain('4 passing');
      output.should.not.contain('failing');
    });

    it('should not run anything else', function () {
      output.should.not.contain('step B');
      output.should.not.contain('step E');
      output.should.not.contain('step G');
      output.should.not.contain('Unrelated feature');
    });

    it('should execute the beforeEachScenario clause for each exclusive scenario', function () {
      output.match(/beforeEachScenario hook/g).length.should.equal(3);
    });
  });

  describe('A feature test with exclusive Scenario and --forbid-only', function () {

    var error;

    before(function () {
      return expectFailure(execTestFile('feature/sample-tests/scenario-with-only-test.js', { forbidOnly: true }))
        .then(function (err) {
          error = err;
        });
    });

    it('should fail because of the exclusive Scenario', function () {
      error.message.should.contain('`.only` forbidden by --forbid-only');
    });
  });

  describe('A feature test with exclusive test and --forbid-only', function () {

    var error;

    before(function () {
      return expectFailure(execTestFile('feature/sample-tests/single-only-test.js', { forbidOnly: true }))
        .then(function (err) {
          error = err;
        });
    });

    it('should fail because of the exclusive test', function () {
      error.message.should.contain('`.only` forbidden by --forbid-only');
    });
  });

  describe('A feature test with exclusive Scenario and --grep', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/scenario-with-only-test.js', { grep: 'test 2' })
        .then(function (result) {
          output = result;
        });
    });

    it('should only run the tests matching both `.only` and --grep', function () {
      output.should.contain(ok + ' And test 2');
      output.should.not.contain('Given test 1');
      output.should.contain('1 passing');
    });
  });

  describe('A feature test with skipped scenario and --forbid-pending', function () {

    var error;

    before(function () {
      return expectFailure(execTestFile('feature/sample-tests/skipped-tests.js', { forbidPending: true }))
        .then(function (err) {
          error = err;
        });
    });

    it('should fail because of the skipped Scenario', function () {
      error.message.should.contain('Pending test forbidden');
    });
  });

  describe('A feature test with skipped test and --forbid-pending', function () {

    var error;

    before(function () {
      return expectFailure(execTestFile('feature/sample-tests/skipped-step-test.js', { forbidPending: true }))
        .then(function (err) {
          error = err;
        });
    });

    it('should fail the skipped test', function () {
      error.stdout.should.contain('Pending test forbidden');
      error.stdout.should.contain('1 failing');
    });
  });

  describe('A skipped Feature with nested Scenarios', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/nested-skip-test.js')
        .then(function (result) {
          output = result;
        });
    });

    it('should skip all tests in nested Scenarios', function () {
      output.should.contain('- Given nested step');
      output.should.contain('- Then another nested step');
      output.should.contain('2 pending');
    });

    it('should run the tests outside of the skipped Feature', function () {
      output.should.contain(ok + ' Given active step');
      output.should.contain('1 passing');
      output.should.not.contain('failing');
    });

    it('should not execute the hooks of the skipped Feature', function () {
      output.should.not.contain('before hook in skipped feature');
      output.match(/beforeEachScenario hook/g).length.should.equal(1);
    });
  });

  describe('A feature test in an ES module', function () {

    var output;

    before(function () {
      return execTestFile('feature/sample-tests/esm-feature-test.mjs')
        .then(function (result) {
          output = result;
        });
    });

    it('should run the tests', function () {
      output.should.contain('Feature: ES module');
      output.should.contain(ok + ' Given a step defined in an .mjs file');
      output.should.contain('1 passing');
    });
  });
});
