const fs = require('fs'),
      args = process.argv.slice(2);

const BloomFilter = require('../lib/bloom');

fs.readFile(args[0], 'utf8', function(err, data) {
    if (err) throw err;

    var wordlist = data.split("\n").filter(function (word) { return word.length >= 8; }),
        filter = new BloomFilter(wordlist.length, 1E-6);

    filter.addEntries(wordlist);

    var exportData = filter.exportData();

    fs.writeFile(args[1], exportData, function(err) {
        if (err) throw err;
    })
});