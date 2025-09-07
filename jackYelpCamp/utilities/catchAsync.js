//Here we define function that catches async errors
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}