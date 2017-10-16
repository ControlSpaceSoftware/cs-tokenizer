'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tokenizeSpace = exports.tokenizeSpace = function tokenizeSpace(c) {
	// return
	//   undefined 	c is added to literal array
	//   false 		c is not added to literal array
	//   token  	token is added to token array
	switch (c) {
		case ' ':
			return { type: 'space', value: c };
		case 'end':
			return undefined;
	}
};

var Tokenizer = exports.Tokenizer = function () {
	function Tokenizer() {
		var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tokenizeSpace;

		_classCallCheck(this, Tokenizer);

		this.rules = rules;
	}

	_createClass(Tokenizer, [{
		key: 'tokenize',
		value: function tokenize(text) {
			var _this = this;

			if (typeof text !== 'string') {
				throw new TypeError('expect a string value');
			}
			var chars = text.split('').concat('end');
			var state = {
				literal: [],
				tokens: []
			};
			return chars.reduce(function (accumulator, c, i) {
				var t = _this.rules(c, accumulator, i, chars);
				if (t) {
					if (accumulator.literal.length) {
						accumulator.tokens.push({
							type: 'literal',
							value: accumulator.literal.join('')
						});
					}
					accumulator.literal.length = 0;
					accumulator.tokens = accumulator.tokens.concat(t);
				} else {
					if (c === 'end') {
						if (accumulator.literal.length) {
							accumulator.tokens.push({
								type: 'literal',
								value: accumulator.literal.join('')
							});
						}
					} else {
						if (t !== false) {
							accumulator.literal.push(c);
						}
					}
				}
				if (c === 'end') {
					return accumulator.tokens;
				}
				return accumulator;
			}, state);
		}
	}]);

	return Tokenizer;
}();