
const fs = require('fs');
const path = require('path');
const fileDist = path.join(__dirname, 'project-dist')
const filePath = path.join(__dirname, 'styles')

fs.open(path.join(fileDist, 'bundle.css'), 'w', (err) => {
    if(err) throw err;
});
fs.promises.readdir(filePath)
	.then(filenames => {
	for (let filename of filenames) {
	fs.stat(path.join(filePath, filename), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()&& (path.extname(filename)).slice(1) =='css') {
        const stream = fs.createReadStream(path.join(filePath,filename),'utf-8');
        stream.on('data', (chunk) => {
            fs.appendFile(path.join(fileDist, 'bundle.css'),
                chunk.toString(),
                err => {
                    if (err) throw err;
                })
})
      }}
        );      }

	})
