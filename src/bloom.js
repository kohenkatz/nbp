import LZString from './lzstring';

function calculateBitSize(num_items, probability) {
	var buffer = Math.ceil((num_items * Math.log(probability)) / Math.log(1.0 / (Math.pow(2.0, Math.log(2.0)))));

	if ((buffer % 8) !== 0) {
		buffer += 8 - (buffer % 8);
	};

	return buffer;
}

export default class BloomFilter {
	constructor({data, length, probability}) {
		if (data) {
			this.bitArrayLength = data.length * 8;
			this.hashRounds = Math.round(Math.log(2.0) * bloom.bitArrayLength / length);
			this.bitArray = new Uint8Array(data);
		} else if (typeof probability === "number" && probability > 0 && probability < 1) {
			this.bitArrayLength = calculateBitSize(length, probability);
			this.hashRounds = Math.round(Math.log(2.0) * this.bitArrayLength / length),
			this.bitArray = new Uint8Array(this.bitArrayLength / 8);
		} else {
			throw new Error("BloomFilter can be created filled from {data, length} or empty from {length, probability}.");
		}
	}

	addEntry(str) {
		var h1 = this.hashes.djb2(str);
		var h2 = this.hashes.sdbm(str);
		var added = false;

		for (var round = 0; round <= this.hashRounds; round++) {
			var new_hash = round == 0 ? h1
						 : round == 1 ? h2
						 : (h1 + (round * h2) + (round^2)) % this.bitArrayLength;

			const extra_indices = new_hash % 8;
			const index = ((new_hash - extra_indices) / 8);

			if (extra_indices != 0 && (this.bitArray[index] & (128 >> (extra_indices - 1))) == 0) {
				this.bitArray[index] ^= (128 >> extra_indices - 1);
				added = true;
			} else if (extra_indices == 0 && (this.bitArray[index] & 1) == 0) {
				this.bitArray[index] ^= 1;
				added = true;
			}
		};

		return added;
	}

	addEntries(arr) {
		for (var i = arr.length - 1; i >= 0; i--) {
			this.addEntry(arr[i]);
		};

		return true;
	}

	get hashes() {
		const that = this;
		return {
			djb2: function(str) {
				var hash = 5381;

				for (var len = str.length, count = 0; count < len; count++) {
					hash = hash * 33 ^ str.charCodeAt(count);
				};

				return (hash >>> 0) % that.bitArrayLength;
			},
			sdbm: function(str) {
				var hash = 0;

				for (var len = str.length, count = 0; count < len; count++) {
					hash = str.charCodeAt(count) + (hash << 6) + (hash << 16) - hash;
				};

				return (hash >>> 0) % that.bitArrayLength;
			},
		}
	}

	checkEntry(str) {
		const h1 = this.hashes.djb2(str);
		var extra_indices = h1 % 8;
		var index = ((h1 - extra_indices) / 8);

		if (extra_indices != 0 && (this.bitArray[index] & (128 >> (extra_indices - 1))) == 0) {
			return false;
		} else if (extra_indices == 0 && (this.bitArray[index] & 1) == 0) {
			return false;
		}

		const h2 = hashes.sdbm(str)
		extra_indices = h2 % 8;
		index = ((h2 - extra_indices) / 8);

		if (extra_indices != 0 && (this.bitArray[index] & (128 >> (extra_indices - 1))) == 0) {
			return false;
		} else if (extra_indices == 0 && (this.bitArray[index] & 1) == 0) {
			return false;
		}

		for (var round = 2; round <= this.hashRounds; round++) {
			var new_hash = round==0?h1:round==1?h2:(h1 + (round * h2) + (round^2)) % this.bitArrayLength;
			var extra_indices = new_hash % 8,
				index = ((new_hash - extra_indices) / 8);

			if (extra_indices != 0 && (this.bitArray[index] & (128 >> (extra_indices - 1))) == 0) {
				return false;
			} else if (extra_indices == 0 && (this.bitArray[index] & 1) == 0) {
				return false;
			}
		};

		return true;
	}
}
