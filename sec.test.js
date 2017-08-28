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
  expect(encode("parsnips", "my password")).toBe("byqhnaho");
});

test('encode will maintain spaces', () => {
  expect(encode("why hello there", "my password")).toBe("ifx weddk hyhdc");
});

test('decode will give original phrase', () => {
  expect(decode("ifx weddk hyhdc", "my password")).toBe("why hello there");
});

test("spaces are maintained but don't contribute", () => {
  expect(decode("ifxwed dk hyh dc", "my password")).toBe("whyhel lo the re");
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
