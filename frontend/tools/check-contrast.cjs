const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const walk = (dir) => {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results.push(...walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      // skip scanning our tooling folder
      if (file.includes(`${path.sep}tools${path.sep}`)) return;
      results.push(file);
    }
  });
  return results;
};

const patterns = [
  { regex: /bg-input\s+text-card-foreground|bg-white\s+text-card-foreground/, message: 'Inputs with bg-input/bg-white and text-card-foreground (should use input-scout bg-white text-gray-900 or collapse to CSS rule)' },
  { regex: /placeholder:text-muted-foreground/, message: 'Placeholder uses muted foreground; this can be low contrast on white' }
];

let hasProblems = false;
const files = walk(root);
files.forEach((f) => {
  const contents = fs.readFileSync(f, 'utf8');
  patterns.forEach((p) => {
    if (p.regex.test(contents)) {
      console.log(`Found pattern in ${path.relative(root, f)}: ${p.message}`);
      hasProblems = true;
    }
  });
});

if (hasProblems) {
  console.log('\nContrast checks found potential issues.');
  process.exit(1);
} else {
  console.log('Contrast checks look clean.');
  process.exit(0);
}
