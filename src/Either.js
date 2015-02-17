var util = require('./internal/util');

function Either() {
    throw new Error('Either is not directly callable');
}

Either.prototype.map = util.returnThis;

Either.of = Either.prototype.of = function(value) { 
    return Either.Right(value); 
};

Either.prototype.chain = util.returnThis; // throw?

Either.equals = Either.prototype.equals = function(that) {
    return this.constructor === that.constructor && this.value === that.value;
};


// Right
function _Right(x) {
    this.value = x;
}
util.extend(_Right, Either);

_Right.prototype.map = function(fn) { 
    return new _Right(fn(this.value)); 
};

_Right.prototype.ap = function(that) { 
    return that.map(this.value); 
};

_Right.prototype.chain = function(f) { 
    return f(this.value); 
};

Either.Right = function(value) {
    return new _Right(value);
};


// Left
function _Left(x) {
    this.value = x;
}
util.extend(_Left, Either);

_Left.prototype.ap = function(that) { return that; };

Either.Left = function(value) {
    return new _Left(value);
};


Either.fromNullable = function(left, right) {
    switch (arguments.length) {
        case 0:
            throw new TypeError('no arguments to Either.fromNullable');
        case 1:
            return function(right) {
                return right == null ? Either.Left(left) : Either.Right(right);
            };
        default:
            return right == null ? Either.Left(left) : Either.Right(right);
    }
}

module.exports = Either;