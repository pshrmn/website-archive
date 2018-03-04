module.exports = {
    UserCount: function(count, expected) {
        this.count = count;
        this.expected = expected;
        this.name = "UserCountException";
        this.toString = function() {
            return "expected " + this.expected + " players, got " + this.count;
        }
    }
};