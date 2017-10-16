/*global describe, it, beforeEach*/

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {Tokenizer} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('Tokenizer', () => {

	let text, tokenizer;

	beforeEach(() => {
		text = 'A few good men.';
		tokenizer = new Tokenizer();
	});

	it('exits', () => {
		expect(Tokenizer).to.be.a('function');
	});

	it('default tokenize space', () => {
		const result = tokenizer.tokenize(text);
		expect(result).to.eql([
			{type: 'literal', value: 'A'},
			{type: 'space', value: ' '},
			{type: 'literal', value: 'few'},
			{type: 'space', value: ' '},
			{type: 'literal', value: 'good'},
			{type: 'space', value: ' '},
			{type: 'literal', value: 'men.'}
		]);
	});

	it('exposes accumulator, char index, and char array', () => {
		tokenizer = new Tokenizer((c, state, i, chars) => {
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
		text = 'http://www.io/foo/bar?q=1&z=2#fragment';
		const result = tokenizer.tokenize(text);
		expect(result).to.eql([
			{type: 'scheme', value: 'http'},
			{type: 'literal', value: '//www.io/foo/bar'},
			{type: 'query', value: '?'},
			{type: 'literal', value: 'q=1&z=2'},
			{type: 'hash', value: '#'},
			{type: 'literal', value: 'fragment'}
		]);
	});

	it('ignores literal collection by returning false', () => {
		tokenizer = new Tokenizer((c) => {
			switch (c) {
				case ' ':
					return false;
			}
		});
		const result = tokenizer.tokenize(text);
		expect(result).to.eql([
			{type: 'literal', value: 'Afewgoodmen.'},
		]);

	});

});
