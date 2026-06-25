const fs = require('fs');
const path = require('path');

const MAX_DEPTH = 8;
const INDENT = '│   ';

function printTree(dirPath, prefix = '', depth = 0) {
  if (depth > MAX_DEPTH) return;

  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(entry => !entry.name.startsWith('.') && entry.name !== 'node_modules');
    // ❌ no sort — preserve filesystem order
  } catch (err) {
    return;
  }

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    console.log(prefix + connector + entry.name);

    if (entry.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : INDENT);
      printTree(path.join(dirPath, entry.name), newPrefix, depth + 1);
    }
  });
}

console.log('.');
printTree(process.cwd(), '', 1);
