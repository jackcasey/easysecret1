encode = require('sec.js').encode;
decode = require('sec.js').decode;

function documentReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function warn() {

}

module.exports = {
  ready:  () => {
    documentReady( function() {
      const encoded = document.querySelectorAll("#encoded")[0];
      const encodeButton = document.querySelectorAll("#encode")[0];
      const decoded = document.querySelectorAll("#decoded")[0];
      const decodeButton = document.querySelectorAll("#decode")[0];
      const password = document.querySelectorAll("#password")[0];
      const warning = document.querySelectorAll("#warning")[0];

      encodeButton.addEventListener('click', (evt) => {
        encoded.value = encode(decoded.value, password.value);
        if (password.value.length < decoded.value.length) {
          warning.style.display = '';
        } else {
          warning.style.display = 'none';
        }
      });
      decodeButton.addEventListener('click', (evt) => {
        decoded.value = decode(encoded.value, password.value);
        if (password.value.length < encoded.value.length) {
          warning.style.display = '';
        } else {
          warning.style.display = 'none';
        }
      });
    });
  }
};
