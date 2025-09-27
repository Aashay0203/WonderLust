
// Fixed utils/error.js
module.exports = (fn) => {
    return (req, res, next) => {
        // Check if fn is actually a function
        if (typeof fn !== 'function') {
            console.error('wrapAsync called with non-function:', typeof fn);
            return next(new Error('Invalid function passed to wrapAsync'));
        }

        try {
            const result = fn(req, res, next);

            // Check if result has .catch method (is a Promise)
            if (result && typeof result.catch === 'function') {
                result.catch(next);
            }
        } catch (error) {
            next(error);
        }
    };
};