module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // Important: Instead of writeing "(err) => next(err)" we can write only the function name "next" because in js the function will get called automatically with the parameter the callback function receives.
    };
};
