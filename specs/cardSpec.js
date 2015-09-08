var Card = require("../games/cards/card");

describe("Card", function() {
    describe("constructor", function() {
        it("sets the value and suit", function() {
            var combos = [
                {
                    suit: "Hearts",
                    value: 2
                }, {
                    suit: "Clubs",
                    value: 6
                }, {
                    suit: "Diamonds",
                    value: "Ace"
                }
            ];
            combos.forEach(function(vals){
                var card = new Card(vals.suit, vals.value);
                expect(card.suit).equal(vals.suit);
                expect(card.value).equal(vals.value);
            });
        });
    });

    // same, sameSuit, sameValue

    describe("same", function() {
        var c = new Card("Diamonds", "Jack");
        it("checks if the other card has the same suit and value", function() {
              var combos = [
                {
                    suit: "Diamonds",
                    value: "Jack",
                    expect: true
                }, {
                    suit: "Diamonds",
                    value: 6,
                    expect: false
                }, {
                    suit: "Hearts",
                    value: "Jack",
                    expect: false
                }, {
                    suit: "Clubs",
                    value: 8,
                    expect: false
                }
            ];
            combos.forEach(function(vals){
                var card = new Card(vals.suit, vals.value);
                expect(c.same(card)).equal(vals.expect);
            });
        });
    });

    describe("sameSuit", function() {
        var c = new Card("Diamonds", "Jack");
        it("checks if the other card has the same suit and value", function() {
              var combos = [
                {
                    suit: "Diamonds",
                    value: "Jack",
                    expect: true
                }, {
                    suit: "Diamonds",
                    value: 6,
                    expect: true
                }, {
                    suit: "Hearts",
                    value: "Jack",
                    expect: false
                }
            ];
            combos.forEach(function(vals){
                var card = new Card(vals.suit, vals.value);
                expect(c.sameSuit(card)).equal(vals.expect);
            });
        });
    });

    describe("sameValue", function() {
        var c = new Card("Diamonds", "Jack");
        it("checks if the other card has the same suit and value", function() {
              var combos = [
                {
                    suit: "Diamonds",
                    value: "Jack",
                    expect: true
                }, {
                    suit: "Diamonds",
                    value: 6,
                    expect: false
                }, {
                    suit: "Hearts",
                    value: "Jack",
                    expect: true
                }
            ];
            combos.forEach(function(vals){
                var card = new Card(vals.suit, vals.value);
                expect(c.sameValue(card)).equal(vals.expect);
            });
        });
    });
});