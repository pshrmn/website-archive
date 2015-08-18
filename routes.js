module.exports = {
    index: function(req, res) {
        res.sendFile(__dirname + "/views/index.html");
    },
    room: function(req, res) {
        var code = req.params.code;
        console.log(code);
        res.render("room", {
            code: code
        });
    }
};
