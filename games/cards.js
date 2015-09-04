function Deck() {
  this.cards = freshDeck();
  // cards that have been dealt (and so shouldn't be shuffled/redealt)
  this.playedCards = [];
}

/*
 * Fisher Yates shuffle
 */
Deck.prototype.shuffle = function() {
  var temp;
  var rand;

  for (var i=this.cards.length-1; i > 0; i--) {
    rand = Math.floor(Math.random() * i);
    temp = this.cards[i];
    this.cards[i] = this.cards[rand];
    this.cards[rand] = temp;
  }
};

Deck.prototype.deal = function(people, cards, shuffleFirst) {
  if ( shuffleFirst ) {
    this.shuffle();
  }
  var dealCount = people * cards;
  var dealtCards = this.cards.splice(0, people*cards);
  this.playedCards = this.playedCards.concat(dealtCards);
  var hands = []
  for ( var i=0; i<people; i++ ) {
    hands.push(i);
  }
  return hands.forEach(function(index){
    var cards = [];
    for ( var pos=index; pos < dealCount; pos += people ) {
      cards.push(dealtCards[pos]);
    }
    console.log(cards);
    return cards;
  });
};

Deck.prototype.reset = function() {
  this.cards = freshDeck();
  this.playedCards = [];
}

function Card(suit, value) {
  this.suit = suit;
  this.value = value;
}

Card.prototype.toString = function() {
  return this.value + " of " + this.suit;
};

/*
 * UTILITY FUNCTIONS
 */

function freshDeck() {
  var deck = [];
  var cards = [2,3,4,5,6,7,8,9,10,"Jack","Queen","King","Ace"];
  var suits = ["Diamonds", "Hearts", "Spades", "Clubs"];
  return deck.concat.apply(deck, suits.map(function(suit){
    return cards.map(function(value) {
      return new Card(suit, value);
    });
  }));
}

module.exports = Deck;
