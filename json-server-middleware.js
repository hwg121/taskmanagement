module.exports = (req, res, next) => {
    // Enable CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Log request
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Continue to JSON Server router
    next();
}
