var fs = require('fs');
var path = require('path');
var src = path.resolve('.');
var dst = path.join(src, 'dist');
if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true });
fs.cpSync(src, dst, {
  recursive: true,
  filter: function(s) {
    return !s.includes('node_modules') && !s.includes('.git') && s !== dst;
  }
});
console.log('Build complete: copied to dist/');
