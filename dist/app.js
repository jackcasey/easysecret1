(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("document.js", function(exports, require, module) {
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

});

require.register("sec.js", function(exports, require, module) {
const letters = "abcdefghijklmnopqrstuvwxyz".split('');

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

const encode = function(text, password, decodeText=false) {
  var passwordIndex = 0;
  return text.split(" ").map( (word) => {
    t = prepare(word);
    p = prepare(password);
    encoded = t.map((x) => {
      var offset = index(p,passwordIndex);
      if (decodeText) {
        offset = -offset;
      }
      passwordIndex += 1;
      return x + offset;
    });
    return unprepare(encoded);
  }).join(" ");
}

const decode = function(text, password) {
  return encode(text, password, true);
}

module.exports = {encode, decode, clean, prepare};

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map