const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('server');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const target = "const SESSIONS_DIR = path.resolve(process.cwd(), 'sessions');";
  const replacement = "const SESSIONS_DIR = process.env.APP_DATA_PATH ? path.join(process.env.APP_DATA_PATH, 'sessions') : path.resolve(process.cwd(), 'sessions');";
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
