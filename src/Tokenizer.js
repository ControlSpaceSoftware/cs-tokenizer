
export const tokenizeSpace = (c) => {
	// return
	//   undefined 	c is added to literal array
	//   false 		c is not added to literal array
	//   token  	token is added to token array
	switch (c) {
		case ' ':
			return {type: 'space', value: c};
		case 'end':
			return undefined;
	}
};

export class Tokenizer {

	constructor(rules = tokenizeSpace) {
		this.rules = rules;
	}

	tokenize(text) {
		if (typeof text !== 'string') {
			throw new TypeError('expect a string value');
		}
		const chars = text.split('').concat('end');
		const state = {
			literal: [],
			tokens: []
		};
		return chars.reduce((accumulator, c, i) => {
			const t = this.rules(c, accumulator, i, chars);
			if (t) {
				if (accumulator.literal.length) {
					accumulator.tokens.push(
						{
							type: 'literal',
							value: accumulator.literal.join('')
						});
				}
				accumulator.literal.length = 0;
				accumulator.tokens = accumulator.tokens.concat(t)
			} else {
				if (c === 'end') {
					if (accumulator.literal.length) {
						accumulator.tokens.push(
							{
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

}
