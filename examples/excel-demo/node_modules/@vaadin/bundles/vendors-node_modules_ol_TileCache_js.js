(self["webpackChunk_vaadin_bundles"] = self["webpackChunk_vaadin_bundles"] || []).push([["vendors-node_modules_ol_TileCache_js"],{

/***/ "./node_modules/ol/TileCache.js":
/*!**************************************!*\
  !*** ./node_modules/ol/TileCache.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _structs_LRUCache_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./structs/LRUCache.js */ "./node_modules/ol/structs/LRUCache.js");
/* harmony import */ var _tilecoord_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tilecoord.js */ "./node_modules/ol/tilecoord.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @module ol/TileCache
 */


var TileCache = /** @class */ (function (_super) {
    __extends(TileCache, _super);
    function TileCache() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {!Object<string, boolean>} usedTiles Used tiles.
     */
    TileCache.prototype.expireCache = function (usedTiles) {
        while (this.canExpireCache()) {
            var tile = this.peekLast();
            if (tile.getKey() in usedTiles) {
                break;
            }
            else {
                this.pop().release();
            }
        }
    };
    /**
     * Prune all tiles from the cache that don't have the same z as the newest tile.
     */
    TileCache.prototype.pruneExceptNewestZ = function () {
        if (this.getCount() === 0) {
            return;
        }
        var key = this.peekFirstKey();
        var tileCoord = (0,_tilecoord_js__WEBPACK_IMPORTED_MODULE_0__.fromKey)(key);
        var z = tileCoord[0];
        this.forEach(function (tile) {
            if (tile.tileCoord[0] !== z) {
                this.remove((0,_tilecoord_js__WEBPACK_IMPORTED_MODULE_0__.getKey)(tile.tileCoord));
                tile.release();
            }
        }.bind(this));
    };
    return TileCache;
}(_structs_LRUCache_js__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TileCache);
//# sourceMappingURL=TileCache.js.map

/***/ }),

/***/ "./node_modules/ol/structs/LRUCache.js":
/*!*********************************************!*\
  !*** ./node_modules/ol/structs/LRUCache.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _asserts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../asserts.js */ "./node_modules/ol/asserts.js");
/**
 * @module ol/structs/LRUCache
 */

/**
 * @typedef {Object} Entry
 * @property {string} key_ Key.
 * @property {Object} newer Newer.
 * @property {Object} older Older.
 * @property {*} value_ Value.
 */
/**
 * @classdesc
 * Implements a Least-Recently-Used cache where the keys do not conflict with
 * Object's properties (e.g. 'hasOwnProperty' is not allowed as a key). Expiring
 * items from the cache is the responsibility of the user.
 *
 * @fires import("../events/Event.js").default
 * @template T
 */
var LRUCache = /** @class */ (function () {
    /**
     * @param {number} [opt_highWaterMark] High water mark.
     */
    function LRUCache(opt_highWaterMark) {
        /**
         * Desired max cache size after expireCache(). If set to 0, no cache entries
         * will be pruned at all.
         * @type {number}
         */
        this.highWaterMark =
            opt_highWaterMark !== undefined ? opt_highWaterMark : 2048;
        /**
         * @private
         * @type {number}
         */
        this.count_ = 0;
        /**
         * @private
         * @type {!Object<string, Entry>}
         */
        this.entries_ = {};
        /**
         * @private
         * @type {?Entry}
         */
        this.oldest_ = null;
        /**
         * @private
         * @type {?Entry}
         */
        this.newest_ = null;
    }
    /**
     * @return {boolean} Can expire cache.
     */
    LRUCache.prototype.canExpireCache = function () {
        return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
    };
    /**
     * Expire the cache.
     * @param {!Object<string, boolean>} [keep] Keys to keep. To be implemented by subclasses.
     */
    LRUCache.prototype.expireCache = function (keep) {
        while (this.canExpireCache()) {
            this.pop();
        }
    };
    /**
     * FIXME empty description for jsdoc
     */
    LRUCache.prototype.clear = function () {
        this.count_ = 0;
        this.entries_ = {};
        this.oldest_ = null;
        this.newest_ = null;
    };
    /**
     * @param {string} key Key.
     * @return {boolean} Contains key.
     */
    LRUCache.prototype.containsKey = function (key) {
        return this.entries_.hasOwnProperty(key);
    };
    /**
     * @param {function(T, string, LRUCache<T>): ?} f The function
     *     to call for every entry from the oldest to the newer. This function takes
     *     3 arguments (the entry value, the entry key and the LRUCache object).
     *     The return value is ignored.
     */
    LRUCache.prototype.forEach = function (f) {
        var entry = this.oldest_;
        while (entry) {
            f(entry.value_, entry.key_, this);
            entry = entry.newer;
        }
    };
    /**
     * @param {string} key Key.
     * @param {*} [opt_options] Options (reserved for subclasses).
     * @return {T} Value.
     */
    LRUCache.prototype.get = function (key, opt_options) {
        var entry = this.entries_[key];
        (0,_asserts_js__WEBPACK_IMPORTED_MODULE_0__.assert)(entry !== undefined, 15); // Tried to get a value for a key that does not exist in the cache
        if (entry === this.newest_) {
            return entry.value_;
        }
        else if (entry === this.oldest_) {
            this.oldest_ = /** @type {Entry} */ (this.oldest_.newer);
            this.oldest_.older = null;
        }
        else {
            entry.newer.older = entry.older;
            entry.older.newer = entry.newer;
        }
        entry.newer = null;
        entry.older = this.newest_;
        this.newest_.newer = entry;
        this.newest_ = entry;
        return entry.value_;
    };
    /**
     * Remove an entry from the cache.
     * @param {string} key The entry key.
     * @return {T} The removed entry.
     */
    LRUCache.prototype.remove = function (key) {
        var entry = this.entries_[key];
        (0,_asserts_js__WEBPACK_IMPORTED_MODULE_0__.assert)(entry !== undefined, 15); // Tried to get a value for a key that does not exist in the cache
        if (entry === this.newest_) {
            this.newest_ = /** @type {Entry} */ (entry.older);
            if (this.newest_) {
                this.newest_.newer = null;
            }
        }
        else if (entry === this.oldest_) {
            this.oldest_ = /** @type {Entry} */ (entry.newer);
            if (this.oldest_) {
                this.oldest_.older = null;
            }
        }
        else {
            entry.newer.older = entry.older;
            entry.older.newer = entry.newer;
        }
        delete this.entries_[key];
        --this.count_;
        return entry.value_;
    };
    /**
     * @return {number} Count.
     */
    LRUCache.prototype.getCount = function () {
        return this.count_;
    };
    /**
     * @return {Array<string>} Keys.
     */
    LRUCache.prototype.getKeys = function () {
        var keys = new Array(this.count_);
        var i = 0;
        var entry;
        for (entry = this.newest_; entry; entry = entry.older) {
            keys[i++] = entry.key_;
        }
        return keys;
    };
    /**
     * @return {Array<T>} Values.
     */
    LRUCache.prototype.getValues = function () {
        var values = new Array(this.count_);
        var i = 0;
        var entry;
        for (entry = this.newest_; entry; entry = entry.older) {
            values[i++] = entry.value_;
        }
        return values;
    };
    /**
     * @return {T} Last value.
     */
    LRUCache.prototype.peekLast = function () {
        return this.oldest_.value_;
    };
    /**
     * @return {string} Last key.
     */
    LRUCache.prototype.peekLastKey = function () {
        return this.oldest_.key_;
    };
    /**
     * Get the key of the newest item in the cache.  Throws if the cache is empty.
     * @return {string} The newest key.
     */
    LRUCache.prototype.peekFirstKey = function () {
        return this.newest_.key_;
    };
    /**
     * @return {T} value Value.
     */
    LRUCache.prototype.pop = function () {
        var entry = this.oldest_;
        delete this.entries_[entry.key_];
        if (entry.newer) {
            entry.newer.older = null;
        }
        this.oldest_ = /** @type {Entry} */ (entry.newer);
        if (!this.oldest_) {
            this.newest_ = null;
        }
        --this.count_;
        return entry.value_;
    };
    /**
     * @param {string} key Key.
     * @param {T} value Value.
     */
    LRUCache.prototype.replace = function (key, value) {
        this.get(key); // update `newest_`
        this.entries_[key].value_ = value;
    };
    /**
     * @param {string} key Key.
     * @param {T} value Value.
     */
    LRUCache.prototype.set = function (key, value) {
        (0,_asserts_js__WEBPACK_IMPORTED_MODULE_0__.assert)(!(key in this.entries_), 16); // Tried to set a value for a key that is used already
        var entry = {
            key_: key,
            newer: null,
            older: this.newest_,
            value_: value,
        };
        if (!this.newest_) {
            this.oldest_ = entry;
        }
        else {
            this.newest_.newer = entry;
        }
        this.newest_ = entry;
        this.entries_[key] = entry;
        ++this.count_;
    };
    /**
     * Set a maximum number of entries for the cache.
     * @param {number} size Cache size.
     * @api
     */
    LRUCache.prototype.setSize = function (size) {
        this.highWaterMark = size;
    };
    return LRUCache;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LRUCache);
//# sourceMappingURL=LRUCache.js.map

/***/ }),

/***/ "./node_modules/ol/tilecoord.js":
/*!**************************************!*\
  !*** ./node_modules/ol/tilecoord.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createOrUpdate": () => (/* binding */ createOrUpdate),
/* harmony export */   "fromKey": () => (/* binding */ fromKey),
/* harmony export */   "getCacheKeyForTileKey": () => (/* binding */ getCacheKeyForTileKey),
/* harmony export */   "getKey": () => (/* binding */ getKey),
/* harmony export */   "getKeyZXY": () => (/* binding */ getKeyZXY),
/* harmony export */   "hash": () => (/* binding */ hash),
/* harmony export */   "withinExtentAndZ": () => (/* binding */ withinExtentAndZ)
/* harmony export */ });
/**
 * @module ol/tilecoord
 */
/**
 * An array of three numbers representing the location of a tile in a tile
 * grid. The order is `z` (zoom level), `x` (column), and `y` (row).
 * @typedef {Array<number>} TileCoord
 * @api
 */
/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {TileCoord} [opt_tileCoord] Tile coordinate.
 * @return {TileCoord} Tile coordinate.
 */
function createOrUpdate(z, x, y, opt_tileCoord) {
    if (opt_tileCoord !== undefined) {
        opt_tileCoord[0] = z;
        opt_tileCoord[1] = x;
        opt_tileCoord[2] = y;
        return opt_tileCoord;
    }
    else {
        return [z, x, y];
    }
}
/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {string} Key.
 */
function getKeyZXY(z, x, y) {
    return z + '/' + x + '/' + y;
}
/**
 * Get the key for a tile coord.
 * @param {TileCoord} tileCoord The tile coord.
 * @return {string} Key.
 */
function getKey(tileCoord) {
    return getKeyZXY(tileCoord[0], tileCoord[1], tileCoord[2]);
}
/**
 * Get the tile cache key for a tile key obtained through `tile.getKey()`.
 * @param {string} tileKey The tile key.
 * @return {string} The cache key.
 */
function getCacheKeyForTileKey(tileKey) {
    var _a = tileKey
        .substring(tileKey.lastIndexOf('/') + 1, tileKey.length)
        .split(',')
        .map(Number), z = _a[0], x = _a[1], y = _a[2];
    return getKeyZXY(z, x, y);
}
/**
 * Get a tile coord given a key.
 * @param {string} key The tile coord key.
 * @return {TileCoord} The tile coord.
 */
function fromKey(key) {
    return key.split('/').map(Number);
}
/**
 * @param {TileCoord} tileCoord Tile coord.
 * @return {number} Hash.
 */
function hash(tileCoord) {
    return (tileCoord[1] << tileCoord[0]) + tileCoord[2];
}
/**
 * @param {TileCoord} tileCoord Tile coordinate.
 * @param {!import("./tilegrid/TileGrid.js").default} tileGrid Tile grid.
 * @return {boolean} Tile coordinate is within extent and zoom level range.
 */
function withinExtentAndZ(tileCoord, tileGrid) {
    var z = tileCoord[0];
    var x = tileCoord[1];
    var y = tileCoord[2];
    if (tileGrid.getMinZoom() > z || z > tileGrid.getMaxZoom()) {
        return false;
    }
    var tileRange = tileGrid.getFullTileRange(z);
    if (!tileRange) {
        return true;
    }
    else {
        return tileRange.containsXY(x, y);
    }
}
//# sourceMappingURL=tilecoord.js.map

/***/ })

}])
//# sourceMappingURL=vendors-node_modules_ol_TileCache_js.js.map