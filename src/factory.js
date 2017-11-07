import BloomFilter from './bloom';
import LZString from './lzstring';

export default class BloomFilterFactory {
	/**
	 * Inflate a stored packed filter into a usable data structure
	 *
	 * @return BloomFilter
	 */
	static inflateFromUTF16(compressed_contents, length) {
		const raw_data = LZString.decompressFromUTF16(compressed_contents);
		const data = raw_data.split(',');

		return new BloomFilter({data, length});
	}

	/**
	 * Inflate a stored packed filter into a usable data structure
	 *
	 * @return BloomFilter
	 */
	static inflateFromBase64(compressed_contents, length) {
		const raw_data = LZString.decompressFromBase64(lzData);
		const data = raw_data.split(',');

		return new BloomFilter({data, length});
	}

	/**
	 * Build a Bloom Filter from data
	 *
	 * @return BloomFilter
	 */
	static build(length, probability = 1E-6) {
		return new BloomFilter({length, probability});
	}

	static export(filter, callback) {
		switch (typeof callback) {
			case "function":
				callback(LZString.compressToUTF16(filter.bitArray.toString()));
				break;
			default:
				return LZString.compressToUTF16(filter.bitArray.toString());
		}
	}
}
