function notFound(req, res){
    res.status(404).send('Service does not exist !');
}

module.exports = notFound;