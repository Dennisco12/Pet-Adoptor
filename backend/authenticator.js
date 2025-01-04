const storage = require("./models/engine/database");

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'PetHaven') {
        return res.status(401).json({ error: 'Invalid Authorization format' });
    }

    const sessionToken = parts[1];

	const user = isValidToken(sessionToken)

	if (!user) {
		return res.status(403).json({ error: 'Invalid session token' });
    }

    req.currentUser = user;

    next();
};

const isValidToken = (token) => {
	const user = storage.get('Owner', token)
	if (!user) return null;
	return user
};

module.exports = authenticate
