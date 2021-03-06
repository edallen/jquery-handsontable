/* -- frame counter -- */
var frame = 0;
var lastFrame = null;

(function () {
  frame = 0;
  lastFrame = null;
  var countFrames = function () {
    requestAnimFrame(function () {
      frame++;
      countFrames();
    });
  };
  countFrames();
})();

var nextFrame = function () {
  if (lastFrame === null) {
    lastFrame = frame;
  }
  else if (frame - 2 >= lastFrame) {
    lastFrame = null;
    return true;
  }
  return false;
};

/* ------------------- */

var spec = function () {
  return jasmine.getEnv().currentSpec;
};

var handsontable = function (options) {
  var currentSpec = spec();
  currentSpec.$container.handsontable(options);
  currentSpec.$container[0].focus(); //otherwise TextEditor tests do not pass in IE8
  return currentSpec.$container.data('handsontable');
};

var countRows = function () {
  return spec().$container.find('.htCore tbody tr').length;
};

var countCols = function () {
  return spec().$container.find('.htCore tbody tr:eq(0) td').length;
};

var countCells = function () {
  return spec().$container.find('.htCore tbody td').length;
};

var isEditorVisible = function () {
  return !!(keyProxy().is(':visible') && keyProxy().parent().is(':visible') && !keyProxy().parent().is('.htHidden'));
};

var isFillHandleVisible = function () {
  return !!spec().$container.find('.wtBorder.corner:visible').length;
};

var isAutocompleteVisible = function () {
  return !!(autocompleteEditor() && autocompleteEditor().data("typeahead") && autocompleteEditor().data("typeahead").$menu.is(":visible"));
};

/**
 * Shows context menu
 */
var contextMenu = function () {
  var ev = $.Event('contextmenu');
  ev.button = 2;
  var instance = spec().$container.data('handsontable');
  var selector = "#" + instance.rootElement.attr('id') + ' table, #' + instance.rootElement.attr('id') + ' div';
  $(selector).trigger(ev);
};

/**
 * Returns a function that triggers a key event
 * @param {String} type Event type
 * @return {Function}
 */
var handsontableKeyTriggerFactory = function (type) {
  return function (key, extend) {
    var ev = $.Event(type);
    if (typeof key === 'string') {
      if (key.indexOf('shift+') > -1) {
        key = key.substring(6);
        ev.shiftKey = true;
      }
      switch (key) {
        case 'tab':
          ev.keyCode = 9;
          break;

        case 'enter':
          ev.keyCode = 13;
          break;

        case 'esc':
          ev.keyCode = 27;
          break;

        case 'f2':
          ev.keyCode = 113;
          break;

        case 'arrow_left':
          ev.keyCode = 37;
          break;

        case 'arrow_up':
          ev.keyCode = 38;
          break;

        case 'arrow_right':
          ev.keyCode = 39;
          break;

        case 'arrow_down':
          ev.keyCode = 40;
          break;

        case 'ctrl':
          ev.keyCode = 17;
          break;

        case 'shift':
          ev.keyCode = 16;
          break;

        default:
          throw new Error('Unrecognised key name: ' + key);
      }
    }
    else if (typeof key === 'number') {
      ev.keyCode = key;
    }
    ev.originalEvent = {}; //needed as long Handsontable searches for event.originalEvent
    $.extend(ev, extend);
    $(document.activeElement).trigger(ev);
  }
};

var keyDown = handsontableKeyTriggerFactory('keydown');
var keyUp = handsontableKeyTriggerFactory('keyup');

/**
 * Presses keyDown, then keyUp
 */
var keyDownUp = function (key, extend) {
  if (typeof key === 'string' && key.indexOf('shift+') > -1) {
    keyDown('shift');
  }

  keyDown(key, extend);
  keyUp(key, extend);

  if (typeof key === 'string' && key.indexOf('shift+') > -1) {
    keyUp('shift');
  }
};

/**
 * Returns current value of the keyboard proxy textarea
 * @return {String}
 */
var keyProxy = function () {
  return spec().$container.find('textarea.handsontableInput');
};

var autocompleteEditor = function () {
  return spec().$container.data('handsontable').autocompleteEditor.$textarea;
};

/**
 * Sets text cursor inside keyboard proxy
 */
var setCaretPosition = function (pos) {
  var el = keyProxy()[0];
  if (el.setSelectionRange) {
    el.focus();
    el.setSelectionRange(pos, pos);
  }
  else if (el.createTextRange) {
    var range = el.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
};

/**
 * Returns autocomplete instance
 */
var autocomplete = function () {
  return spec().$container.find('.handsontableInput').data("typeahead");
};

/**
 * Triggers paste string on current selection
 */
var triggerPaste = function (str) {
  spec().$container.data('handsontable').copyPaste.triggerPaste(null, str);
};

/**
 * Calls a method in current Handsontable instance, returns its output
 * @param method
 * @return {Function}
 */

var handsontableMethodFactory = function (method) {
  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(method);
    return spec().$container.handsontable.apply(spec().$container, args);
  }
};

var selectCell = handsontableMethodFactory('selectCell');
var deselectCell = handsontableMethodFactory('deselectCell');
var getSelected = handsontableMethodFactory('getSelected');
var setDataAtCell = handsontableMethodFactory('setDataAtCell');
var getCell = handsontableMethodFactory('getCell');
var getData = handsontableMethodFactory('getData');
var getDataAtCell = handsontableMethodFactory('getDataAtCell');
var getRowHeader = handsontableMethodFactory('getRowHeader');
var getColHeader = handsontableMethodFactory('getColHeader');
var alter = handsontableMethodFactory('alter');
var loadData = handsontableMethodFactory('loadData');
var destroyEditor = handsontableMethodFactory('destroyEditor');
var render = handsontableMethodFactory('render');
var updateSettings = handsontableMethodFactory('updateSettings');
var destroy = handsontableMethodFactory('destroy');