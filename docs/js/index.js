"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
      this.sliderId = container.id || "slider-".concat(Math.random().toString(36).substr(2, 9));
      this.track = container.querySelector('.slider-track');
      this.minInputField = container.querySelector('.slider-min-input input');
      this.maxInputField = container.querySelector('.slider-max-input input');
      this.minHandle = null;
      this.maxHandle = null;
      this.fill = null;
      this.isDragging = false;
      this.currentHandle = null;
      this.config = {};
      this.initialize();
    }
    _createClass(DualValueSlider, [{
      key: "_log",
      value: function _log(message) {}
    }, {
      key: "initialize",
      value: function initialize() {
        if (!this.track) {
          console.error("[".concat(this.sliderId, "] [INITIALIZE] Slider track not found. Aborting."));
          return;
        }
        var configData = JSON.parse(this.container.dataset.config || '{}');
        this._log("[INITIALIZE] Raw data-config: ".concat(JSON.stringify(configData)));
        this.config = {
          minRange: typeof configData.minRange === 'number' ? configData.minRange : 0,
          maxRange: typeof configData.maxRange === 'number' ? configData.maxRange : 100,
          unit: configData.unit || '',
          showInputs: !!configData.showInputs,
          isSingleHandle: configData.handles === 1
        };
        this._log("[INITIALIZE] Parsed base config: isSingleHandle=".concat(this.config.isSingleHandle, ", minRange=").concat(this.config.minRange, ", maxRange=").concat(this.config.maxRange, ", unit='").concat(this.config.unit, "', showInputs=").concat(this.config.showInputs));
        var initialMinFromData = typeof configData.minValue === 'number' ? configData.minValue : this.config.minRange;
        var initialMaxFromData = typeof configData.maxValue === 'number' ? configData.maxValue : this.config.maxRange;
        if (this.config.isSingleHandle) {
          this._log('[INITIALIZE] Mode: Single Handle');
          if (configData.showMinInput && !configData.showMaxInput) {
            this.config.minValue = initialMinFromData;
          } else if (!configData.showMinInput && configData.showMaxInput) {
            this.config.minValue = initialMaxFromData;
          } else {
            this.config.minValue = initialMinFromData;
          }
          this.config.minValue = Math.max(this.config.minRange, Math.min(this.config.maxRange, this.config.minValue));
          this.config.maxValue = this.config.maxRange;
          this._log("[INITIALIZE] Single handle config values set: minValue=".concat(this.config.minValue, ", maxValue=").concat(this.config.maxValue, " (derived from maxRange)"));
        } else {
          this._log('[INITIALIZE] Mode: Dual Handle');
          this.config.minValue = initialMinFromData;
          this.config.maxValue = initialMaxFromData;
          this.config.minValue = Math.max(this.config.minRange, Math.min(this.config.maxRange, this.config.minValue));
          this.config.maxValue = Math.max(this.config.minRange, Math.min(this.config.maxRange, this.config.maxValue));
          if (this.config.minValue > this.config.maxValue) {
            this._log("[INITIALIZE] Initial min (".concat(this.config.minValue, ") > max (").concat(this.config.maxValue, "). Swapping."));
            var _ref = [this.config.maxValue, this.config.minValue];
            this.config.minValue = _ref[0];
            this.config.maxValue = _ref[1];
          }
          this._log("[INITIALIZE] Dual handle config values set: minValue=".concat(this.config.minValue, ", maxValue=").concat(this.config.maxValue));
        }
        this.createSliderElements();
        this.setupEvents();
        this._log('[INITIALIZE] Calling _updateConfigAndDOM to set initial state.');
        this._updateConfigAndDOM([this.config.minValue, this.config.isSingleHandle ? this.config.maxRange : this.config.maxValue]);
        if (this.config.showInputs) {
          this.setupValueSync();
        }
        this._log('[INITIALIZE] Initialization complete.');
      }
    }, {
      key: "createSliderElements",
      value: function createSliderElements() {
        this._log('[CREATE_ELEMENTS] Creating fill...');
        this.fill = document.createElement('div');
        this.fill.className = 'slider-fill';
        this.track.appendChild(this.fill);
        this._log('[CREATE_ELEMENTS] Creating minHandle...');
        this.minHandle = document.createElement('div');
        this.minHandle.className = 'slider-handle slider-handle-min';
        this.minHandle.setAttribute('data-handle', 'min');
        this.track.appendChild(this.minHandle);
        var minTooltip = document.createElement('div');
        minTooltip.className = 'slider-tooltip';
        minTooltip.style.display = 'none';
        this.minHandle.appendChild(minTooltip);
        if (!this.config.isSingleHandle) {
          this._log('[CREATE_ELEMENTS] Creating maxHandle for dual slider...');
          this.maxHandle = document.createElement('div');
          this.maxHandle.className = 'slider-handle slider-handle-max';
          this.maxHandle.setAttribute('data-handle', 'max');
          this.track.appendChild(this.maxHandle);
          var maxTooltip = document.createElement('div');
          maxTooltip.className = 'slider-tooltip';
          maxTooltip.style.display = 'none';
          this.maxHandle.appendChild(maxTooltip);
        }
        this._log('[CREATE_ELEMENTS] Elements created.');
      }
    }, {
      key: "_updateConfigAndDOM",
      value: function _updateConfigAndDOM(newValues) {
        var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var _newValues$map = newValues.map(function (v) {
            return parseFloat(v);
          }),
          _newValues$map2 = _slicedToArray(_newValues$map, 2),
          newMin = _newValues$map2[0],
          newMaxAttempt = _newValues$map2[1];
        this._log("[_UPDATE_CONFIG_AND_DOM] Source: ".concat(source, ". Incoming values: newMin=").concat(newMin, ", newMaxAttempt=").concat(newMaxAttempt, ". Current config BEFORE: min=").concat(this.config.minValue, ", max=").concat(this.config.maxValue));
        newMin = Math.max(this.config.minRange, Math.min(this.config.maxRange, newMin));
        if (this.config.isSingleHandle) {
          this.config.minValue = newMin;
          this._log("[_UPDATE_CONFIG_AND_DOM] Single Handle: Config updated. minValue=".concat(this.config.minValue));
        } else {
          var newMax = newMaxAttempt;
          newMax = Math.max(this.config.minRange, Math.min(this.config.maxRange, newMax));
          if (source === 'minInput' || source === 'minDrag') {
            if (newMin > newMax) {
              this._log("[_UPDATE_CONFIG_AND_DOM] Min change caused potential crossover: newMin (".concat(newMin, ") > newMax (").concat(newMax, "). Setting newMin = newMax."));
              newMin = newMax;
            }
          } else if (source === 'maxInput' || source === 'maxDrag') {
            if (newMax < newMin) {
              this._log("[_UPDATE_CONFIG_AND_DOM] Max change caused potential crossover: newMax (".concat(newMax, ") < newMin (").concat(newMin, "). Setting newMax = newMin."));
              newMax = newMin;
            }
          } else {
            if (newMin > newMax) {
              this._log("[_UPDATE_CONFIG_AND_DOM] General crossover or init: newMin (".concat(newMin, ") > newMax (").concat(newMax, "). Setting newMin = newMax (min is weaker)."));
              newMin = newMax;
            }
          }
          this.config.minValue = newMin;
          this.config.maxValue = newMax;
          this._log("[_UPDATE_CONFIG_AND_DOM] Dual Handle: Config updated. minValue=".concat(this.config.minValue, ", maxValue=").concat(this.config.maxValue));
        }
        this._updateSliderDOMOnly();
        if (this.config.showInputs) {
          this._log("[_UPDATE_CONFIG_AND_DOM] Calling updateInputFields.");
          this.updateInputFields();
        }
        this._log("[_UPDATE_CONFIG_AND_DOM] Update cycle finished.");
      }
    }, {
      key: "_updateSliderDOMOnly",
      value: function _updateSliderDOMOnly() {
        this._log("[_UPDATE_SLIDER_DOM_ONLY] Updating slider visuals. config.minValue=".concat(this.config.minValue, ", config.maxValue=").concat(this.config.maxValue));
        this.updateHandlePosition(this.minHandle, this.config.minValue);
        if (this.maxHandle) {
          this.updateHandlePosition(this.maxHandle, this.config.maxValue);
        }
        this.updateFill();
        this.updateTooltips();
      }
    }, {
      key: "updateHandlePosition",
      value: function updateHandlePosition(handleElement, value) {
        if (!handleElement) return;
        var range = this.config.maxRange - this.config.minRange;
        var positionPercent = range === 0 ? 0 : (parseFloat(value) - this.config.minRange) / range * 100;
        handleElement.style.left = "".concat(Math.max(0, Math.min(100, positionPercent)), "%");
        this._log("[UPDATE_HANDLE_POS] Handle ".concat(handleElement.dataset.handle || 'min', " set to ").concat(positionPercent, "% for value ").concat(value));
      }
    }, {
      key: "updateFill",
      value: function updateFill() {
        var minVal = parseFloat(this.config.minValue);
        var maxValForFill = this.maxHandle ? parseFloat(this.config.maxValue) : minVal;
        var range = this.config.maxRange - this.config.minRange;
        if (range === 0) {
          this.fill.style.left = '0%';
          this.fill.style.width = '0%';
          this._log('[UPDATE_FILL] Range is 0. Fill set to 0% width.');
          return;
        }
        var minPosPercent = (minVal - this.config.minRange) / range * 100;
        minPosPercent = Math.max(0, Math.min(100, minPosPercent));
        if (this.maxHandle) {
          var maxPosPercent = (maxValForFill - this.config.minRange) / range * 100;
          maxPosPercent = Math.max(0, Math.min(100, maxPosPercent));
          this.fill.style.left = "".concat(minPosPercent, "%");
          this.fill.style.width = "".concat(Math.max(0, maxPosPercent - minPosPercent), "%");
          this._log("[UPDATE_FILL] Dual: left=".concat(minPosPercent, "%, width=").concat(Math.max(0, maxPosPercent - minPosPercent), "%"));
        } else {
          this.fill.style.left = "0%";
          this.fill.style.width = "".concat(minPosPercent, "%");
          this._log("[UPDATE_FILL] Single: left=0%, width=".concat(minPosPercent, "%"));
        }
      }
    }, {
      key: "updateTooltips",
      value: function updateTooltips() {
        var _this = this;
        var format = function format(val) {
          return "".concat(Math.round(parseFloat(val))).concat(_this.config.unit || '');
        };
        if (this.minHandle) {
          var tt = this.minHandle.querySelector('.slider-tooltip');
          if (tt) tt.textContent = format(this.config.minValue);
        }
        if (this.maxHandle) {
          var _tt = this.maxHandle.querySelector('.slider-tooltip');
          if (_tt) _tt.textContent = format(this.config.maxValue);
        }
        this._log('[UPDATE_TOOLTIPS] Tooltips updated.');
      }
    }, {
      key: "setupEvents",
      value: function setupEvents() {
        var _this2 = this;
        this.minHandle.addEventListener('mousedown', function (e) {
          return _this2.startDrag(e, _this2.minHandle);
        });
        if (this.maxHandle) {
          this.maxHandle.addEventListener('mousedown', function (e) {
            return _this2.startDrag(e, _this2.maxHandle);
          });
        }
        document.addEventListener('mousemove', function (e) {
          return _this2.handleDrag(e);
        });
        document.addEventListener('mouseup', function () {
          return _this2.stopDrag();
        });
        this.minHandle.addEventListener('touchstart', function (e) {
          return _this2.startDrag(e, _this2.minHandle);
        }, {
          passive: false
        });
        if (this.maxHandle) {
          this.maxHandle.addEventListener('touchstart', function (e) {
            return _this2.startDrag(e, _this2.maxHandle);
          }, {
            passive: false
          });
        }
        document.addEventListener('touchmove', function (e) {
          return _this2.handleDrag(e);
        }, {
          passive: false
        });
        document.addEventListener('touchend', function () {
          return _this2.stopDrag();
        });
        this.minHandle.addEventListener('mouseenter', function () {
          return _this2.showTooltip(_this2.minHandle);
        });
        this.minHandle.addEventListener('mouseleave', function () {
          if (!_this2.isDragging || _this2.currentHandle !== _this2.minHandle) _this2.hideTooltip(_this2.minHandle);
        });
        if (this.maxHandle) {
          this.maxHandle.addEventListener('mouseenter', function () {
            return _this2.showTooltip(_this2.maxHandle);
          });
          this.maxHandle.addEventListener('mouseleave', function () {
            if (!_this2.isDragging || _this2.currentHandle !== _this2.maxHandle) _this2.hideTooltip(_this2.maxHandle);
          });
        }
        this._log('[SETUP_EVENTS] Event listeners for handles and document set up.');
      }
    }, {
      key: "showTooltip",
      value: function showTooltip(handleElement) {
        if (handleElement) {
          var tt = handleElement.querySelector('.slider-tooltip');
          if (tt) tt.style.display = 'block';
        }
      }
    }, {
      key: "hideTooltip",
      value: function hideTooltip(handleElement) {
        if (handleElement) {
          var tt = handleElement.querySelector('.slider-tooltip');
          if (tt) tt.style.display = 'none';
        }
      }
    }, {
      key: "startDrag",
      value: function startDrag(e, handleElement) {
        e.preventDefault();
        this.isDragging = true;
        this.currentHandle = handleElement;
        this.showTooltip(this.currentHandle);
        this.minHandle.style.zIndex = this.currentHandle === this.minHandle ? '10' : '2';
        if (this.maxHandle) {
          this.maxHandle.style.zIndex = this.currentHandle === this.maxHandle ? '10' : '2';
        }
        this._log("[START_DRAG] Drag started on handle: ".concat(handleElement.dataset.handle));
      }
    }, {
      key: "stopDrag",
      value: function stopDrag() {
        if (!this.isDragging) return;
        this._log("[STOP_DRAG] Drag stopped. Current handle: ".concat(this.currentHandle ? this.currentHandle.dataset.handle : 'none'));
        this.isDragging = false;
        if (this.currentHandle) {
          this.hideTooltip(this.currentHandle);
          this.minHandle.style.zIndex = '2';
          if (this.maxHandle) this.maxHandle.style.zIndex = '2';
        }
        this.currentHandle = null;
      }
    }, {
      key: "handleDrag",
      value: function handleDrag(e) {
        if (!this.isDragging || !this.currentHandle) return;
        var clientX = e.clientX || e.touches && e.touches[0].clientX;
        if (typeof clientX === 'undefined') return;
        var trackRect = this.track.getBoundingClientRect();
        var range = this.config.maxRange - this.config.minRange;
        var positionPercent = (clientX - trackRect.left) / trackRect.width;
        positionPercent = Math.max(0, Math.min(1, positionPercent));
        var valueFromPos = this.config.minRange + positionPercent * (range === 0 ? 0 : range);
        var newCalculatedMin = parseFloat(this.config.minValue);
        var newCalculatedMax = this.config.isSingleHandle ? parseFloat(this.config.maxRange) : parseFloat(this.config.maxValue);
        var sourceOfChange = null;
        if (this.currentHandle.dataset.handle === 'min') {
          newCalculatedMin = valueFromPos;
          sourceOfChange = 'minDrag';
        } else if (this.currentHandle.dataset.handle === 'max' && this.maxHandle) {
          newCalculatedMax = valueFromPos;
          sourceOfChange = 'maxDrag';
        }
        this._log("[HANDLE_DRAG] Source: ".concat(sourceOfChange, ", Calculated values: min=").concat(newCalculatedMin, ", max=").concat(newCalculatedMax));
        this._updateConfigAndDOM([newCalculatedMin, newCalculatedMax], sourceOfChange);
      }
    }, {
      key: "setupValueSync",
      value: function setupValueSync() {
        var _this3 = this;
        this._log('[SETUP_VALUE_SYNC] Setting up listeners for inputs.');
        var inputsToSync = [];
        if (this.minInputField) inputsToSync.push(this.minInputField);
        if (this.maxInputField) inputsToSync.push(this.maxInputField);
        inputsToSync.forEach(function (inputField) {
          inputField.addEventListener('blur', function () {});
          inputField.addEventListener('input', function () {});
          inputField.addEventListener('change', function (event) {
            var targetInput = event.target;
            var parentSliderInput = targetInput.closest('.slider-input');
            var inputType = null;
            if (parentSliderInput && parentSliderInput.dataset.type) {
              inputType = parentSliderInput.dataset.type;
            } else if (targetInput.id.toLowerCase().includes('min-input')) {
              inputType = 'min';
            } else if (targetInput.id.toLowerCase().includes('max-input')) {
              inputType = 'max';
            }
            _this3._log("[INPUT_CHANGE] Event on input: type='".concat(inputType, "', raw value: '").concat(targetInput.value, "'"));
            if (!inputType) {
              _this3._log('[INPUT_CHANGE] ERROR: Could not determine input type (min/max). Aborting change.');
              _this3.updateInputFields();
              return;
            }
            var numericString = targetInput.value.replace(/[^0-9.-]/g, '');
            var numericValue = parseFloat(numericString);
            if (isNaN(numericValue)) {
              return;
            }
            _this3._log("[INPUT_CHANGE] Parsed numericValue: ".concat(numericValue));
            var finalNewMin = parseFloat(_this3.config.minValue);
            var finalNewMax = _this3.config.isSingleHandle ? parseFloat(_this3.config.maxRange) : parseFloat(_this3.config.maxValue);
            var sourceOfChange = null;
            if (_this3.config.isSingleHandle) {
              finalNewMin = numericValue;
              sourceOfChange = inputType === 'min' ? 'minInput' : 'maxInput';
              _this3._log("[INPUT_CHANGE] Single Handle: finalNewMin from input: ".concat(finalNewMin, ", source: ").concat(sourceOfChange));
            } else {
              if (inputType === 'min') {
                finalNewMin = numericValue;
                sourceOfChange = 'minInput';
                _this3._log("[INPUT_CHANGE] Dual Handle (min input): newMinAttempt=".concat(finalNewMin, ". Current config.maxValue=").concat(finalNewMax, ". Source: ").concat(sourceOfChange));
              } else {
                finalNewMax = numericValue;
                sourceOfChange = 'maxInput';
                _this3._log("[INPUT_CHANGE] Dual Handle (max input): newMaxAttempt=".concat(finalNewMax, ". Current config.minValue=").concat(finalNewMin, ". Source: ").concat(sourceOfChange));
              }
            }
            _this3._log("[INPUT_CHANGE] Values to pass to _updateConfigAndDOM: min=".concat(finalNewMin, ", max=").concat(finalNewMax, ", source=").concat(sourceOfChange));
            _this3._updateConfigAndDOM([finalNewMin, finalNewMax], sourceOfChange);
          });
        });
      }
    }, {
      key: "updateInputFields",
      value: function updateInputFields() {
        if (!this.config.showInputs) return;
        this._log("[UPDATE_INPUT_FIELDS] Updating inputs. Config: min=".concat(this.config.minValue, ", max=").concat(this.config.maxValue, ", unit='").concat(this.config.unit, "'"));
        var currentUnit = this.config.unit || '';
        var formatValue = function formatValue(val) {
          return "".concat(Math.round(parseFloat(val))).concat(currentUnit);
        };
        if (this.minInputField) {
          this.minInputField.value = formatValue(this.config.minValue);
          this.adjustInputWidth(this.minInputField);
          this._log("[UPDATE_INPUT_FIELDS] Min input set to: '".concat(this.minInputField.value, "'"));
        }
        if (this.maxInputField) {
          var valueForMaxInput;
          if (!this.config.isSingleHandle) {
            valueForMaxInput = this.config.maxValue;
          } else {
            if (!this.minInputField || !this.container.querySelector('.slider-min-input')) {
              if (this.container.querySelector('.slider-max-input')) {
                valueForMaxInput = this.config.minValue;
              }
            }
          }
          if (typeof valueForMaxInput !== 'undefined') {
            this.maxInputField.value = formatValue(valueForMaxInput);
            this.adjustInputWidth(this.maxInputField);
            this._log("[UPDATE_INPUT_FIELDS] Max input set to: '".concat(this.maxInputField.value, "'"));
          } else {
            this._log('[UPDATE_INPUT_FIELDS] Max input not updated (valueForMaxInput is undefined for current config).');
          }
        }
      }
    }, {
      key: "adjustInputWidth",
      value: function adjustInputWidth(input) {
        if (input) {
          var length = Math.max(1, input.value.length || (input.placeholder ? input.placeholder.length : 0) || 1);
          input.style.width = "".concat(Math.max(1.5, length * 0.65), "em");
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
      var _this4 = this;
      this.filter.addEventListener('click', this.handleHeaderClick);
      this.groups.forEach(function (group) {
        var header = group.querySelector('.side-filter__header');
        if (header) {
          header.addEventListener('keydown', _this4.handleHeaderKeydown);
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
      var _this5 = this;
      this.filter.removeEventListener('click', this.handleHeaderClick);
      this.groups.forEach(function (group) {
        var header = group.querySelector('.side-filter__header');
        if (header) {
          header.removeEventListener('keydown', _this5.handleHeaderKeydown);
        }
      });
    }
  }, {
    key: "setCheckboxState",
    value: function setCheckboxState(checkboxId, isChecked) {
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