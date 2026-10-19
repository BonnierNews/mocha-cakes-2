import { strict as assert } from 'node:assert';

// Top-level await only works when the file is loaded with import().
const answer = await Promise.resolve(42);

Feature('ES module', () => {

  Scenario('Loaded with import()', () => {

    Given('a step defined in an .mjs file', () => {
      assert.equal(answer, 42);
    });
  });
});
