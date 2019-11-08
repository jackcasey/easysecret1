const letters = "abcdefghijklmnopqrstuvwxyz ".split('');

const clean = (text) => {
  return text.toLowerCase().replace(/[^a-z]+/g, "")
}

// convert string into series of numbers
const prepare = (text) => {
  return clean(text).split('').map((x) => {
    return letters.indexOf(x);
  });
}

const unprepare = (array) => {
  return array.map((x) => { return index(letters,x) }).join('');
}

const index = (array, i) => {
  if (i < 0) {
    i += array.length;
  }
  return array[i % array.length];
}

const encode = function(text, password, decodeText=false) {
  var passwordIndex = 0;
  p = prepare(password);
  return unprepare(prepare(text).map((x) => {
    var offset = index(p, passwordIndex);
    if (decodeText) {
      offset = -offset;
    }
    passwordIndex += 1;
    return x + offset;
  }));
}

const decode = function(text, password) {
  return encode(text, password, true);
}

module.exports = {encode, decode, clean, prepare};
