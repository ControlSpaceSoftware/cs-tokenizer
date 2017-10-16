# cs-tokenizer
string character tokenizer

Define a reduce function that evaluates each character in a string and returns a token.

## Usage

```
        // define the reduce function
		const tokenizer = new Tokenizer((c, state, i, chars) => {
			let scheme;
			switch (c) {
				case ':':
					if (chars[i + 1] === '/' && chars[i + 2] === '/') {
						scheme = state.literal.join('');
						state.literal.length = 0;
						return {type: 'scheme', value: scheme}
					}
					break;
				case '?':
					return {type: 'query', value: '?'};
				case '#':
					return {type: 'hash', value: '#'};
			}
		});
		// generate tokens from a string
		const text = 'http://www.io/foo/bar?q=1&z=2#fragment';
		const result = tokenizer.tokenize(text);
		expect(result).to.eql([
			{type: 'scheme', value: 'http'},
			{type: 'literal', value: '//www.io/foo/bar'},
			{type: 'query', value: '?'},
			{type: 'literal', value: 'q=1&z=2'},
			{type: 'hash', value: '#'},
			{type: 'literal', value: 'fragment'}
		]);
```