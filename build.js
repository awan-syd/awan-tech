var fs = require('fs');
var path = require('path');
var src = path.resolve('.');
var dst = path.join(src, 'dist');
if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true });
fs.mkdirSync(dst);
var ignore = ['node_modules', '.git', 'dist', 'functions'];
function copyDir(dir) {
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var e of entries) {
    var name = e.name;
    if (ignore.includes(name) || name.startsWith('.git')) continue;
    var s = path.join(dir, name);
    var d = path.join(dst, path.relative(src, s));
    if (e.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyDir(s);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
copyDir(src);
console.log('Build complete: copied to dist/');
