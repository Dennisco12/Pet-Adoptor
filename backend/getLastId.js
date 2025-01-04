const fs = require('fs');

const getLastId = () => {
	const filePath = 'lastId.json';
	let lastId = 0
	if (fs.existsSync(filePath)) {
		lastId = fs.readFileSync(filePath, 'utf-8')
	} else {
		lastId = 0
	}
	const updatedId = parseInt(lastId) + 1;
	fs.writeFileSync(filePath, updatedId.toString(), null, 2);
	return lastId
}

module.exports = getLastId;
