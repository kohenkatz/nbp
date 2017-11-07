import BloomFilterFactory from './factory';

export default class NBP {
	constructor(wordlist = "mostcommon_10000", path="collections/", cache = true) {
		var wordlistSplit = wordlist.split("_"),
			wordlistLength = wordlistSplit[wordlistSplit.length - 1];

		if (typeof wordlistLength !== "number") {
			throw new Error('Provided wordlist file must match the format [list description]_[list length]');
		};

		if (path.slice(-1) !== '/') {
			path += '/';
		};

		if (typeof localStorage !== "undefined" && typeof localStorage[`NBP_${wordlist}`] !== "undefined" && cache) {
			this.bloom = BloomFilterFactory.inflateFromUTF16(localStorage[`NBP_${wordlist}`], wordlistLength);
			return;
		};

		const ajax = new XMLHttpRequest();

		ajax.onreadystatechange = function() {
			if (ajax.readyState === XMLHttpRequest.DONE) {
				if (ajax.status === 200) {

					const bloom_contents = ajax.responseText;

					if (cache) {
						localStorage[`NBP_${wordlist}`] = bloom_contents;
					};

					this.bloom = BloomFilterFactory.inflateFromUTF16(bloom_contents, wordlistLength);

					initState = true;

				} else {
					console.error(`[NBP] Error retrieving bloom contents. Error code: ${ajax.status}`);
					console.error(`[NBP] Ensure that the word list is located at ${path}${wordlist}`);
					console.error(`[NBP] Additionally, file must match the format [list description]_[list length]`);
				}
			};
		};

		ajax.open('GET', `${path}${wordlist}`, true);
		ajax.send(null);
	}

	isCommonPassword(password) {
		if (password == "") {
			return false;
		}

		return this.bloom.checkEntry(password) || this.bloom.checkEntry(password.toLowerCase());
	}
}
