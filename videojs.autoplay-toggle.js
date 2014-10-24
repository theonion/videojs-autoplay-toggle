'use strict';

(function (window, document, videojs) {

  /**
   *  Cookie access functions.
   *  From: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
   */
  var cookies = {
    getItem: function (sKey) {
      if (!sKey) { return null; }
      return decodeURIComponent(
        document.cookie.replace(
          new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(
            /[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")
        ) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie =
        encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue)
          + sExpires
          + (sDomain ? "; domain=" + sDomain : "")
          + (sPath ? "; path=" + sPath : "")
          + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) {
        return false;
      }
      document.cookie = encodeURIComponent(sKey) + "=;"
        + " expires=Thu, 01 Jan 1970 00:00:00 GMT"
        + (sDomain ? "; domain=" + sDomain : "")
        + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      if (!sKey) { return false; }
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(
        /[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
        .split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    }
  },

  /**
   *  Local storage functionality.
   */
  localStorage = {
    available: function() {
      try {
        window.localStorage.setItem('fishingForLocalStorage', 'itsHere');
        window.localStorage.removeItem('fishingForLocalStorage');
        return true;
      } catch(e) {
        return false;
      }
    },
    getItem: function(key) {
      return window.localStorage.getItem(key);
    },
    setItem: function(key, value) {
      return window.localStorage.setItem(key, value);
    }
  },

  /**
   *  Storage chooser, will use localstorage if available, otherwise use cookies.
   */
  storage = {
    getItem: function (key) {
      return localStorage.available() ? localStorage.getItem(key) : cookies.getItem(key);
    },
    setItem: function(key, value) {
      localStorage.available() ? localStorage.setItem(key, value) : cookies.setItem(key, value, Infinity, '/');
      return value;
    }
  },

  /**
   *  Object extend function.
   */
  extend = function(obj) {
    var arg, i, k;
    for (i = 1; i < arguments.length; i++) {
      arg = arguments[i];
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          obj[k] = arg[k];
        }
      }
    }
    return obj;
  },

  /**
   *  Default settings for this plugin.
   */
  defaults = {
    namespace: 'autoplay-toggle',   // namespace for cookie/localstorage
  },

  /**
   *  Autoplay toggle plugin setup.
   */
  autoplayToggle = function (options) {

    var player = this,
        settings = extend({}, defaults, options || {}),
        key = settings.namespace + '-autoplay';

    // add new button to player
    var autoplayBtn = document.createElement('div');
    autoplayBtn.className = 'vjs-autoplay-toggle-button vjs-menu-button vjs-control';
    autoplayBtn.innerHTML =
      '<div>'
        + '<span class="vjs-control-text">'
            + 'Autoplay:<br>'
            + '<span class="autoplay-toggle autoplay-toggle-active autoplay-on">On</span>'
            + '&nbsp;/&nbsp;'
            + '<span class="autoplay-toggle autoplay-off">Off</span>'
        + '</span>'
      '</div>';
    player.controlBar.el().appendChild(autoplayBtn);

    // retrieve autoplay from storage and highlight the correct toggle option
    var autoplayToggle = function (activate) {
      var toggleOn = autoplayBtn.querySelectorAll('.autoplay-on')[0],
          toggleOff = autoplayBtn.querySelectorAll('.autoplay-off')[0];

      if (activate) {
        // toggle this on
        toggleOn.className = 'autoplay-toggle autoplay-toggle-active autoplay-on';
        toggleOff.className = 'autoplay-toggle autoplay-off';
        storage.setItem(key, true);
      } else {
        // toggle this off
        toggleOn.className = 'autoplay-toggle autoplay-on';
        toggleOff.className = 'autoplay-toggle autoplay-toggle-active autoplay-off';
        storage.setItem(key, false);
      }
    };

    // initialize toggle either with storage value or player setting
    var storageValue = storage.getItem(key),
        turnOn = player.autoplay();
    if (typeof(storageValue) === 'string') {
      // we've put something in storage before, convert its value to boolean and use that
      turnOn = storageValue === 'true';
    }
    autoplayToggle(turnOn);

    autoplayBtn.onclick = function () {
      // do opposite of what's stored, at this point some value should be stored for autoplay
      var toggle = !(storage.getItem(key) === 'true');
      autoplayToggle(toggle);
    };

  };

  videojs.plugin('autoplayToggle', autoplayToggle);

})(window, document, videojs);
