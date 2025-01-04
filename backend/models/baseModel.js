const getLastId = require('../getLastId')

class BaseModel {
	constructor(args) {
		for (var attr in args) {
			this[attr] = args[attr]
		}
		if (!(args.hasOwnProperty('id'))) {
			const newId = getLastId();
			this.id = newId;
		}
	}
	toDict () {
		let dict = {...this};
		let updatedDict = {};
		for (var key in dict) {
			if (key[0] === '_' && key != "__class__") {
				updatedDict[key.slice(1)] = dict[key]
			} else {
				updatedDict[key] = dict[key];
			}
		}
		updatedDict["__class__"] = this.constructor.name
		return updatedDict
	}
	save () {
		const storage = require('./engine/database');
		storage.newModel(this);
		storage.save()
	}
        delete () {
		const storage = require('./engine/database');
		storage.del(this)
	}
}

module.exports = BaseModel;
