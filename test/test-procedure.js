const Procedure = require('../src/lib/procedure.js');
const test      = require('ava');

const rfu2Filename        = './test/fixtures/procedures/procedure.yaml';
const invalidYamlFilename = './test/fixtures/procedures/invalid.yaml';

test('default constructor works', t => {
  let p = new Procedure();
  t.false(p.isFile);
  t.false(p.isYaml);
  t.false(p.isValid);
  let status = p.validate();
  t.false(status.isValid);
  t.truthy(status.message);
});

test('can open procedure', t => {
  let p = new Procedure(rfu2Filename);
  t.true(p.isFile);
  t.true(p.isYaml);
  t.true(p.isValid);
  let status = p.validate();
  t.true(status.isValid);
  t.falsy(status.message);
});

test('can identify invalid yaml files', t => {
  let p = new Procedure(invalidYamlFilename);
  t.true(p.isFile);
  t.false(p.isYaml);
  t.false(p.isValid);
  let status = p.validate();
  t.false(status.isValid);
  t.truthy(status.message);
});

test.todo('can validate procedure');
