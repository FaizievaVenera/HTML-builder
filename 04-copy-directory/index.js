
const fs = require('fs');
const path = require('path');

copyDir(path.join(__dirname,'/files'),path.join(__dirname,'/files-copy/'))


async function copyDir(src, dest){
    await fs.promises.rm(dest, {force: true, recursive: true});
    await fs.promises.mkdir(dest,{recursive: true})
    await fs.promises.readdir(src)
	.then(filenames => {
	for (let filename of filenames) {
			fs.stat(path.join(src, filename), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
      fs.promises.copyFile(path.join(src, filename), path.join(dest, filename));
      }
      else if (stats.isDirectory()){
        copyDir(path.join(src, filename), path.join(dest, filename));
      }
	})
}
})
}
