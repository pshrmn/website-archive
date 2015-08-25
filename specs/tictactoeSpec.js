var TicTacToe = require("../games/tictactoe");
var exceptions = require("../games/exceptions");
var Player = require("../utils/player");
var sinon = require("sinon");

describe("TicTacToe", function() {
    describe("constructor", function() {
        var one = new Player("one", {id:1});
        var two = new Player("two", {id:2});
        var game = new TicTacToe([one, two]);

        it("sets the first player to be the current player", function() {
            expect(game.current).to.equal(one);
        })

        it("throws an error if players.length is not 2", function() {
            assert.throws(function(){
                var game = new TicTacToe([one]);
            }, exceptions.UserCount, "expected 2 players, got 1");
            var three = new Player("three", {id:3});
            assert.throws(function(){
                var game = new TicTacToe([one, two, three]);
            }, exceptions.UserCount, "expected 2 players, got 3");
        });
    });
});