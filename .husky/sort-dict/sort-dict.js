const fs = require('fs');

var filename = process.argv.slice(2)[0];

// Read in the file
var lines = fs.readFileSync(filename).toString().split('\n');

// Separate header from lines to sort
var list = [], header = [];
for (line of lines) {
    if (line.startsWith("#"))
        header.push(line);
    else if (line.trim() != "")
        list.push(line);
}

function sorter(a, b) {
    const regex = /\[(.*?)\]/i;

    if (a.charAt(0) == '(') {
        a = a.slice(1);
    }
    if (a.charAt(0) == '[') {
        a = a.replace(regex, "$1").slice(1);
    }
    if (b.charAt(0) == '(') {
        b = b.slice(1);
    }
    if (b.charAt(0) == '[') {
        b = b.replace(regex, "$1").slice(1);
    }
    
    return a.localeCompare(b, undefined, {sensitivity: 'base'});
}

// Sort and de-dupe the list
list.sort(sorter);
let uniqueList = [...new Set(list)];

// Write out file, stitching header and sorted unique list
var file = fs.createWriteStream(filename);
file.on('error', function(err) { console.error(err); });
header.forEach(function(v) { file.write(v + '\n'); });
file.write('\n');
uniqueList.forEach(function(v) { file.write(v + '\n'); });
file.end();

