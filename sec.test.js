clean = require('./sec').clean;
encode = require('./sec').encode;
decode = require('./sec').decode;
prepare = require('./sec').prepare;

test('encode and decode give original text back', () => {
  expect(decode(encode("secret", "my password"), "my password")).toBe("secret");
});

test('encode and decode will maintain spaces', () => {
  expect(decode(encode("exceptional party here", "my password"), "my password")).toBe("exceptional party here");
});

test('encode will give a secret phrase', () => {
  expect(encode("why hello there", "my password")).toBe("hexohwcgbqwtbqt");
});

test('decode will give original phrase', () => {
  expect(decode("hexohwcgbqwtbqt", "my password")).toBe("why hello there");
});

test('decode will not give original phrase with incorrect password', () => {
  expect(decode("hexohwcgbqwtbqt", "your password")).not.toBe("why hello there");
});

test('clean string to just lower alphas', () => {
  expect(clean("Hel lo998!")).toBe("hel lo");
});

test("prep a string into a number array", () => {
  expect(prepare("hello")).toEqual([7,4,11,11,14]);
});
