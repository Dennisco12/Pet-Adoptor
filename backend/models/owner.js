const BaseModel = require("./baseModel");

class Owner extends BaseModel {
	constructor (data) {
		if (!("phoneNumber" in data)) {
			throw new Error("You must include your coutact number")
		}
		super(data);
	}

	get name() {
		return this._name
	}
	set name(value) {
		if (!value.trim()) {
			throw new Error("Please include a valid name");
		}
		this._name = value
	}
}

module.exports = Owner
