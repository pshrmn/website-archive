var TicTacToe = require("../server/games/tictactoe");
var exceptions = require("../server/games/exceptions");
var Player = require("../server/utils/player");
var sinon = require("sinon");

describe("TicTacToe", function() {
    describe("constructor", function() {
        var one = new Player("one", {id:1});
        var two = new Player("two", {id:2});
        var game = new TicTacToe.game([one, two]);

        it("throws an error if players.length is not 2", function() {
            assert.throws(function(){
                var game = new TicTacToe.game([one]);
            }, exceptions.UserCount, "expected 2 players, got 1");
            var three = new Player("three", {id:3});
            assert.throws(function(){
                var game = new TicTacToe.game([one, two, three]);
            }, exceptions.UserCount, "expected 2 players, got 3");
        });
    });
});