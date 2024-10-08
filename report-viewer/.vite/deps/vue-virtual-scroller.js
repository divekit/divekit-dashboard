import {
  Fragment,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createVNode,
  guardReactiveProps,
  h,
  markRaw,
  mergeProps,
  nextTick,
  normalizeClass,
  normalizeProps,
  normalizeStyle,
  openBlock,
  popScopeId,
  pushScopeId,
  reactive,
  renderList,
  renderSlot,
  resolveComponent,
  resolveDirective,
  resolveDynamicComponent,
  shallowReactive,
  toHandlers,
  withCtx,
  withDirectives,
  withScopeId
} from "./chunk-XSWAMETM.js";
import "./chunk-LQ2VYIYD.js";

// node_modules/vue-resize/dist/vue-resize.esm.js
function getInternetExplorerVersion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }
  var trident = ua.indexOf("Trident/");
  if (trident > 0) {
    var rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }
  var edge = ua.indexOf("Edge/");
  if (edge > 0) {
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }
  return -1;
}
var isIE;
function initCompat() {
  if (!initCompat.init) {
    initCompat.init = true;
    isIE = getInternetExplorerVersion() !== -1;
  }
}
var script = {
  name: "ResizeObserver",
  props: {
    emitOnMount: {
      type: Boolean,
      default: false
    },
    ignoreWidth: {
      type: Boolean,
      default: false
    },
    ignoreHeight: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "notify"
  ],
  mounted() {
    initCompat();
    nextTick(() => {
      this._w = this.$el.offsetWidth;
      this._h = this.$el.offsetHeight;
      if (this.emitOnMount) {
        this.emitSize();
      }
    });
    const object = document.createElement("object");
    this._resizeObject = object;
    object.setAttribute("aria-hidden", "true");
    object.setAttribute("tabindex", -1);
    object.onload = this.addResizeHandlers;
    object.type = "text/html";
    if (isIE) {
      this.$el.appendChild(object);
    }
    object.data = "about:blank";
    if (!isIE) {
      this.$el.appendChild(object);
    }
  },
  beforeUnmount() {
    this.removeResizeHandlers();
  },
  methods: {
    compareAndNotify() {
      if (!this.ignoreWidth && this._w !== this.$el.offsetWidth || !this.ignoreHeight && this._h !== this.$el.offsetHeight) {
        this._w = this.$el.offsetWidth;
        this._h = this.$el.offsetHeight;
        this.emitSize();
      }
    },
    emitSize() {
      this.$emit("notify", {
        width: this._w,
        height: this._h
      });
    },
    addResizeHandlers() {
      this._resizeObject.contentDocument.defaultView.addEventListener("resize", this.compareAndNotify);
      this.compareAndNotify();
    },
    removeResizeHandlers() {
      if (this._resizeObject && this._resizeObject.onload) {
        if (!isIE && this._resizeObject.contentDocument) {
          this._resizeObject.contentDocument.defaultView.removeEventListener("resize", this.compareAndNotify);
        }
        this.$el.removeChild(this._resizeObject);
        this._resizeObject.onload = null;
        this._resizeObject = null;
      }
    }
  }
};
var _withId = withScopeId("data-v-b329ee4c");
pushScopeId("data-v-b329ee4c");
var _hoisted_1 = {
  class: "resize-observer",
  tabindex: "-1"
};
popScopeId();
var render = _withId((_ctx, _cache, $props, $setup, $data, $options) => {
  return openBlock(), createBlock("div", _hoisted_1);
});
script.render = render;
script.__scopeId = "data-v-b329ee4c";
script.__file = "src/components/ResizeObserver.vue";

// node_modules/vue-observe-visibility/dist/vue-observe-visibility.esm.js
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props2) {
  for (var i = 0; i < props2.length; i++) {
    var descriptor = props2[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
    return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function processOptions(value) {
  var options;
  if (typeof value === "function") {
    options = {
      callback: value
    };
  } else {
    options = value;
  }
  return options;
}
function throttle(callback, delay) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var timeout;
  var lastState;
  var currentArgs;
  var throttled = function throttled2(state) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    currentArgs = args;
    if (timeout && state === lastState)
      return;
    var leading = options.leading;
    if (typeof leading === "function") {
      leading = leading(state, lastState);
    }
    if ((!timeout || state !== lastState) && leading) {
      callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
    }
    lastState = state;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
      timeout = 0;
    }, delay);
  };
  throttled._clear = function() {
    clearTimeout(timeout);
    timeout = null;
  };
  return throttled;
}
function deepEqual(val1, val2) {
  if (val1 === val2)
    return true;
  if (_typeof(val1) === "object") {
    for (var key in val1) {
      if (!deepEqual(val1[key], val2[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}
var VisibilityState = function() {
  function VisibilityState2(el, options, vnode) {
    _classCallCheck(this, VisibilityState2);
    this.el = el;
    this.observer = null;
    this.frozen = false;
    this.createObserver(options, vnode);
  }
  _createClass(VisibilityState2, [{
    key: "createObserver",
    value: function createObserver(options, vnode) {
      var _this = this;
      if (this.observer) {
        this.destroyObserver();
      }
      if (this.frozen)
        return;
      this.options = processOptions(options);
      this.callback = function(result, entry) {
        _this.options.callback(result, entry);
        if (result && _this.options.once) {
          _this.frozen = true;
          _this.destroyObserver();
        }
      };
      if (this.callback && this.options.throttle) {
        var _ref = this.options.throttleOptions || {}, _leading = _ref.leading;
        this.callback = throttle(this.callback, this.options.throttle, {
          leading: function leading(state) {
            return _leading === "both" || _leading === "visible" && state || _leading === "hidden" && !state;
          }
        });
      }
      this.oldResult = void 0;
      this.observer = new IntersectionObserver(function(entries) {
        var entry = entries[0];
        if (entries.length > 1) {
          var intersectingEntry = entries.find(function(e) {
            return e.isIntersecting;
          });
          if (intersectingEntry) {
            entry = intersectingEntry;
          }
        }
        if (_this.callback) {
          var result = entry.isIntersecting && entry.intersectionRatio >= _this.threshold;
          if (result === _this.oldResult)
            return;
          _this.oldResult = result;
          _this.callback(result, entry);
        }
      }, this.options.intersection);
      nextTick(function() {
        if (_this.observer) {
          _this.observer.observe(_this.el);
        }
      });
    }
  }, {
    key: "destroyObserver",
    value: function destroyObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      if (this.callback && this.callback._clear) {
        this.callback._clear();
        this.callback = null;
      }
    }
  }, {
    key: "threshold",
    get: function get() {
      return this.options.intersection && typeof this.options.intersection.threshold === "number" ? this.options.intersection.threshold : 0;
    }
  }]);
  return VisibilityState2;
}();
function beforeMount(el, _ref2, vnode) {
  var value = _ref2.value;
  if (!value)
    return;
  if (typeof IntersectionObserver === "undefined") {
    console.warn("[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill");
  } else {
    var state = new VisibilityState(el, value, vnode);
    el._vue_visibilityState = state;
  }
}
function updated(el, _ref3, vnode) {
  var value = _ref3.value, oldValue = _ref3.oldValue;
  if (deepEqual(value, oldValue))
    return;
  var state = el._vue_visibilityState;
  if (!value) {
    unmounted(el);
    return;
  }
  if (state) {
    state.createObserver(value, vnode);
  } else {
    beforeMount(el, {
      value
    }, vnode);
  }
}
function unmounted(el) {
  var state = el._vue_visibilityState;
  if (state) {
    state.destroyObserver();
    delete el._vue_visibilityState;
  }
}
var ObserveVisibility = {
  beforeMount,
  updated,
  unmounted
};

// node_modules/mitt/dist/mitt.es.js
function mitt_es_default(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
    var i = n.get(t);
    i && i.push(e) || n.set(t, [e]);
  }, off: function(t, e) {
    var i = n.get(t);
    i && i.splice(i.indexOf(e) >>> 0, 1);
  }, emit: function(t, e) {
    (n.get(t) || []).slice().map(function(n2) {
      n2(e);
    }), (n.get("*") || []).slice().map(function(n2) {
      n2(t, e);
    });
  } };
}

// node_modules/vue-virtual-scroller/dist/vue-virtual-scroller.esm.js
var config = {
  itemsLimit: 1e3
};
var regex = /(auto|scroll)/;
function parents(node, ps) {
  if (node.parentNode === null) {
    return ps;
  }
  return parents(node.parentNode, ps.concat([node]));
}
var style = function style2(node, prop) {
  return getComputedStyle(node, null).getPropertyValue(prop);
};
var overflow = function overflow2(node) {
  return style(node, "overflow") + style(node, "overflow-y") + style(node, "overflow-x");
};
var scroll = function scroll2(node) {
  return regex.test(overflow(node));
};
function getScrollParent(node) {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return;
  }
  var ps = parents(node.parentNode, []);
  for (var i = 0; i < ps.length; i += 1) {
    if (scroll(ps[i])) {
      return ps[i];
    }
  }
  return document.scrollingElement || document.documentElement;
}
function _typeof2(obj) {
  "@babel/helpers - typeof";
  return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof2(obj);
}
var props = {
  items: {
    type: Array,
    required: true
  },
  keyField: {
    type: String,
    default: "id"
  },
  direction: {
    type: String,
    default: "vertical",
    validator: function validator(value) {
      return ["vertical", "horizontal"].includes(value);
    }
  },
  listTag: {
    type: String,
    default: "div"
  },
  itemTag: {
    type: String,
    default: "div"
  }
};
function simpleArray() {
  return this.items.length && _typeof2(this.items[0]) !== "object";
}
var supportsPassive = false;
if (typeof window !== "undefined") {
  supportsPassive = false;
  try {
    opts = Object.defineProperty({}, "passive", {
      get: function get() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {
  }
}
var opts;
var uid = 0;
var script$2 = {
  name: "RecycleScroller",
  components: {
    ResizeObserver: script
  },
  directives: {
    ObserveVisibility
  },
  props: {
    ...props,
    itemSize: {
      type: Number,
      default: null
    },
    gridItems: {
      type: Number,
      default: void 0
    },
    itemSecondarySize: {
      type: Number,
      default: void 0
    },
    minItemSize: {
      type: [Number, String],
      default: null
    },
    sizeField: {
      type: String,
      default: "size"
    },
    typeField: {
      type: String,
      default: "type"
    },
    buffer: {
      type: Number,
      default: 200
    },
    pageMode: {
      type: Boolean,
      default: false
    },
    prerender: {
      type: Number,
      default: 0
    },
    emitUpdate: {
      type: Boolean,
      default: false
    },
    updateInterval: {
      type: Number,
      default: 0
    },
    skipHover: {
      type: Boolean,
      default: false
    },
    listTag: {
      type: String,
      default: "div"
    },
    itemTag: {
      type: String,
      default: "div"
    },
    listClass: {
      type: [String, Object, Array],
      default: ""
    },
    itemClass: {
      type: [String, Object, Array],
      default: ""
    }
  },
  emits: [
    "resize",
    "visible",
    "hidden",
    "update",
    "scroll-start",
    "scroll-end"
  ],
  data() {
    return {
      pool: [],
      totalSize: 0,
      ready: false,
      hoverKey: null
    };
  },
  computed: {
    sizes() {
      if (this.itemSize === null) {
        const sizes = {
          "-1": { accumulator: 0 }
        };
        const items = this.items;
        const field = this.sizeField;
        const minItemSize = this.minItemSize;
        let computedMinSize = 1e4;
        let accumulator = 0;
        let current;
        for (let i = 0, l = items.length; i < l; i++) {
          current = items[i][field] || minItemSize;
          if (current < computedMinSize) {
            computedMinSize = current;
          }
          accumulator += current;
          sizes[i] = { accumulator, size: current };
        }
        this.$_computedMinItemSize = computedMinSize;
        return sizes;
      }
      return [];
    },
    simpleArray,
    itemIndexByKey() {
      const { keyField, items } = this;
      const result = {};
      for (let i = 0, l = items.length; i < l; i++) {
        result[items[i][keyField]] = i;
      }
      return result;
    }
  },
  watch: {
    items() {
      this.updateVisibleItems(true);
    },
    pageMode() {
      this.applyPageMode();
      this.updateVisibleItems(false);
    },
    sizes: {
      handler() {
        this.updateVisibleItems(false);
      },
      deep: true
    },
    gridItems() {
      this.updateVisibleItems(true);
    },
    itemSecondarySize() {
      this.updateVisibleItems(true);
    }
  },
  created() {
    this.$_startIndex = 0;
    this.$_endIndex = 0;
    this.$_views = /* @__PURE__ */ new Map();
    this.$_unusedViews = /* @__PURE__ */ new Map();
    this.$_scrollDirty = false;
    this.$_lastUpdateScrollPosition = 0;
    if (this.prerender) {
      this.$_prerender = true;
      this.updateVisibleItems(false);
    }
    if (this.gridItems && !this.itemSize) {
      console.error("[vue-recycle-scroller] You must provide an itemSize when using gridItems");
    }
  },
  mounted() {
    this.applyPageMode();
    this.$nextTick(() => {
      this.$_prerender = false;
      this.updateVisibleItems(true);
      this.ready = true;
    });
  },
  activated() {
    const lastPosition = this.$_lastUpdateScrollPosition;
    if (typeof lastPosition === "number") {
      this.$nextTick(() => {
        this.scrollToPosition(lastPosition);
      });
    }
  },
  beforeUnmount() {
    this.removeListeners();
  },
  methods: {
    addView(pool, index, item, key, type) {
      const nr = markRaw({
        id: uid++,
        index,
        used: true,
        key,
        type
      });
      const view = shallowReactive({
        item,
        position: 0,
        nr
      });
      pool.push(view);
      return view;
    },
    unuseView(view, fake = false) {
      const unusedViews = this.$_unusedViews;
      const type = view.nr.type;
      let unusedPool = unusedViews.get(type);
      if (!unusedPool) {
        unusedPool = [];
        unusedViews.set(type, unusedPool);
      }
      unusedPool.push(view);
      if (!fake) {
        view.nr.used = false;
        view.position = -9999;
      }
    },
    handleResize() {
      this.$emit("resize");
      if (this.ready)
        this.updateVisibleItems(false);
    },
    handleScroll(event) {
      if (!this.$_scrollDirty) {
        this.$_scrollDirty = true;
        if (this.$_updateTimeout)
          return;
        const requestUpdate = () => requestAnimationFrame(() => {
          this.$_scrollDirty = false;
          const { continuous } = this.updateVisibleItems(false, true);
          if (!continuous) {
            clearTimeout(this.$_refreshTimout);
            this.$_refreshTimout = setTimeout(this.handleScroll, this.updateInterval + 100);
          }
        });
        requestUpdate();
        if (this.updateInterval) {
          this.$_updateTimeout = setTimeout(() => {
            this.$_updateTimeout = 0;
            if (this.$_scrollDirty)
              requestUpdate();
          }, this.updateInterval);
        }
      }
    },
    handleVisibilityChange(isVisible, entry) {
      if (this.ready) {
        if (isVisible || entry.boundingClientRect.width !== 0 || entry.boundingClientRect.height !== 0) {
          this.$emit("visible");
          requestAnimationFrame(() => {
            this.updateVisibleItems(false);
          });
        } else {
          this.$emit("hidden");
        }
      }
    },
    updateVisibleItems(checkItem, checkPositionDiff = false) {
      const itemSize = this.itemSize;
      const gridItems = this.gridItems || 1;
      const itemSecondarySize = this.itemSecondarySize || itemSize;
      const minItemSize = this.$_computedMinItemSize;
      const typeField = this.typeField;
      const keyField = this.simpleArray ? null : this.keyField;
      const items = this.items;
      const count = items.length;
      const sizes = this.sizes;
      const views = this.$_views;
      const unusedViews = this.$_unusedViews;
      const pool = this.pool;
      const itemIndexByKey = this.itemIndexByKey;
      let startIndex, endIndex;
      let totalSize;
      let visibleStartIndex, visibleEndIndex;
      if (!count) {
        startIndex = endIndex = visibleStartIndex = visibleEndIndex = totalSize = 0;
      } else if (this.$_prerender) {
        startIndex = visibleStartIndex = 0;
        endIndex = visibleEndIndex = Math.min(this.prerender, items.length);
        totalSize = null;
      } else {
        const scroll3 = this.getScroll();
        if (checkPositionDiff) {
          let positionDiff = scroll3.start - this.$_lastUpdateScrollPosition;
          if (positionDiff < 0)
            positionDiff = -positionDiff;
          if (itemSize === null && positionDiff < minItemSize || positionDiff < itemSize) {
            return {
              continuous: true
            };
          }
        }
        this.$_lastUpdateScrollPosition = scroll3.start;
        const buffer = this.buffer;
        scroll3.start -= buffer;
        scroll3.end += buffer;
        let beforeSize = 0;
        if (this.$refs.before) {
          beforeSize = this.$refs.before.scrollHeight;
          scroll3.start -= beforeSize;
        }
        if (this.$refs.after) {
          const afterSize = this.$refs.after.scrollHeight;
          scroll3.end += afterSize;
        }
        if (itemSize === null) {
          let h2;
          let a = 0;
          let b = count - 1;
          let i = ~~(count / 2);
          let oldI;
          do {
            oldI = i;
            h2 = sizes[i].accumulator;
            if (h2 < scroll3.start) {
              a = i;
            } else if (i < count - 1 && sizes[i + 1].accumulator > scroll3.start) {
              b = i;
            }
            i = ~~((a + b) / 2);
          } while (i !== oldI);
          i < 0 && (i = 0);
          startIndex = i;
          totalSize = sizes[count - 1].accumulator;
          for (endIndex = i; endIndex < count && sizes[endIndex].accumulator < scroll3.end; endIndex++)
            ;
          if (endIndex === -1) {
            endIndex = items.length - 1;
          } else {
            endIndex++;
            endIndex > count && (endIndex = count);
          }
          for (visibleStartIndex = startIndex; visibleStartIndex < count && beforeSize + sizes[visibleStartIndex].accumulator < scroll3.start; visibleStartIndex++)
            ;
          for (visibleEndIndex = visibleStartIndex; visibleEndIndex < count && beforeSize + sizes[visibleEndIndex].accumulator < scroll3.end; visibleEndIndex++)
            ;
        } else {
          startIndex = ~~(scroll3.start / itemSize * gridItems);
          const remainer = startIndex % gridItems;
          startIndex -= remainer;
          endIndex = Math.ceil(scroll3.end / itemSize * gridItems);
          visibleStartIndex = Math.max(0, Math.floor((scroll3.start - beforeSize) / itemSize * gridItems));
          visibleEndIndex = Math.floor((scroll3.end - beforeSize) / itemSize * gridItems);
          startIndex < 0 && (startIndex = 0);
          endIndex > count && (endIndex = count);
          visibleStartIndex < 0 && (visibleStartIndex = 0);
          visibleEndIndex > count && (visibleEndIndex = count);
          totalSize = Math.ceil(count / gridItems) * itemSize;
        }
      }
      if (endIndex - startIndex > config.itemsLimit) {
        this.itemsLimitError();
      }
      this.totalSize = totalSize;
      let view;
      const continuous = startIndex <= this.$_endIndex && endIndex >= this.$_startIndex;
      if (continuous) {
        for (let i = 0, l = pool.length; i < l; i++) {
          view = pool[i];
          if (view.nr.used) {
            if (checkItem) {
              view.nr.index = itemIndexByKey[view.item[keyField]];
            }
            if (view.nr.index == null || view.nr.index < startIndex || view.nr.index >= endIndex) {
              this.unuseView(view);
            }
          }
        }
      }
      const unusedIndex = continuous ? null : /* @__PURE__ */ new Map();
      let item, type;
      let v;
      for (let i = startIndex; i < endIndex; i++) {
        item = items[i];
        const key = keyField ? item[keyField] : item;
        if (key == null) {
          throw new Error(`Key is ${key} on item (keyField is '${keyField}')`);
        }
        view = views.get(key);
        if (!itemSize && !sizes[i].size) {
          if (view)
            this.unuseView(view);
          continue;
        }
        type = item[typeField];
        let unusedPool = unusedViews.get(type);
        let newlyUsedView = false;
        if (!view) {
          if (continuous) {
            if (unusedPool && unusedPool.length) {
              view = unusedPool.pop();
            } else {
              view = this.addView(pool, i, item, key, type);
            }
          } else {
            v = unusedIndex.get(type) || 0;
            if (!unusedPool || v >= unusedPool.length) {
              view = this.addView(pool, i, item, key, type);
              this.unuseView(view, true);
              unusedPool = unusedViews.get(type);
            }
            view = unusedPool[v];
            unusedIndex.set(type, v + 1);
          }
          views.delete(view.nr.key);
          view.nr.used = true;
          view.nr.index = i;
          view.nr.key = key;
          view.nr.type = type;
          views.set(key, view);
          newlyUsedView = true;
        } else {
          if (!view.nr.used) {
            view.nr.used = true;
            newlyUsedView = true;
            if (unusedPool) {
              const index = unusedPool.indexOf(view);
              if (index !== -1)
                unusedPool.splice(index, 1);
            }
          }
        }
        view.item = item;
        if (newlyUsedView) {
          if (i === items.length - 1)
            this.$emit("scroll-end");
          if (i === 0)
            this.$emit("scroll-start");
        }
        if (itemSize === null) {
          view.position = sizes[i - 1].accumulator;
          view.offset = 0;
        } else {
          view.position = Math.floor(i / gridItems) * itemSize;
          view.offset = i % gridItems * itemSecondarySize;
        }
      }
      this.$_startIndex = startIndex;
      this.$_endIndex = endIndex;
      if (this.emitUpdate)
        this.$emit("update", startIndex, endIndex, visibleStartIndex, visibleEndIndex);
      clearTimeout(this.$_sortTimer);
      this.$_sortTimer = setTimeout(this.sortViews, this.updateInterval + 300);
      return {
        continuous
      };
    },
    getListenerTarget() {
      let target = getScrollParent(this.$el);
      if (window.document && (target === window.document.documentElement || target === window.document.body)) {
        target = window;
      }
      return target;
    },
    getScroll() {
      const { $el: el, direction } = this;
      const isVertical = direction === "vertical";
      let scrollState;
      if (this.pageMode) {
        const bounds = el.getBoundingClientRect();
        const boundsSize = isVertical ? bounds.height : bounds.width;
        let start = -(isVertical ? bounds.top : bounds.left);
        let size = isVertical ? window.innerHeight : window.innerWidth;
        if (start < 0) {
          size += start;
          start = 0;
        }
        if (start + size > boundsSize) {
          size = boundsSize - start;
        }
        scrollState = {
          start,
          end: start + size
        };
      } else if (isVertical) {
        scrollState = {
          start: el.scrollTop,
          end: el.scrollTop + el.clientHeight
        };
      } else {
        scrollState = {
          start: el.scrollLeft,
          end: el.scrollLeft + el.clientWidth
        };
      }
      return scrollState;
    },
    applyPageMode() {
      if (this.pageMode) {
        this.addListeners();
      } else {
        this.removeListeners();
      }
    },
    addListeners() {
      this.listenerTarget = this.getListenerTarget();
      this.listenerTarget.addEventListener("scroll", this.handleScroll, supportsPassive ? {
        passive: true
      } : false);
      this.listenerTarget.addEventListener("resize", this.handleResize);
    },
    removeListeners() {
      if (!this.listenerTarget) {
        return;
      }
      this.listenerTarget.removeEventListener("scroll", this.handleScroll);
      this.listenerTarget.removeEventListener("resize", this.handleResize);
      this.listenerTarget = null;
    },
    scrollToItem(index) {
      let scroll3;
      const gridItems = this.gridItems || 1;
      if (this.itemSize === null) {
        scroll3 = index > 0 ? this.sizes[index - 1].accumulator : 0;
      } else {
        scroll3 = Math.floor(index / gridItems) * this.itemSize;
      }
      this.scrollToPosition(scroll3);
    },
    scrollToPosition(position) {
      const direction = this.direction === "vertical" ? { scroll: "scrollTop", start: "top" } : { scroll: "scrollLeft", start: "left" };
      let viewport;
      let scrollDirection;
      let scrollDistance;
      if (this.pageMode) {
        const viewportEl = getScrollParent(this.$el);
        const scrollTop = viewportEl.tagName === "HTML" ? 0 : viewportEl[direction.scroll];
        const bounds = viewportEl.getBoundingClientRect();
        const scroller = this.$el.getBoundingClientRect();
        const scrollerPosition = scroller[direction.start] - bounds[direction.start];
        viewport = viewportEl;
        scrollDirection = direction.scroll;
        scrollDistance = position + scrollTop + scrollerPosition;
      } else {
        viewport = this.$el;
        scrollDirection = direction.scroll;
        scrollDistance = position;
      }
      viewport[scrollDirection] = scrollDistance;
    },
    itemsLimitError() {
      setTimeout(() => {
        console.log("It seems the scroller element isn't scrolling, so it tries to render all the items at once.", "Scroller:", this.$el);
        console.log("Make sure the scroller has a fixed height (or width) and 'overflow-y' (or 'overflow-x') set to 'auto' so it can scroll correctly and only render the items visible in the scroll viewport.");
      });
      throw new Error("Rendered items limit reached");
    },
    sortViews() {
      this.pool.sort((viewA, viewB) => viewA.nr.index - viewB.nr.index);
    }
  }
};
var _hoisted_12 = {
  key: 0,
  ref: "before",
  class: "vue-recycle-scroller__slot"
};
var _hoisted_2 = {
  key: 1,
  ref: "after",
  class: "vue-recycle-scroller__slot"
};
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ResizeObserver = resolveComponent("ResizeObserver");
  const _directive_observe_visibility = resolveDirective("observe-visibility");
  return withDirectives((openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["vue-recycle-scroller", {
        ready: $data.ready,
        "page-mode": $props.pageMode,
        [`direction-${_ctx.direction}`]: true
      }]),
      onScrollPassive: _cache[0] || (_cache[0] = (...args) => $options.handleScroll && $options.handleScroll(...args))
    },
    [
      _ctx.$slots.before ? (openBlock(), createElementBlock(
        "div",
        _hoisted_12,
        [
          renderSlot(_ctx.$slots, "before")
        ],
        512
        /* NEED_PATCH */
      )) : createCommentVNode("v-if", true),
      (openBlock(), createBlock(resolveDynamicComponent($props.listTag), {
        ref: "wrapper",
        style: normalizeStyle({ [_ctx.direction === "vertical" ? "minHeight" : "minWidth"]: $data.totalSize + "px" }),
        class: normalizeClass(["vue-recycle-scroller__item-wrapper", $props.listClass])
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($data.pool, (view) => {
              return openBlock(), createBlock(resolveDynamicComponent($props.itemTag), mergeProps({
                key: view.nr.id,
                style: $data.ready ? {
                  transform: `translate${_ctx.direction === "vertical" ? "Y" : "X"}(${view.position}px) translate${_ctx.direction === "vertical" ? "X" : "Y"}(${view.offset}px)`,
                  width: $props.gridItems ? `${_ctx.direction === "vertical" ? $props.itemSecondarySize || $props.itemSize : $props.itemSize}px` : void 0,
                  height: $props.gridItems ? `${_ctx.direction === "horizontal" ? $props.itemSecondarySize || $props.itemSize : $props.itemSize}px` : void 0
                } : null,
                class: ["vue-recycle-scroller__item-view", [
                  $props.itemClass,
                  {
                    hover: !$props.skipHover && $data.hoverKey === view.nr.key
                  }
                ]]
              }, toHandlers($props.skipHover ? {} : {
                mouseenter: () => {
                  $data.hoverKey = view.nr.key;
                },
                mouseleave: () => {
                  $data.hoverKey = null;
                }
              })), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {
                    item: view.item,
                    index: view.nr.index,
                    active: view.nr.used
                  })
                ]),
                _: 2
                /* DYNAMIC */
              }, 1040, ["style", "class"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          renderSlot(_ctx.$slots, "empty")
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["style", "class"])),
      _ctx.$slots.after ? (openBlock(), createElementBlock(
        "div",
        _hoisted_2,
        [
          renderSlot(_ctx.$slots, "after")
        ],
        512
        /* NEED_PATCH */
      )) : createCommentVNode("v-if", true),
      createVNode(_component_ResizeObserver, { onNotify: $options.handleResize }, null, 8, ["onNotify"])
    ],
    34
    /* CLASS, HYDRATE_EVENTS */
  )), [
    [_directive_observe_visibility, $options.handleVisibilityChange]
  ]);
}
script$2.render = render$1;
script$2.__file = "src/components/RecycleScroller.vue";
var script$1 = {
  name: "DynamicScroller",
  components: {
    RecycleScroller: script$2
  },
  provide() {
    if (typeof ResizeObserver !== "undefined") {
      this.$_resizeObserver = new ResizeObserver((entries) => {
        requestAnimationFrame(() => {
          if (!Array.isArray(entries)) {
            return;
          }
          for (const entry of entries) {
            if (entry.target && entry.target.$_vs_onResize) {
              let width, height;
              if (entry.borderBoxSize) {
                const resizeObserverSize = entry.borderBoxSize[0];
                width = resizeObserverSize.inlineSize;
                height = resizeObserverSize.blockSize;
              } else {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
              }
              entry.target.$_vs_onResize(entry.target.$_vs_id, width, height);
            }
          }
        });
      });
    }
    return {
      vscrollData: this.vscrollData,
      vscrollParent: this,
      vscrollResizeObserver: this.$_resizeObserver
    };
  },
  inheritAttrs: false,
  props: {
    ...props,
    minItemSize: {
      type: [Number, String],
      required: true
    }
  },
  emits: [
    "resize",
    "visible"
  ],
  data() {
    return {
      vscrollData: {
        active: true,
        sizes: {},
        keyField: this.keyField,
        simpleArray: false
      }
    };
  },
  computed: {
    simpleArray,
    itemsWithSize() {
      const result = [];
      const { items, keyField, simpleArray: simpleArray2 } = this;
      const sizes = this.vscrollData.sizes;
      const l = items.length;
      for (let i = 0; i < l; i++) {
        const item = items[i];
        const id = simpleArray2 ? i : item[keyField];
        let size = sizes[id];
        if (typeof size === "undefined" && !this.$_undefinedMap[id]) {
          size = 0;
        }
        result.push({
          item,
          id,
          size
        });
      }
      return result;
    }
  },
  watch: {
    items() {
      this.forceUpdate();
    },
    simpleArray: {
      handler(value) {
        this.vscrollData.simpleArray = value;
      },
      immediate: true
    },
    direction(value) {
      this.forceUpdate(true);
    },
    itemsWithSize(next, prev) {
      const scrollTop = this.$el.scrollTop;
      let prevActiveTop = 0;
      let activeTop = 0;
      const length = Math.min(next.length, prev.length);
      for (let i = 0; i < length; i++) {
        if (prevActiveTop >= scrollTop) {
          break;
        }
        prevActiveTop += prev[i].size || this.minItemSize;
        activeTop += next[i].size || this.minItemSize;
      }
      const offset = activeTop - prevActiveTop;
      if (offset === 0) {
        return;
      }
      this.$el.scrollTop += offset;
    }
  },
  beforeCreate() {
    this.$_updates = [];
    this.$_undefinedSizes = 0;
    this.$_undefinedMap = {};
    this.$_events = mitt_es_default();
  },
  activated() {
    this.vscrollData.active = true;
  },
  deactivated() {
    this.vscrollData.active = false;
  },
  unmounted() {
    this.$_events.all.clear();
  },
  methods: {
    onScrollerResize() {
      const scroller = this.$refs.scroller;
      if (scroller) {
        this.forceUpdate();
      }
      this.$emit("resize");
    },
    onScrollerVisible() {
      this.$_events.emit("vscroll:update", { force: false });
      this.$emit("visible");
    },
    forceUpdate(clear = false) {
      if (clear || this.simpleArray) {
        this.vscrollData.sizes = {};
      }
      this.$_events.emit("vscroll:update", { force: true });
    },
    scrollToItem(index) {
      const scroller = this.$refs.scroller;
      if (scroller)
        scroller.scrollToItem(index);
    },
    getItemSize(item, index = void 0) {
      const id = this.simpleArray ? index != null ? index : this.items.indexOf(item) : item[this.keyField];
      return this.vscrollData.sizes[id] || 0;
    },
    scrollToBottom() {
      if (this.$_scrollingToBottom)
        return;
      this.$_scrollingToBottom = true;
      const el = this.$el;
      this.$nextTick(() => {
        el.scrollTop = el.scrollHeight + 5e3;
        const cb = () => {
          el.scrollTop = el.scrollHeight + 5e3;
          requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight + 5e3;
            if (this.$_undefinedSizes === 0) {
              this.$_scrollingToBottom = false;
            } else {
              requestAnimationFrame(cb);
            }
          });
        };
        requestAnimationFrame(cb);
      });
    }
  }
};
function render2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RecycleScroller = resolveComponent("RecycleScroller");
  return openBlock(), createBlock(_component_RecycleScroller, mergeProps({
    ref: "scroller",
    items: $options.itemsWithSize,
    "min-item-size": $props.minItemSize,
    direction: _ctx.direction,
    "key-field": "id",
    "list-tag": _ctx.listTag,
    "item-tag": _ctx.itemTag
  }, _ctx.$attrs, {
    onResize: $options.onScrollerResize,
    onVisible: $options.onScrollerVisible
  }), {
    default: withCtx(({ item: itemWithSize, index, active }) => [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({
        item: itemWithSize.item,
        index,
        active,
        itemWithSize
      })))
    ]),
    before: withCtx(() => [
      renderSlot(_ctx.$slots, "before")
    ]),
    after: withCtx(() => [
      renderSlot(_ctx.$slots, "after")
    ]),
    empty: withCtx(() => [
      renderSlot(_ctx.$slots, "empty")
    ]),
    _: 3
    /* FORWARDED */
  }, 16, ["items", "min-item-size", "direction", "list-tag", "item-tag", "onResize", "onVisible"]);
}
script$1.render = render2;
script$1.__file = "src/components/DynamicScroller.vue";
var script2 = {
  name: "DynamicScrollerItem",
  inject: [
    "vscrollData",
    "vscrollParent",
    "vscrollResizeObserver"
  ],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    item: {
      required: true
    },
    watchData: {
      type: Boolean,
      default: false
    },
    /**
     * Indicates if the view is actively used to display an item.
     */
    active: {
      type: Boolean,
      required: true
    },
    index: {
      type: Number,
      default: void 0
    },
    sizeDependencies: {
      type: [Array, Object],
      default: null
    },
    emitResize: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  emits: [
    "resize"
  ],
  computed: {
    id() {
      if (this.vscrollData.simpleArray)
        return this.index;
      if (this.vscrollData.keyField in this.item)
        return this.item[this.vscrollData.keyField];
      throw new Error(`keyField '${this.vscrollData.keyField}' not found in your item. You should set a valid keyField prop on your Scroller`);
    },
    size() {
      return this.vscrollData.sizes[this.id] || 0;
    },
    finalActive() {
      return this.active && this.vscrollData.active;
    }
  },
  watch: {
    watchData: "updateWatchData",
    id(value, oldValue) {
      this.$el.$_vs_id = this.id;
      if (!this.size) {
        this.onDataUpdate();
      }
      if (this.$_sizeObserved) {
        const oldSize = this.vscrollData.sizes[oldValue];
        const size = this.vscrollData.sizes[value];
        if (oldSize != null && oldSize !== size) {
          this.applySize(oldSize);
        }
      }
    },
    finalActive(value) {
      if (!this.size) {
        if (value) {
          if (!this.vscrollParent.$_undefinedMap[this.id]) {
            this.vscrollParent.$_undefinedSizes++;
            this.vscrollParent.$_undefinedMap[this.id] = true;
          }
        } else {
          if (this.vscrollParent.$_undefinedMap[this.id]) {
            this.vscrollParent.$_undefinedSizes--;
            this.vscrollParent.$_undefinedMap[this.id] = false;
          }
        }
      }
      if (this.vscrollResizeObserver) {
        if (value) {
          this.observeSize();
        } else {
          this.unobserveSize();
        }
      } else if (value && this.$_pendingVScrollUpdate === this.id) {
        this.updateSize();
      }
    }
  },
  created() {
    if (this.$isServer)
      return;
    this.$_forceNextVScrollUpdate = null;
    this.updateWatchData();
    if (!this.vscrollResizeObserver) {
      for (const k in this.sizeDependencies) {
        this.$watch(() => this.sizeDependencies[k], this.onDataUpdate);
      }
      this.vscrollParent.$_events.on("vscroll:update", this.onVscrollUpdate);
    }
  },
  mounted() {
    if (this.finalActive) {
      this.updateSize();
      this.observeSize();
    }
  },
  beforeUnmount() {
    this.vscrollParent.$_events.off("vscroll:update", this.onVscrollUpdate);
    this.unobserveSize();
  },
  methods: {
    updateSize() {
      if (this.finalActive) {
        if (this.$_pendingSizeUpdate !== this.id) {
          this.$_pendingSizeUpdate = this.id;
          this.$_forceNextVScrollUpdate = null;
          this.$_pendingVScrollUpdate = null;
          this.computeSize(this.id);
        }
      } else {
        this.$_forceNextVScrollUpdate = this.id;
      }
    },
    updateWatchData() {
      if (this.watchData && !this.vscrollResizeObserver) {
        this.$_watchData = this.$watch("item", () => {
          this.onDataUpdate();
        }, {
          deep: true
        });
      } else if (this.$_watchData) {
        this.$_watchData();
        this.$_watchData = null;
      }
    },
    onVscrollUpdate({ force }) {
      if (!this.finalActive && force) {
        this.$_pendingVScrollUpdate = this.id;
      }
      if (this.$_forceNextVScrollUpdate === this.id || force || !this.size) {
        this.updateSize();
      }
    },
    onDataUpdate() {
      this.updateSize();
    },
    computeSize(id) {
      this.$nextTick(() => {
        if (this.id === id) {
          const width = this.$el.offsetWidth;
          const height = this.$el.offsetHeight;
          this.applyWidthHeight(width, height);
        }
        this.$_pendingSizeUpdate = null;
      });
    },
    applyWidthHeight(width, height) {
      const size = ~~(this.vscrollParent.direction === "vertical" ? height : width);
      if (size && this.size !== size) {
        this.applySize(size);
      }
    },
    applySize(size) {
      if (this.vscrollParent.$_undefinedMap[this.id]) {
        this.vscrollParent.$_undefinedSizes--;
        this.vscrollParent.$_undefinedMap[this.id] = void 0;
      }
      this.vscrollData.sizes[this.id] = size;
      if (this.emitResize)
        this.$emit("resize", this.id);
    },
    observeSize() {
      if (!this.vscrollResizeObserver)
        return;
      if (this.$_sizeObserved)
        return;
      this.vscrollResizeObserver.observe(this.$el);
      this.$el.$_vs_id = this.id;
      this.$el.$_vs_onResize = this.onResize;
      this.$_sizeObserved = true;
    },
    unobserveSize() {
      if (!this.vscrollResizeObserver)
        return;
      if (!this.$_sizeObserved)
        return;
      this.vscrollResizeObserver.unobserve(this.$el);
      this.$el.$_vs_onResize = void 0;
      this.$_sizeObserved = false;
    },
    onResize(id, width, height) {
      if (this.id === id) {
        this.applyWidthHeight(width, height);
      }
    }
  },
  render() {
    return h(this.tag, this.$slots.default());
  }
};
script2.__file = "src/components/DynamicScrollerItem.vue";
function IdState() {
  var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref$idProp = _ref.idProp, idProp = _ref$idProp === void 0 ? function(vm) {
    return vm.item.id;
  } : _ref$idProp;
  var store = reactive({});
  return {
    data: function data() {
      return {
        idState: null
      };
    },
    created: function created() {
      var _this = this;
      this.$_id = null;
      if (typeof idProp === "function") {
        this.$_getId = function() {
          return idProp.call(_this, _this);
        };
      } else {
        this.$_getId = function() {
          return _this[idProp];
        };
      }
      this.$watch(this.$_getId, {
        handler: function handler(value) {
          var _this2 = this;
          this.$nextTick(function() {
            _this2.$_id = value;
          });
        },
        immediate: true
      });
      this.$_updateIdState();
    },
    beforeUpdate: function beforeUpdate() {
      this.$_updateIdState();
    },
    methods: {
      /**
       * Initialize an idState
       * @param {number|string} id Unique id for the data
       */
      $_idStateInit: function $_idStateInit(id) {
        var factory = this.$options.idState;
        if (typeof factory === "function") {
          var data = factory.call(this, this);
          store[id] = data;
          this.$_id = id;
          return data;
        } else {
          throw new Error("[mixin IdState] Missing `idState` function on component definition.");
        }
      },
      /**
       * Ensure idState is created and up-to-date
       */
      $_updateIdState: function $_updateIdState() {
        var id = this.$_getId();
        if (id == null) {
          console.warn("No id found for IdState with idProp: '".concat(idProp, "'."));
        }
        if (id !== this.$_id) {
          if (!store[id]) {
            this.$_idStateInit(id);
          }
          this.idState = store[id];
        }
      }
    }
  };
}
function registerComponents(app, prefix) {
  app.component("".concat(prefix, "recycle-scroller"), script$2);
  app.component("".concat(prefix, "RecycleScroller"), script$2);
  app.component("".concat(prefix, "dynamic-scroller"), script$1);
  app.component("".concat(prefix, "DynamicScroller"), script$1);
  app.component("".concat(prefix, "dynamic-scroller-item"), script2);
  app.component("".concat(prefix, "DynamicScrollerItem"), script2);
}
var plugin = {
  // eslint-disable-next-line no-undef
  version: "2.0.0-beta.8",
  install: function install(app, options) {
    var finalOptions = Object.assign({}, {
      installComponents: true,
      componentsPrefix: ""
    }, options);
    for (var key in finalOptions) {
      if (typeof finalOptions[key] !== "undefined") {
        config[key] = finalOptions[key];
      }
    }
    if (finalOptions.installComponents) {
      registerComponents(app, finalOptions.componentsPrefix);
    }
  }
};
export {
  script$1 as DynamicScroller,
  script2 as DynamicScrollerItem,
  IdState,
  script$2 as RecycleScroller,
  plugin as default
};
//# sourceMappingURL=vue-virtual-scroller.js.map
