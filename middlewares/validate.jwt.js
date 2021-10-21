const { request, response } = require('express');
const jwt = require( 'jsonwebtoken' );
const { leerDB } = require("../helpers/saveRecords");

const validateJWT = async ( req = request, res = response, next ) => {

	const token = req.header( 'x-token' );

	if( ! token ) 
		return res.status( 401 )
					.json({
						msg:'No existe el token'
					});

	try {
		
		const { uid } = jwt.verify( token, process.env.PRIVATEKEYJWT );

		// Leer usuario
		let db = leerDB();

		let user = db.find( e => e.email === uid );

		if( ! user )
			return res.status( 401 )
						.json({
							msg: 'Token no valido - no existe el usuario'
						});

		req.user = user;

		next();

	} // end try 
	catch (error) {

		console.log( error );
		res.status( 401 )
					.json({
						msg:'Token no valido'
					});
	} // end catch

} // end fucntion


module.exports = {
	validateJWT
}