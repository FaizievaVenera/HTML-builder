const fs = require("fs");
const path = require("path");
const dirDist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const styleDir = path.join(__dirname, 'styles');
const styleDirOut = path.join(__dirname, 'project-dist', 'style.css');

fs.rm(dirDist, { recursive: true, force: true }, () => {
  fs.promises.mkdir(dirDist, { recursive: true }).then(() => {
    copyDir(path.join(__dirname, 'assets'), path.join(dirDist, 'assets'), function(err) {
      if (err) throw err;
    });
    createStyles(path.join(dirDist, 'style.css'));
    createHtml(path.join(__dirname, 'template.html'), path.join(dirDist, 'index.html'));
  });
});

function copyDir(src, dest) {
    fs.promises.mkdir(dest, { recursive: true }).then(() => {
    fs.promises.readdir(src).then((files) => {
      files.forEach(file => {
        let srcChild = path.join(src, file);
        let destChild = path.join(dest, file);
        fs.stat(srcChild, (err, stats) => {
          if (err) throw err;
          if (stats.isDirectory()) {
            copyDir(srcChild, destChild);
          } else {
            fs.createReadStream(srcChild).pipe(fs.createWriteStream(destChild));
          }
        });
      });
    });
  });
}

function createStyles() {
  fs.readdir(styleDir, { withFileTypes: true }, function(err, filenames) {
    if (err) throw err;
    const writeStream = fs.createWriteStream(styleDirOut);
    filenames.forEach(function(filename) {
      const ext = path.parse(filename.name).ext;
      if (filename.isFile() === true && ext === '.css')  {
        const readStream = fs.createReadStream(path.join(styleDir, filename.name));
        readStream.on('data', data => writeStream.write(data));
        readStream.on('error', error => console.log('Error', error.message));
      }
    });
  });  
}

function createHtml(template, index) {
  let html = '';
  let templateReadStream = fs.createReadStream(template, {encoding: 'utf8'});
  templateReadStream.on('data', chunk => {
    html = chunk.toString();
  });

  templateReadStream.on('end', () => {
    createContent(html, index);
  });
}

function createContent(html, index) {
  let objHtml = {};
  let count = 0;
  fs.promises.readdir(components).then((files) => {
    files.forEach(file => {
      let pathFile = path.join(components, file);
      let pathFileCont = file.replace(path.extname(file), '');
      objHtml[pathFileCont] = '';
      fs.createReadStream(
        path.join(pathFile))
        .on('data', (a) => {objHtml[pathFileCont] += a.toString();})
        .on('end', () => {
          count++;
          if (count >= files.length) {
            for (let i in objHtml) {
              html = html.replace('{{'+ i + '}}', objHtml[i]);
            }
            let stream = fs.createWriteStream(index, {encoding: 'utf8'});
            stream.write(html);
          }
        });
    });
  });
}