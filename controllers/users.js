const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User
		.find({})
		.populate('products', {name: 1, prices: 1})
	  
	  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
	try{
		const body = request.body;	

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(body.password, saltRounds);

		const user = new User({
			name: body.name,
			username: body.username,
			email: body.email,
			passwordHash,
			products: body.products
		})
		
		const savedUser = await user.save();
		
		response.json(savedUser);

	} catch (exception) {
		next(exception)
	}

})

module.exports = usersRouter;