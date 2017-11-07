import BloomFilterFactory from './lib/factory';

export default class NBP {
	constructor(wordlist = "mostcommon_10000") {
		var fs = require('fs');

		var wordlistSplit = wordlist.split("_"),
			wordlistLength = wordlistSplit[wordlistSplit.length - 1],
			bloomContent = fs.readFileSync(`collections/${wordlist}`, 'utf8');

		bloom = BloomFilterFactory.inflateFromUTF16(bloomContent, wordlistLength);
	}

	isCommonPassword(password) {
		if (password == "") {
			return false;
		}

		return this.bloom.checkEntry(password) || this.bloom.checkEntry(password.toLowerCase());
	}
}
