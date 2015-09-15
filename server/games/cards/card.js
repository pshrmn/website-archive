function Card(suit, value) {
  this.suit = suit;
  this.value = value;
}

Card.prototype.toString = function() {
  return this.value + " of " + this.suit;
};

Card.prototype.same = function(card) {
    return this.value === card.value && this.suit === card.suit;
}

Card.prototype.sameSuit = function(otherCard) {
  return this.suit === otherCard.suit;
};

Card.prototype.sameValue = function(otherCard) {
  return this.value === otherCard.value;
};

module.exports = Card;
