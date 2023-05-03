const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname,'secret-folder')
fs.promises.readdir(path.join(__dirname,'secret-folder'))
	.then(filenames => {
	for (let filename of filenames) {
			fs.stat(path.join(folder, filename), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) 
			console.log(`${filename} - ${(path.extname(filename)).slice(1)} - ${Number(stats.size / 1024).toFixed(2)}kb`)
	})
}
})