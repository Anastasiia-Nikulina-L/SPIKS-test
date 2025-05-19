"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
(function (window) {
  if (!window.app) {
    window.app = {};
  }
  var breakpoints = {
    xxl: 1919,
    xl: 1439,
    lg: 1279,
    md: 991,
    sm: 575
  };
  var events = {}; // кастомные события

  window.app.config = {
    events: events,
    breakpoints: breakpoints
    // ...
  };
})(window);
(function (window) {
  if (!window.app) {
    window.app = {};
  }
  var checkResponse = function checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("\u041E\u0448\u0438\u0431\u043A\u0430 ".concat(res.status));
  };
  var checkResponseSuccess = function checkResponseSuccess(res) {
    if (res && res.success) {
      return res;
    }
    return Promise.reject("\u041E\u0442\u0432\u0435\u0442 \u043D\u0435 success: ".concat(res));
  };
  var buildHttpClient = function buildHttpClient(baseUrl) {
    return function (endpoint) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return fetch("".concat(baseUrl).concat(endpoint), options).then(checkResponse).then(checkResponseSuccess);
    };
  };
  var setObserver = function setObserver(element, handleObserve) {
    var manualConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var config = _objectSpread({
      childList: true
    }, manualConfig);
    var observer = new MutationObserver(function () {
      return handleObserve(element);
    });
    observer.observe(element, config);
  };
  var findAncestorsByClassName = function findAncestorsByClassName(el, className) {
    var stopElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var ancestorEls = [];
    var currentParent = el.parentElement;
    if (!currentParent) {
      return ancestorEls;
    }
    while (currentParent !== null && currentParent !== stopElement) {
      if (currentParent.classList.contains(className)) {
        ancestorEls = [].concat(_toConsumableArray(ancestorEls), [currentParent]);
      }
      currentParent = currentParent.parentElement;
    }
    return ancestorEls;
  };
  var findAncestorByClassName = function findAncestorByClassName(el, className) {
    var ancestorEl = el.parentElement;
    while (!ancestorEl.classList.contains(className)) {
      ancestorEl = ancestorEl.parentElement;
      if (!ancestorEl) {
        return null;
      }
    }
    return ancestorEl;
  };
  var buildComponentLogger = function buildComponentLogger(componentName) {
    return function (text) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var msg = context ? "".concat(componentName, ":").concat(context, ":").concat(text) : "".concat(componentName, ":").concat(text);
      console.debug(msg);
      if (data) {
        console.dir(data);
      }
    };
  };
  var debounce = function debounce(callee, timeoutMs) {
    return function perform() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var previousCall = this.lastCall;
      this.lastCall = Date.now();
      if (previousCall && this.lastCall - previousCall <= timeoutMs) {
        clearTimeout(this.lastCallTimer);
      }
      this.lastCallTimer = setTimeout(function () {
        return callee.apply(void 0, args);
      }, timeoutMs);
    };
  };
  var throttle = function throttle(callee, timeout) {
    var timer = null;
    return function perform() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      if (timer) return;
      timer = setTimeout(function () {
        callee.apply(void 0, args);
        clearTimeout(timer);
        timer = null;
      }, timeout);
    };
  };
  window.app.lib = {
    setObserver: setObserver,
    findAncestorsByClassName: findAncestorsByClassName,
    findAncestorByClassName: findAncestorByClassName,
    buildComponentLogger: buildComponentLogger,
    debounce: debounce,
    throttle: throttle,
    checkResponse: checkResponse,
    checkResponseSuccess: checkResponseSuccess,
    buildHttpClient: buildHttpClient
  };
})(window);
(function (global) {
  if (!global.uiComponents) {
    global.uiComponents = {};
  }
  var DualValueSlider = /*#__PURE__*/function () {
    function DualValueSlider(container) {
      _classCallCheck(this, DualValueSlider);
      this.container = container;
      this.track = container.querySelector('.slider-track');
      this.minInputField = container.querySelector('.slider-min-input input');
      this.maxInputField = container.querySelector('.slider-max-input input');
      this.valueFields = [this.minInputField, this.maxInputField].filter(Boolean);
      this.minHandle = null;
      this.maxHandle = null;
      this.fill = null;
      this.isDragging = false;
      this.currentHandle = null;
      this.config = {};
      this.initialize();
    }
    _createClass(DualValueSlider, [{
      key: "initialize",
      value: function initialize() {
        if (!this.track) return;
        var configData = JSON.parse(this.container.dataset.config || '{}');
        this.config = {
          minRange: typeof configData.minRange === 'number' ? configData.minRange : 0,
          maxRange: typeof configData.maxRange === 'number' ? configData.maxRange : 100,
          unit: configData.unit || '',
          showInputs: configData.showInputs || false,
          isSingleHandle: configData.handles === 1
        };
        this.config.minValue = typeof configData.minValue === 'number' ? configData.minValue : this.config.minRange;
        this.config.maxValue = typeof configData.maxValue === 'number' ? configData.maxValue : this.config.maxRange;
        if (this.config.isSingleHandle) {
          if (this.minInputField && !this.maxInputField) {
            this.config.maxValue = this.config.maxRange;
          } else if (!this.minInputField && this.maxInputField) {
            this.config.minValue = typeof configData.maxValue === 'number' ? configData.maxValue : this.config.maxRange;
            this.config.maxValue = this.config.maxRange;
          }
        }
        this.createSliderElements();
        this.setupEvents();
        this.updateSliderValues([this.config.minValue, this.config.maxValue]);
        if (this.config.showInputs) {
          this.updateInputFields();
          this.setupValueSync();
        }
      }
    }, {
      key: "createSliderElements",
      value: function createSliderElements() {
        this.fill = document.createElement('div');
        this.fill.className = 'slider-fill';
        this.track.appendChild(this.fill);
        this.minHandle = document.createElement('div');
        this.minHandle.className = 'slider-handle slider-handle-min';
        this.minHandle.setAttribute('data-handle', 'min');
        this.track.appendChild(this.minHandle);
        var minTooltip = document.createElement('div');
        minTooltip.className = 'slider-tooltip';
        minTooltip.style.display = 'none';
        this.minHandle.appendChild(minTooltip);
        if (!this.config.isSingleHandle && this.maxInputField) {
          this.maxHandle = document.createElement('div');
          this.maxHandle.className = 'slider-handle slider-handle-max';
          this.maxHandle.setAttribute('data-handle', 'max');
          this.track.appendChild(this.maxHandle);
          var maxTooltip = document.createElement('div');
          maxTooltip.className = 'slider-tooltip';
          maxTooltip.style.display = 'none';
          this.maxHandle.appendChild(maxTooltip);
        }
      }
    }, {
      key: "setupEvents",
      value: function setupEvents() {
        var _this = this;
        this.minHandle.addEventListener('mousedown', function (e) {
          return _this.startDrag(e, _this.minHandle);
        });
        if (this.maxHandle) {
          this.maxHandle.addEventListener('mousedown', function (e) {
            return _this.startDrag(e, _this.maxHandle);
          });
        }
        document.addEventListener('mousemove', function (e) {
          return _this.handleDrag(e);
        });
        document.addEventListener('mouseup', function () {
          return _this.stopDrag();
        });
        this.minHandle.addEventListener('touchstart', function (e) {
          return _this.startDrag(e, _this.minHandle);
        }, {
          passive: false
        });
        if (this.maxHandle) {
          this.maxHandle.addEventListener('touchstart', function (e) {
            return _this.startDrag(e, _this.maxHandle);
          }, {
            passive: false
          });
        }
        document.addEventListener('touchmove', function (e) {
          return _this.handleDrag(e);
        }, {
          passive: false
        });
        document.addEventListener('touchend', function () {
          return _this.stopDrag();
        });
        this.minHandle.addEventListener('mouseenter', function () {
          return _this.showTooltip(_this.minHandle);
        });
        this.minHandle.addEventListener('mouseleave', function () {
          if (!_this.isDragging || _this.currentHandle !== _this.minHandle) _this.hideTooltip(_this.minHandle);
        });
        if (this.maxHandle) {
          this.maxHandle.addEventListener('mouseenter', function () {
            return _this.showTooltip(_this.maxHandle);
          });
          this.maxHandle.addEventListener('mouseleave', function () {
            if (!_this.isDragging || _this.currentHandle !== _this.maxHandle) _this.hideTooltip(_this.maxHandle);
          });
        }
      }
    }, {
      key: "showTooltip",
      value: function showTooltip(handleElement) {
        var tooltip = handleElement.querySelector('.slider-tooltip');
        if (tooltip) {
          tooltip.style.display = 'block';
        }
      }
    }, {
      key: "hideTooltip",
      value: function hideTooltip(handleElement) {
        var tooltip = handleElement.querySelector('.slider-tooltip');
        if (tooltip) {
          tooltip.style.display = 'none';
        }
      }
    }, {
      key: "startDrag",
      value: function startDrag(e, handleElement) {
        e.preventDefault();
        this.isDragging = true;
        this.currentHandle = handleElement;
        this.showTooltip(this.currentHandle);
        this.minHandle.style.zIndex = this.currentHandle === this.minHandle ? '10' : '1';
        if (this.maxHandle) {
          this.maxHandle.style.zIndex = this.currentHandle === this.maxHandle ? '10' : '1';
        }
      }
    }, {
      key: "handleDrag",
      value: function handleDrag(e) {
        if (!this.isDragging || !this.currentHandle) return;
        e.preventDefault();
        var clientX = e.clientX || e.touches && e.touches[0].clientX;
        if (typeof clientX === 'undefined') return;
        var trackRect = this.track.getBoundingClientRect();
        var position = (clientX - trackRect.left) / trackRect.width;
        position = Math.max(0, Math.min(1, position));
        var value = this.config.minRange + position * (this.config.maxRange - this.config.minRange);
        value = Math.round(value);
        var handleType = this.currentHandle.dataset.handle;
        if (handleType === 'min') {
          var currentMaxValue = this.maxHandle ? this.getHandleValue(this.maxHandle) : this.config.maxRange;
          var newValue = Math.min(value, currentMaxValue);
          this.updateHandlePosition(this.minHandle, newValue);
          this.config.minValue = newValue;
        } else if (handleType === 'max' && this.maxHandle) {
          var currentMinValue = this.getHandleValue(this.minHandle);
          var _newValue = Math.max(value, currentMinValue);
          this.updateHandlePosition(this.maxHandle, _newValue);
          this.config.maxValue = _newValue;
        }
        this.updateFill();
        this.updateTooltips();
        if (this.config.showInputs) {
          this.updateInputFields();
        }
      }
    }, {
      key: "stopDrag",
      value: function stopDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        if (this.currentHandle) {
          this.hideTooltip(this.currentHandle);
          this.minHandle.style.zIndex = '1';
          if (this.maxHandle) this.maxHandle.style.zIndex = '1';
        }
        this.currentHandle = null;
      }
    }, {
      key: "getHandleValue",
      value: function getHandleValue(handleElement) {
        if (!handleElement || !handleElement.style.left) {
          if (handleElement === this.minHandle) return this.config.minValue;
          if (handleElement === this.maxHandle) return this.config.maxValue;
          return 0;
        }
        var posPercent = parseFloat(handleElement.style.left);
        if (isNaN(posPercent)) {
          if (handleElement === this.minHandle) return this.config.minValue;
          if (handleElement === this.maxHandle) return this.config.maxValue;
          return 0;
        }
        return this.config.minRange + posPercent / 100 * (this.config.maxRange - this.config.minRange);
      }
    }, {
      key: "updateHandlePosition",
      value: function updateHandlePosition(handleElement, value) {
        var positionPercent = (value - this.config.minRange) / (this.config.maxRange - this.config.minRange) * 100;
        handleElement.style.left = "".concat(Math.max(0, Math.min(100, positionPercent)), "%");
      }
    }, {
      key: "updateFill",
      value: function updateFill() {
        var minPosPercent = parseFloat(this.minHandle.style.left) || 0;
        var maxPosPercent = this.maxHandle ? parseFloat(this.maxHandle.style.left) || 100 : 100;
        this.fill.style.left = "".concat(minPosPercent, "%");
        this.fill.style.width = "".concat(maxPosPercent - minPosPercent, "%");
      }
    }, {
      key: "updateTooltips",
      value: function updateTooltips() {
        var _this2 = this;
        var formatValue = function formatValue(val) {
          return "".concat(Math.round(val)).concat(_this2.config.unit ? _this2.config.unit : '');
        };
        var minTooltipEl = this.minHandle.querySelector('.slider-tooltip');
        if (minTooltipEl) minTooltipEl.textContent = formatValue(this.getHandleValue(this.minHandle));
        if (this.maxHandle) {
          var maxTooltipEl = this.maxHandle.querySelector('.slider-tooltip');
          if (maxTooltipEl) maxTooltipEl.textContent = formatValue(this.getHandleValue(this.maxHandle));
        }
      }
    }, {
      key: "updateSliderValues",
      value: function updateSliderValues(values) {
        var newMin = values[0];
        var newMax = values.length > 1 ? values[1] : this.config.maxRange;
        newMin = Math.max(this.config.minRange, Math.min(this.config.maxRange, newMin));
        if (this.maxHandle) {
          newMax = Math.max(this.config.minRange, Math.min(this.config.maxRange, newMax));
          if (newMin > newMax) newMin = newMax;
        } else {}
        this.config.minValue = newMin;
        this.updateHandlePosition(this.minHandle, this.config.minValue);
        if (this.maxHandle) {
          this.config.maxValue = newMax;
          this.updateHandlePosition(this.maxHandle, this.config.maxValue);
        }
        this.updateFill();
        this.updateTooltips();
        if (this.config.showInputs) {
          this.updateInputFields();
        }
      }
    }, {
      key: "setupValueSync",
      value: function setupValueSync() {
        var _this3 = this;
        this.valueFields.forEach(function (inputField) {
          if (!inputField) return;
          inputField.addEventListener('input', function () {
            _this3.adjustInputWidth(inputField);
          });
          inputField.addEventListener('change', function (event) {
            var targetInput = event.target;
            var numericValue = parseFloat(targetInput.value.replace(/[^\d.-]/g, ''));
            if (isNaN(numericValue)) {
              _this3.updateInputFields();
              return;
            }
            var inputType = targetInput.dataset.type;
            var currentMin = _this3.getHandleValue(_this3.minHandle);
            var currentMax = _this3.maxHandle ? _this3.getHandleValue(_this3.maxHandle) : _this3.config.maxRange;
            if (inputType === 'min') {
              numericValue = Math.max(_this3.config.minRange, Math.min(numericValue, currentMax));
              _this3.config.minValue = numericValue;
              if (_this3.config.isSingleHandle && !_this3.maxHandle) {
                _this3.updateSliderValues([_this3.config.minValue, _this3.config.maxRange]);
              } else {
                _this3.updateSliderValues([_this3.config.minValue, currentMax]);
              }
            } else if (inputType === 'max' && _this3.maxHandle) {
              numericValue = Math.max(currentMin, Math.min(numericValue, _this3.config.maxRange));
              _this3.config.maxValue = numericValue;
              _this3.updateSliderValues([currentMin, _this3.config.maxValue]);
            }
          });
        });
      }
    }, {
      key: "updateInputFields",
      value: function updateInputFields() {
        var _this4 = this;
        if (!this.config.showInputs) return;
        var formatValue = function formatValue(val) {
          return "".concat(Math.round(val)).concat(_this4.config.unit ? '' + _this4.config.unit : '');
        };
        if (this.minInputField) {
          this.minInputField.value = formatValue(this.getHandleValue(this.minHandle));
          this.adjustInputWidth(this.minInputField);
        }
        if (this.maxInputField && this.maxHandle) {
          this.maxInputField.value = formatValue(this.getHandleValue(this.maxHandle));
          this.adjustInputWidth(this.maxInputField);
        }
      }
    }, {
      key: "adjustInputWidth",
      value: function adjustInputWidth(input) {
        if (input) {
          input.size = Math.max(3, input.value.length || input.placeholder.length || 3);
        }
      }
    }]);
    return DualValueSlider;
  }();
  global.uiComponents.sliders = {
    instances: [],
    setup: function setup() {
      document.querySelectorAll('.slider-container').forEach(function (el) {
        if (!el.classList.contains('slider-initialized')) {
          global.uiComponents.sliders.instances.push(new DualValueSlider(el));
          el.classList.add('slider-initialized');
        }
      });
    },
    destroy: function destroy() {
      global.uiComponents.sliders.instances.forEach(function (instance) {
        if (typeof instance.cleanup === 'function') {
          instance.cleanup();
        }
      });
      global.uiComponents.sliders.instances = [];
      document.querySelectorAll('.slider-container.slider-initialized').forEach(function (el) {
        el.classList.remove('slider-initialized');
      });
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', global.uiComponents.sliders.setup);
  } else {
    global.uiComponents.sliders.setup();
  }
})(window);
var SideFilter = /*#__PURE__*/function () {
  function SideFilter(element) {
    _classCallCheck(this, SideFilter);
    this.filter = element;
    this.groups = this.filter.querySelectorAll('.side-filter__group');
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleHeaderKeydown = this.handleHeaderKeydown.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.init();
  }
  _createClass(SideFilter, [{
    key: "init",
    value: function init() {
      this.setupEventListeners();
      this.initAccessibility();
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this5 = this;
      this.filter.addEventListener('click', this.handleHeaderClick);
      this.groups.forEach(function (group) {
        var header = group.querySelector('.side-filter__header');
        if (header) {
          header.addEventListener('keydown', _this5.handleHeaderKeydown);
        }
      });
      this.filter.addEventListener('change', this.handleCheckboxChange);
    }
  }, {
    key: "handleCheckboxChange",
    value: function handleCheckboxChange(e) {
      var checkboxInput = e.target;
      if (checkboxInput.type === 'checkbox' && checkboxInput.classList.contains('checkbox__input') && checkboxInput.closest('.side-filter__option')) {
        var labelText = 'Unknown Filter';
        var labelWrapper = checkboxInput.closest('label.checkbox');
        if (labelWrapper) {
          var textElement = labelWrapper.querySelector('.checkbox__text');
          if (textElement) {
            labelText = textElement.textContent.trim();
          } else {
            console.warn("span.checkbox__text not found inside label for checkbox id \"".concat(checkboxInput.id, "\""));
          }
        } else {
          console.warn("label.checkbox wrapper not found for checkbox id \"".concat(checkboxInput.id, "\""));
        }
        var checkboxId = checkboxInput.id;
        if (!checkboxId) {
          console.error('Checkbox ID is missing from input element!');
          return;
        }
        var event = new CustomEvent('filterSelectionChanged', {
          bubbles: true,
          detail: {
            id: checkboxId,
            name: checkboxInput.name,
            label: labelText,
            checked: checkboxInput.checked
          }
        });
        this.filter.dispatchEvent(event);
        console.log('Dispatched filterSelectionChanged:', {
          id: checkboxId,
          label: labelText,
          checked: checkboxInput.checked
        }); // DEBUG
      }
    }
  }, {
    key: "handleHeaderClick",
    value: function handleHeaderClick(e) {
      var header = e.target.closest('.side-filter__header');
      if (!header) return;
      var group = header.parentElement;
      if (group.classList.contains('side-filter__group')) {
        this.toggleGroup(group);
      }
    }
  }, {
    key: "handleHeaderKeydown",
    value: function handleHeaderKeydown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var group = e.currentTarget.parentElement;
        if (group.classList.contains('side-filter__group')) {
          this.toggleGroup(group);
        }
      }
    }
  }, {
    key: "toggleGroup",
    value: function toggleGroup(group) {
      group.classList.toggle('is-open');
      var header = group.querySelector('.side-filter__header');
      var options = group.querySelector('.side-filter__options');
      if (header) {
        header.setAttribute('aria-expanded', isOpen.toString());
      }
      if (options) {
        options.setAttribute('aria-hidden', (!isOpen).toString());
      }
    }
  }, {
    key: "initAccessibility",
    value: function initAccessibility() {
      this.groups.forEach(function (group) {
        var isOpen = group.classList.contains('is-open');
        var header = group.querySelector('.side-filter__header');
        var options = group.querySelector('.side-filter__options');
        if (header) {
          header.setAttribute('aria-expanded', isOpen.toString());
        }
        if (options) {
          options.setAttribute('aria-hidden', (!isOpen).toString());
        }
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this6 = this;
      this.filter.removeEventListener('click', this.handleHeaderClick);
      this.groups.forEach(function (group) {
        var header = group.querySelector('.side-filter__header');
        if (header) {
          header.removeEventListener('keydown', _this6.handleHeaderKeydown);
        }
      });
    }
  }, {
    key: "setCheckboxState",
    value: function setCheckboxState(checkboxId, isChecked) {
      //let checkbox = document.getElementById(checkboxId);
      var checkbox = this.filter.querySelector("#".concat(checkboxId));
      if (checkbox) {
        if (checkbox.checked !== isChecked) {
          checkbox.checked = isChecked;
        }
      }
    }
  }]);
  return SideFilter;
}();
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.side-filter').forEach(function (filterElement) {
    new SideFilter(filterElement);
  });
});
document.addEventListener('DOMContentLoaded', function () {
  var sideFilterElement = document.querySelector('.side-filter');
  var headerFilterButtonsContainer = document.querySelector('.header__filter-buttons');
  var resultsSubtitle = document.querySelector('.header__subtitle');
  if (!sideFilterElement || !headerFilterButtonsContainer) {
    console.warn('SideFilter or HeaderFilterButtonsContainer not found. Filter button functionality will not work.');
    return;
  }
  var activeFilterButtons = {};
  function updateResultsHeader() {
    var buttonCount = Object.keys(activeFilterButtons).length;
  }
  document.body.addEventListener('filterSelectionChanged', function (e) {
    if (!e.target.classList.contains('side-filter')) return;
    var _e$detail = e.detail,
      id = _e$detail.id,
      label = _e$detail.label,
      checked = _e$detail.checked;
    if (checked) {
      if (!activeFilterButtons[id]) {
        var buttonWrapper = document.createElement('div');
        buttonWrapper.innerHTML = "\n          <div class=\"green-button\" data-filter-id=\"".concat(id, "\">\n            <label class=\"green-button_label\">").concat(label, "</label>\n            <button class=\"green-button__close\" type=\"button\" aria-label=\"Remove ").concat(label, "\">\n            <svg class=\"icon-Cancel\" width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" aria-hidden=\"true\">\n                    <use href=\"./assets/icons/default/sprite.svg#Cancel\"></use>\n                  </svg>\n            </button>\n          </button>\n        ");
        var newButton = buttonWrapper.firstElementChild;
        headerFilterButtonsContainer.appendChild(newButton);
        activeFilterButtons[id] = newButton;
      }
    } else {
      if (activeFilterButtons[id]) {
        activeFilterButtons[id].remove();
        delete activeFilterButtons[id];
      }
    }
    updateResultsHeader();
  });
  headerFilterButtonsContainer.addEventListener('click', function (e) {
    var closeButton = e.target.closest('.green-button__close');
    if (closeButton) {
      var greenButton = closeButton.closest('.green-button[data-filter-id]');
      if (greenButton) {
        var checkboxId = greenButton.dataset.filterId;
        var sideFilterInstance = findSideFilterInstance(sideFilterElement);
        if (sideFilterInstance) {
          sideFilterInstance.setCheckboxState(checkboxId, false);
        } else {
          var checkbox = sideFilterElement.querySelector("#".concat(checkboxId));
          if (checkbox) {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change', {
              bubbles: true
            }));
          }
        }
      }
    }
  });
  function findSideFilterInstance(element) {
    return null;
  }
});