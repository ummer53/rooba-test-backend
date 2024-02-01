const requestLogger = (req, res, next) => {
	const timestamp = new Date().toISOString();
	const method = req.method;
	const url = req.originalUrl;
	const accessToken = req.headers.authorization || 'No Access Token';

	console.log(
		`[${timestamp}] Method: ${method}, URL: ${url}, AccessToken: "${accessToken}"`
	);

	next();
};

module.exports = requestLogger;
