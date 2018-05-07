/**
 * Created by songzhongkun on 2018/5/7.
 */
const fs = require('fs');
const path = require('path');

function resolve(currentPath, space) {

  fs.readdirSync(currentPath).forEach((file) => {

    let tempPath = path.join(currentPath, file);
    let stats = fs.statSync(tempPath);

    if (stats.isDirectory()) {
      space[file] = resolve(tempPath, {});
    } else if (stats.isFile() && path.extname(file) == '.js') {
      space[path.basename(file, '.js')] = require(tempPath);
    }
  });

  return space;
}

module.exports = resolve(__dirname, {});