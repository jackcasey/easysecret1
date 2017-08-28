const letters = "abcdefghijklmnopqrstuvwxyz ".split('');

const clean = (text) => {
  return text.toLowerCase().replace(/[^a-z\ ]+/g, "");
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

const encode = function(text, password) {
  t = prepare(text);
  p = prepare(password);
  encoded = t.map((x, i) => { return x + index(p,i) });

  return unprepare(encoded);
}

const decode = function(text, password) {
  t = prepare(text);
  p = prepare(password);
  encoded = t.map((x, i) => { return x - index(p,i) });
  return unprepare(encoded);
}

module.exports = {encode, decode, clean, prepare};
