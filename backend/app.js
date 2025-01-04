const express = require("express");
const cors = require("cors")
const storage = require('./models/engine/database');
const authenticate = require("./authenticator");
const Pet = require('./models/pet');
const Owner = require('./models/owner');

const app = express()
const port = 8000
const hostname = "127.0.0.1"

app.use(express.json());
app.use(cors());


app.get('/pets', (req, res) => {
	const pets = storage.all('Pet').values();
	let allPets = [];
	for (var pet of pets) {
		allPets.push(pet.toDict());
	}
	res.status(200).json(allPets)
})

app.get('/pet/:id', (req, res) => {
	const { id } = req.params;
	const pet = storage.get('Pet', id)
	if (!pet) {
		res.status(404).json(`Pet with id ${id} does not exist`)
		return
	}
	res.status(200).json(pet.toDict());
})

app.post('/pet', authenticate, (req, res) => {
	const data = req.body
	if ('ownerId' in data) {
		const owner = storage.get('Owner', data.ownerId)
		if (!owner) {
			res.status(400).json(`No owner found with ${data.ownerId}`)
		}
		delete data.ownerId
		data.owner = owner.toDict()
	}
	try {
		const model = new Pet(data)
		model.save()
		res.status(201).json(model.toDict())
	} catch (error) {
		res.status(400).json(`Error: ${error}`)
	}
})

app.put('/pet/:id', authenticate, (req, res) => {
	const { id } = req.params;
	const pet = storage.get('Pet', id)
	if (!pet) {
		res.status(404).json(`Error: pet with id ${id} does not exist`)
		return
	}
	let data = req.body
	if ('ownerId' in data) {
		const owner = storage.get('Owner', data.ownerId);
		if (!owner) {
			res.status(404).json(`Owner with id ${data.ownerId} does not exist`)
			return
		}
		data.owner = owner.toDict()
		delete data.ownerId
	}
	for (var attr in data) {
		pet[attr] = data[attr]
	}
	pet.save();
	res.status(200).json(pet.toDict());
})

app.delete('/pet/:id', authenticate, (req, res) => {
	const { id } = req.params
	const pet = storage.get('Pet', id);
	if (!pet) {
		res.status(404).json(`Pet with id ${id} does not exist`)
		return
	}
	pet.delete()
	res.status(204).json({})
})

app.post('/pet/search', (req, res) => {
	const searchTerms = req.body
	const allPets = storage.all('Pet');
	let searchResult = []

	for (var key in allPets) {
		let flag = true
		for (var k in searchTerms) {
			if (allPets[key] != searchTerm[k]) {
				flag = false
			}
		}
		searchResult.push(allPets[key].toDict())
	}
	res.status(200).json(searchResult);
})

app.post('/owner', (req, res) => {
	const data = req.body
	try {
		const model = new Owner(data);
		model.save()
		res.status(201).json(model.toDict())
	} catch (error) {
		res.status(400).json(`Error: ${error}`)
	}
})

app.put('/owner/:id', authenticate, (req, res) => {
	const { id } = req.params
	const owner = storage.get('Owner', id)
	if (!owner) {
		res.status(404).json(`Owner with id ${id} does not exist`)
		return
	}
	data = req.body
	for (var attr in data) {
		owner[attr] = data[attr]
	}
	owner.save();
	res.status(200).json(owner.toDict());
})

app.delete('/owner/:id', authenticate, (req, res) => {
	const { id } = req.params
	if (id != authenticate.currentUser.id) {
		res.status(403).json("You are forbidden from deleting other owners")
	}
	const owner = storage.get('Owner', id)
	if (!owner) {
		res.status(404).json(`Owner with id ${id} does not exist`)
		return
	}
	owner.delete()
	res.status(204).json({});
})


app.listen(port, hostname, () => console.log(`Service started on port ${port}`));
