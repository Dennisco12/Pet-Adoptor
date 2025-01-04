const fs = require('fs');
const Pet = require('../pet');
const Owner = require('../owner');

const classes = {'Pet': Pet, 'Owner': Owner}

class DataBase {
	#allObjs = {}
	filePath = './.db.json';
	idCount = 1;

	constructor() {
		this.reload()
	}

	all (cls=null) {
		let objs = []
		for (var key in this.#allObjs) {
			if (cls === null || key.includes(cls)) {
				objs.push(this.#allObjs[key]);
			}
		}
		return objs
	}

	reload () {
		if (fs.existsSync(this.filePath)) {
			try {
				const content = fs.readFileSync(this.filePath, 'utf-8')
				const dicts = JSON.parse(content);
				for (var key in dicts) {
					const model = new classes[dicts[key]['__class__']](dicts[key])
					this.#allObjs[key] = model
				}
			} catch (error) {
				console.error('Error parsing content', error);
			}
		} else {
			console.log('Database file not found')
			fs.writeFileSync(this.filePath, '{}', 'utf-8')
		}
	}

	newModel (model) {
		const key = `${model.constructor.name}.${model.id}`
		this.#allObjs[key] = model
	}

	save () {
		let newContent = {}
		for (var id in this.#allObjs) {
			newContent[id] = this.#allObjs[id].toDict();
		}
		fs.writeFileSync(this.filePath, JSON.stringify(newContent), null, 2);
	}

	del (model) {
		const key = `${model.__class__}.${model.id}`
		delete this.#allObjs[key]
		this.save()
	}

	get (cls, id) {
		const key = `${cls}.${id}`
		return this.#allObjs[key]
	}
}

const storage = new DataBase();
storage.reload()
module.exports = storage
