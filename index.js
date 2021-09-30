const fs = require('fs');
const pfs = fs.promises;
const path = require('path');

const TARGETS_FOLDER = path.join(process.cwd(), 'targets');

const getTmpName = (name) => `tmp.${name}`;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const prepFilesForRandomizing = async (fileNames) => {
	await Promise.all(fileNames.map(async (fileName) => {
		await pfs.rename(
			path.join(TARGETS_FOLDER, fileName),
			path.join(TARGETS_FOLDER, getTmpName(fileName)),
		);
	}))
}

const randomizeFiles = async (swapMap) => {
	console.log('Randomizing files');
	await Promise.all(swapMap.map(async ({ from, to }) => {
		await pfs.rename(
			path.join(TARGETS_FOLDER, getTmpName(from)),
			path.join(TARGETS_FOLDER, to),
		)
	}));
}

const init = async () => {
	console.log('Starting..');

	if (!fs.existsSync(TARGETS_FOLDER)) {
		console.log(`Could not find targets folder [${TARGETS_FOLDER}]`);
		console.log('Creating folder..');

		await pfs.mkdir(TARGETS_FOLDER);

		await wait(1000);

		console.log(`Add files to shuffle inside the targets folder [${TARGETS_FOLDER}]`);

		await wait(10000);

		return;
	}

	await wait(1000);
	
	console.log(`Reading directory: ${TARGETS_FOLDER}`);
	const fileNames = await pfs.readdir(TARGETS_FOLDER);

	await wait(1000);

	console.log('Files found in directory: ', fileNames.join(', '));

	await wait(1000);
	
	const randomizedFileNames = [...fileNames].sort(() => Math.random() > 0.5 ? 1 : -1);
	
	const fileNameSwapMap = fileNames.map((fileName, i) => {
		return {
			from: fileName,
			to: randomizedFileNames[i],
		};
	}).sort((a, b) => {
		return a.to === b.from ? -1 : 1;
	});

	await wait(1000);
	
	await prepFilesForRandomizing(fileNames);

	await wait(1000);
	
	await randomizeFiles(fileNameSwapMap);

	await wait(1000);

	console.log('Done.');

	await wait(10000);
}

init();