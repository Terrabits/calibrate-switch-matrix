const Procedure = require('../src/lib/procedure.js');
const test      = require('ava');

const rfu2Filename        = './test/fixtures/procedures/procedure.yaml';
const invalidYamlFilename = './test/fixtures/procedures/invalid.yaml';

test('default constructor works', t => {
  let p = new Procedure();
  t.false(p.status.isValid);
  t.truthy(p.status.message);
  t.true(p.status.message.endsWith('does not exist'));
});

test('can open procedure', t => {
  let p = new Procedure(rfu2Filename);
  t.true(p.status.isValid);
  t.falsy(p.status.message);
});

test('can identify invalid yaml files', t => {
  let p = new Procedure(invalidYamlFilename);
  t.false(p.status.isValid);
  t.truthy(p.status.message);
  let firstLine = p.status.message.split('\n')[0];
  t.true(firstLine.endsWith('is not a valid yaml file'));
});
