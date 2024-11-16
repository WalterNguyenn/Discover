// middleware/ensureAuthenticated.js


module.exports = function ensureAuthenticated(req, res, next) {
    // Check if the user is authenticated by using Passport's isAuthenticated method
    if (req.isAuthenticated()) {
      // If the user is authenticated, proceed to the next middleware or route handler
      return next();
    }
 
    // If the user is not authenticated, send a 401 Unauthorized response
    res.status(401).json({ message: 'You need to be authenticated to access this resource' });
  };
 
