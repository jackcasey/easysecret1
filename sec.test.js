clean = require('./app/sec').clean  ;
encode = require('./app/sec').encode;
decode = require('./app/sec').decode;
prepare = require('./app/sec').prepare;

test('encode and decode give original text back', () => {
  expect(decode(encode("secret", "my password"), "my password")).toBe("secret");
});

test('encode and decode will maintain spaces', () => {
  expect(decode(encode("exceptional party here", "my password"), "my password")).toBe("exceptional party here");
});

test('encode will give a secret phrase', () => {
  expect(encode("parsnips", "my password")).toBe("bygsfalg");
});

test('encode will maintain spaces', () => {
  expect(encode("why hello there", "my password")).toBe("ifn hwdhc kkqpt");
});

test('decode will give original phrase', () => {
  expect(decode("ifn hwdhc kkqpt", "my password")).toBe("why hello there");
});

test('decoded and password to be interchangeable apart from length and spacing', () => {
  expect(decode("ifn hwdhc kkqpt", "my password")).toBe("why hello there");
  expect(decode("ifn hwdhc kkqpt", "why hello there")).toBe("myp asswo rdmyp");
  expect(decode("ifnhwdhckkqpt", "whyhellothere")).toBe("mypasswordmyp");
  expect(decode("if nh wd hc kk qp t", "whyhellothere")).toBe("my pa ss wo rd my p");
  expect(decode("if nh wd hc kk qp t", "my pa ss wo rd my p")).toBe("wh yh el lo th er e");
  expect(decode("if nh wd hc kk qp t", "mypasswordmyp")).toBe("wh yh el lo th er e");
});

test("spaces are maintained but don't contribute", () => {
  expect(decode("ifnhwd hc kkq pt", "my password")).toBe("whyhel lo the re");
});

test('decode will not give original phrase with incorrect password', () => {
  expect(decode("hexohwcgbqwtbqt", "your password")).not.toBe("why hello there");
});

test('clean string to lower alphas and remove spaces', () => {
  expect(clean("Hel lo998!")).toBe("hello");
  expect(clean("my password")).toBe("mypassword");
});

test("prep a string into a number array", () => {
  expect(prepare("hello")).toEqual([7,4,11,11,14]);
});
