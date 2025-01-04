const BaseModel = require("./baseModel");

class Pet extends BaseModel {
	constructor (data) {
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

	get price() {
		return this._price
	}

	set price(value) {
		try {
			value = parseInt(value);
		} catch (error) {
			throw new Error("Price must be a number");
		}
		if (value <= 0) {
			throw new Error("Prive must be a positive value");
		}
		this._price = value;
	}
}

module.exports = Pet
