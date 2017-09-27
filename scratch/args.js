#!/usr/bin/env node

console.log(process.argv0);
console.log(process.argv);

function lowercase(x) {
  return x.toLowerCase();
}
lowercaseArgs = process.argv.map(lowercase);
if (lowercaseArgs.includes('--mock')) {
  console.log('Mock model, view');
}
