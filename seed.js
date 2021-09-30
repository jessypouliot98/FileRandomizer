const fs = require('fs');
const pfs = fs.promises;
const fsExtra = require('fs-extra');
const path = require('path');

const TARGETS_FOLDER = path.join(__dirname, 'targets');
const FILES = ['abc.wav', 'buzzfal1.wav', 'dog.wav', 'buzvbuz.wav'];

const clear = async () => {
	await fsExtra.emptyDirSync(TARGETS_FOLDER);
}

const seed = async () => {
	await Promise.all(FILES.map(async (fileName) => {
		await pfs.writeFile(
			path.join(TARGETS_FOLDER, fileName),
			fileName,
		);
	}))
}

const init = async () => {
	await clear();
	await seed();
}

init();