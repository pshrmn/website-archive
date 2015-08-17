module.exports = {
    index: function(req, res) {
        console.log(req.query);
        res.sendFile(__dirname + "/templates/index.html");
    }
};
