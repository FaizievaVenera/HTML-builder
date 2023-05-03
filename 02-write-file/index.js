const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const input = fs.createReadStream(path.join(__dirname,'text.txt'));
stdout.write('Start...\n')
stdin.on('data', data =>{ 
	if (data.toString().trim() === "exit") {
		exitProcess()
	}
	output.write(data.toString());
});
	
process.on("SIGINT", exitProcess);

function exitProcess(){
			stdout.write('Удачи в изучении Node.js!')
			process.exit()
			//exit();
	}