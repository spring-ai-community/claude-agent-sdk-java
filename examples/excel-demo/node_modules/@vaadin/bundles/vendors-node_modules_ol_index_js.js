(self["webpackChunk_vaadin_bundles"] = self["webpackChunk_vaadin_bundles"] || []).push([["vendors-node_modules_ol_index_js"],{

/***/ "./node_modules/ol/ImageCanvas.js":
/*!****************************************!*\
  !*** ./node_modules/ol/ImageCanvas.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ImageBase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImageBase.js */ "./node_modules/ol/ImageBase.js");
/* harmony import */ var _ImageState_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageState.js */ "./node_modules/ol/ImageState.js");
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
 * @module ol/ImageCanvas
 */


/**
 * A function that is called to trigger asynchronous canvas drawing.  It is
 * called with a "done" callback that should be called when drawing is done.
 * If any error occurs during drawing, the "done" callback should be called with
 * that error.
 *
 * @typedef {function(function(Error=): void): void} Loader
 */
var ImageCanvas = /** @class */ (function (_super) {
    __extends(ImageCanvas, _super);
    /**
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {HTMLCanvasElement} canvas Canvas.
     * @param {Loader} [opt_loader] Optional loader function to
     *     support asynchronous canvas drawing.
     */
    function ImageCanvas(extent, resolution, pixelRatio, canvas, opt_loader) {
        var _this = this;
        var state = opt_loader !== undefined ? _ImageState_js__WEBPACK_IMPORTED_MODULE_0__["default"].IDLE : _ImageState_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOADED;
        _this = _super.call(this, extent, resolution, pixelRatio, state) || this;
        /**
         * Optional canvas loader function.
         * @type {?Loader}
         * @private
         */
        _this.loader_ = opt_loader !== undefined ? opt_loader : null;
        /**
         * @private
         * @type {HTMLCanvasElement}
         */
        _this.canvas_ = canvas;
        /**
         * @private
         * @type {?Error}
         */
        _this.error_ = null;
        return _this;
    }
    /**
     * Get any error associated with asynchronous rendering.
     * @return {?Error} Any error that occurred during rendering.
     */
    ImageCanvas.prototype.getError = function () {
        return this.error_;
    };
    /**
     * Handle async drawing complete.
     * @param {Error} [err] Any error during drawing.
     * @private
     */
    ImageCanvas.prototype.handleLoad_ = function (err) {
        if (err) {
            this.error_ = err;
            this.state = _ImageState_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERROR;
        }
        else {
            this.state = _ImageState_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOADED;
        }
        this.changed();
    };
    /**
     * Load not yet loaded URI.
     */
    ImageCanvas.prototype.load = function () {
        if (this.state == _ImageState_js__WEBPACK_IMPORTED_MODULE_0__["default"].IDLE) {
            this.state = _ImageState_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOADING;
            this.changed();
            this.loader_(this.handleLoad_.bind(this));
        }
    };
    /**
     * @return {HTMLCanvasElement} Canvas element.
     */
    ImageCanvas.prototype.getImage = function () {
        return this.canvas_;
    };
    return ImageCanvas;
}(_ImageBase_js__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageCanvas);
//# sourceMappingURL=ImageCanvas.js.map

/***/ }),

/***/ "./node_modules/ol/ImageTile.js":
/*!**************************************!*\
  !*** ./node_modules/ol/ImageTile.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Tile_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tile.js */ "./node_modules/ol/Tile.js");
/* harmony import */ var _TileState_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TileState.js */ "./node_modules/ol/TileState.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom.js */ "./node_modules/ol/dom.js");
/* harmony import */ var _Image_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Image.js */ "./node_modules/ol/Image.js");
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
 * @module ol/ImageTile
 */




var ImageTile = /** @class */ (function (_super) {
    __extends(ImageTile, _super);
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("./TileState.js").default} state State.
     * @param {string} src Image source URI.
     * @param {?string} crossOrigin Cross origin.
     * @param {import("./Tile.js").LoadFunction} tileLoadFunction Tile load function.
     * @param {import("./Tile.js").Options} [opt_options] Tile options.
     */
    function ImageTile(tileCoord, state, src, crossOrigin, tileLoadFunction, opt_options) {
        var _this = _super.call(this, tileCoord, state, opt_options) || this;
        /**
         * @private
         * @type {?string}
         */
        _this.crossOrigin_ = crossOrigin;
        /**
         * Image URI
         *
         * @private
         * @type {string}
         */
        _this.src_ = src;
        _this.key = src;
        /**
         * @private
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        _this.image_ = new Image();
        if (crossOrigin !== null) {
            _this.image_.crossOrigin = crossOrigin;
        }
        /**
         * @private
         * @type {?function():void}
         */
        _this.unlisten_ = null;
        /**
         * @private
         * @type {import("./Tile.js").LoadFunction}
         */
        _this.tileLoadFunction_ = tileLoadFunction;
        return _this;
    }
    /**
     * Get the HTML image element for this tile (may be a Canvas, Image, or Video).
     * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
     * @api
     */
    ImageTile.prototype.getImage = function () {
        return this.image_;
    };
    /**
     * Sets an HTML image element for this tile (may be a Canvas or preloaded Image).
     * @param {HTMLCanvasElement|HTMLImageElement} element Element.
     */
    ImageTile.prototype.setImage = function (element) {
        this.image_ = element;
        this.state = _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOADED;
        this.unlistenImage_();
        this.changed();
    };
    /**
     * Tracks loading or read errors.
     *
     * @private
     */
    ImageTile.prototype.handleImageError_ = function () {
        this.state = _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERROR;
        this.unlistenImage_();
        this.image_ = getBlankImage();
        this.changed();
    };
    /**
     * Tracks successful image load.
     *
     * @private
     */
    ImageTile.prototype.handleImageLoad_ = function () {
        var image = /** @type {HTMLImageElement} */ (this.image_);
        if (image.naturalWidth && image.naturalHeight) {
            this.state = _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOADED;
        }
        else {
            this.state = _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].EMPTY;
        }
        this.unlistenImage_();
        this.changed();
    };
    /**
     * Load not yet loaded URI.
     * @api
     */
    ImageTile.prototype.load = function () {
        if (this.state == _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERROR) {
            this.state = _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].IDLE;
            this.image_ = new Image();
            if (this.crossOrigin_ !== null) {
                this.image_.crossOrigin = this.crossOrigin_;
            }
        }
        if (this.state == _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].IDLE) {
            this.state = _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOADING;
            this.changed();
            this.tileLoadFunction_(this, this.src_);
            this.unlisten_ = (0,_Image_js__WEBPACK_IMPORTED_MODULE_1__.listenImage)(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this));
        }
    };
    /**
     * Discards event handlers which listen for load completion or errors.
     *
     * @private
     */
    ImageTile.prototype.unlistenImage_ = function () {
        if (this.unlisten_) {
            this.unlisten_();
            this.unlisten_ = null;
        }
    };
    return ImageTile;
}(_Tile_js__WEBPACK_IMPORTED_MODULE_2__["default"]));
/**
 * Get a 1-pixel blank image.
 * @return {HTMLCanvasElement} Blank image.
 */
function getBlankImage() {
    var ctx = (0,_dom_js__WEBPACK_IMPORTED_MODULE_3__.createCanvasContext2D)(1, 1);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 1, 1);
    return ctx.canvas;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageTile);
//# sourceMappingURL=ImageTile.js.map

/***/ }),

/***/ "./node_modules/ol/TileRange.js":
/*!**************************************!*\
  !*** ./node_modules/ol/TileRange.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createOrUpdate": () => (/* binding */ createOrUpdate),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @module ol/TileRange
 */
/**
 * A representation of a contiguous block of tiles.  A tile range is specified
 * by its min/max tile coordinates and is inclusive of coordinates.
 */
var TileRange = /** @class */ (function () {
    /**
     * @param {number} minX Minimum X.
     * @param {number} maxX Maximum X.
     * @param {number} minY Minimum Y.
     * @param {number} maxY Maximum Y.
     */
    function TileRange(minX, maxX, minY, maxY) {
        /**
         * @type {number}
         */
        this.minX = minX;
        /**
         * @type {number}
         */
        this.maxX = maxX;
        /**
         * @type {number}
         */
        this.minY = minY;
        /**
         * @type {number}
         */
        this.maxY = maxY;
    }
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @return {boolean} Contains tile coordinate.
     */
    TileRange.prototype.contains = function (tileCoord) {
        return this.containsXY(tileCoord[1], tileCoord[2]);
    };
    /**
     * @param {TileRange} tileRange Tile range.
     * @return {boolean} Contains.
     */
    TileRange.prototype.containsTileRange = function (tileRange) {
        return (this.minX <= tileRange.minX &&
            tileRange.maxX <= this.maxX &&
            this.minY <= tileRange.minY &&
            tileRange.maxY <= this.maxY);
    };
    /**
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @return {boolean} Contains coordinate.
     */
    TileRange.prototype.containsXY = function (x, y) {
        return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
    };
    /**
     * @param {TileRange} tileRange Tile range.
     * @return {boolean} Equals.
     */
    TileRange.prototype.equals = function (tileRange) {
        return (this.minX == tileRange.minX &&
            this.minY == tileRange.minY &&
            this.maxX == tileRange.maxX &&
            this.maxY == tileRange.maxY);
    };
    /**
     * @param {TileRange} tileRange Tile range.
     */
    TileRange.prototype.extend = function (tileRange) {
        if (tileRange.minX < this.minX) {
            this.minX = tileRange.minX;
        }
        if (tileRange.maxX > this.maxX) {
            this.maxX = tileRange.maxX;
        }
        if (tileRange.minY < this.minY) {
            this.minY = tileRange.minY;
        }
        if (tileRange.maxY > this.maxY) {
            this.maxY = tileRange.maxY;
        }
    };
    /**
     * @return {number} Height.
     */
    TileRange.prototype.getHeight = function () {
        return this.maxY - this.minY + 1;
    };
    /**
     * @return {import("./size.js").Size} Size.
     */
    TileRange.prototype.getSize = function () {
        return [this.getWidth(), this.getHeight()];
    };
    /**
     * @return {number} Width.
     */
    TileRange.prototype.getWidth = function () {
        return this.maxX - this.minX + 1;
    };
    /**
     * @param {TileRange} tileRange Tile range.
     * @return {boolean} Intersects.
     */
    TileRange.prototype.intersects = function (tileRange) {
        return (this.minX <= tileRange.maxX &&
            this.maxX >= tileRange.minX &&
            this.minY <= tileRange.maxY &&
            this.maxY >= tileRange.minY);
    };
    return TileRange;
}());
/**
 * @param {number} minX Minimum X.
 * @param {number} maxX Maximum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxY Maximum Y.
 * @param {TileRange} [tileRange] TileRange.
 * @return {TileRange} Tile range.
 */
function createOrUpdate(minX, maxX, minY, maxY, tileRange) {
    if (tileRange !== undefined) {
        tileRange.minX = minX;
        tileRange.maxX = maxX;
        tileRange.minY = minY;
        tileRange.maxY = maxY;
        return tileRange;
    }
    else {
        return new TileRange(minX, maxX, minY, maxY);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TileRange);
//# sourceMappingURL=TileRange.js.map

/***/ }),

/***/ "./node_modules/ol/VectorRenderTile.js":
/*!*********************************************!*\
  !*** ./node_modules/ol/VectorRenderTile.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Tile_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tile.js */ "./node_modules/ol/Tile.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom.js */ "./node_modules/ol/dom.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./node_modules/ol/util.js");
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
 * @module ol/VectorRenderTile
 */



/**
 * @typedef {Object} ReplayState
 * @property {boolean} dirty Dirty.
 * @property {null|import("./render.js").OrderFunction} renderedRenderOrder RenderedRenderOrder.
 * @property {number} renderedTileRevision RenderedTileRevision.
 * @property {number} renderedResolution RenderedResolution.
 * @property {number} renderedRevision RenderedRevision.
 * @property {number} renderedTileResolution RenderedTileResolution.
 * @property {number} renderedTileZ RenderedTileZ.
 */
/**
 * @type {Array<HTMLCanvasElement>}
 */
var canvasPool = [];
var VectorRenderTile = /** @class */ (function (_super) {
    __extends(VectorRenderTile, _super);
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("./TileState.js").default} state State.
     * @param {import("./tilecoord.js").TileCoord} urlTileCoord Wrapped tile coordinate for source urls.
     * @param {function(VectorRenderTile):Array<import("./VectorTile").default>} getSourceTiles Function
     * to get source tiles for this tile.
     */
    function VectorRenderTile(tileCoord, state, urlTileCoord, getSourceTiles) {
        var _this = _super.call(this, tileCoord, state, { transition: 0 }) || this;
        /**
         * @private
         * @type {!Object<string, CanvasRenderingContext2D>}
         */
        _this.context_ = {};
        /**
         * Executor groups by layer uid. Entries are read/written by the renderer.
         * @type {Object<string, Array<import("./render/canvas/ExecutorGroup.js").default>>}
         */
        _this.executorGroups = {};
        /**
         * Executor groups for decluttering, by layer uid. Entries are read/written by the renderer.
         * @type {Object<string, Array<import("./render/canvas/ExecutorGroup.js").default>>}
         */
        _this.declutterExecutorGroups = {};
        /**
         * Number of loading source tiles. Read/written by the source.
         * @type {number}
         */
        _this.loadingSourceTiles = 0;
        /**
         * @type {Object<number, ImageData>}
         */
        _this.hitDetectionImageData = {};
        /**
         * @private
         * @type {!Object<string, ReplayState>}
         */
        _this.replayState_ = {};
        /**
         * @type {Array<import("./VectorTile.js").default>}
         */
        _this.sourceTiles = [];
        /**
         * @type {Object<string, boolean>}
         */
        _this.errorTileKeys = {};
        /**
         * @type {number}
         */
        _this.wantedResolution;
        /**
         * @type {!function():Array<import("./VectorTile.js").default>}
         */
        _this.getSourceTiles = getSourceTiles.bind(undefined, _this);
        /**
         * @type {import("./tilecoord.js").TileCoord}
         */
        _this.wrappedTileCoord = urlTileCoord;
        return _this;
    }
    /**
     * @param {import("./layer/Layer.js").default} layer Layer.
     * @return {CanvasRenderingContext2D} The rendering context.
     */
    VectorRenderTile.prototype.getContext = function (layer) {
        var key = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.getUid)(layer);
        if (!(key in this.context_)) {
            this.context_[key] = (0,_dom_js__WEBPACK_IMPORTED_MODULE_1__.createCanvasContext2D)(1, 1, canvasPool);
        }
        return this.context_[key];
    };
    /**
     * @param {import("./layer/Layer.js").default} layer Layer.
     * @return {boolean} Tile has a rendering context for the given layer.
     */
    VectorRenderTile.prototype.hasContext = function (layer) {
        return (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.getUid)(layer) in this.context_;
    };
    /**
     * Get the Canvas for this tile.
     * @param {import("./layer/Layer.js").default} layer Layer.
     * @return {HTMLCanvasElement} Canvas.
     */
    VectorRenderTile.prototype.getImage = function (layer) {
        return this.hasContext(layer) ? this.getContext(layer).canvas : null;
    };
    /**
     * @param {import("./layer/Layer.js").default} layer Layer.
     * @return {ReplayState} The replay state.
     */
    VectorRenderTile.prototype.getReplayState = function (layer) {
        var key = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.getUid)(layer);
        if (!(key in this.replayState_)) {
            this.replayState_[key] = {
                dirty: false,
                renderedRenderOrder: null,
                renderedResolution: NaN,
                renderedRevision: -1,
                renderedTileResolution: NaN,
                renderedTileRevision: -1,
                renderedTileZ: -1,
            };
        }
        return this.replayState_[key];
    };
    /**
     * Load the tile.
     */
    VectorRenderTile.prototype.load = function () {
        this.getSourceTiles();
    };
    /**
     * Remove from the cache due to expiry
     */
    VectorRenderTile.prototype.release = function () {
        for (var key in this.context_) {
            canvasPool.push(this.context_[key].canvas);
            delete this.context_[key];
        }
        _super.prototype.release.call(this);
    };
    return VectorRenderTile;
}(_Tile_js__WEBPACK_IMPORTED_MODULE_2__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VectorRenderTile);
//# sourceMappingURL=VectorRenderTile.js.map

/***/ }),

/***/ "./node_modules/ol/VectorTile.js":
/*!***************************************!*\
  !*** ./node_modules/ol/VectorTile.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Tile_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tile.js */ "./node_modules/ol/Tile.js");
/* harmony import */ var _TileState_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TileState.js */ "./node_modules/ol/TileState.js");
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
 * @module ol/VectorTile
 */


var VectorTile = /** @class */ (function (_super) {
    __extends(VectorTile, _super);
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
     * @param {import("./TileState.js").default} state State.
     * @param {string} src Data source url.
     * @param {import("./format/Feature.js").default} format Feature format.
     * @param {import("./Tile.js").LoadFunction} tileLoadFunction Tile load function.
     * @param {import("./Tile.js").Options} [opt_options] Tile options.
     */
    function VectorTile(tileCoord, state, src, format, tileLoadFunction, opt_options) {
        var _this = _super.call(this, tileCoord, state, opt_options) || this;
        /**
         * Extent of this tile; set by the source.
         * @type {import("./extent.js").Extent}
         */
        _this.extent = null;
        /**
         * @private
         * @type {import("./format/Feature.js").default}
         */
        _this.format_ = format;
        /**
         * @private
         * @type {Array<import("./Feature.js").default>}
         */
        _this.features_ = null;
        /**
         * @private
         * @type {import("./featureloader.js").FeatureLoader}
         */
        _this.loader_;
        /**
         * Feature projection of this tile; set by the source.
         * @type {import("./proj/Projection.js").default}
         */
        _this.projection = null;
        /**
         * Resolution of this tile; set by the source.
         * @type {number}
         */
        _this.resolution;
        /**
         * @private
         * @type {import("./Tile.js").LoadFunction}
         */
        _this.tileLoadFunction_ = tileLoadFunction;
        /**
         * @private
         * @type {string}
         */
        _this.url_ = src;
        _this.key = src;
        return _this;
    }
    /**
     * Get the feature format assigned for reading this tile's features.
     * @return {import("./format/Feature.js").default} Feature format.
     * @api
     */
    VectorTile.prototype.getFormat = function () {
        return this.format_;
    };
    /**
     * Get the features for this tile. Geometries will be in the view projection.
     * @return {Array<import("./Feature.js").FeatureLike>} Features.
     * @api
     */
    VectorTile.prototype.getFeatures = function () {
        return this.features_;
    };
    /**
     * Load not yet loaded URI.
     */
    VectorTile.prototype.load = function () {
        if (this.state == _TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].IDLE) {
            this.setState(_TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOADING);
            this.tileLoadFunction_(this, this.url_);
            if (this.loader_) {
                this.loader_(this.extent, this.resolution, this.projection);
            }
        }
    };
    /**
     * Handler for successful tile load.
     * @param {Array<import("./Feature.js").default>} features The loaded features.
     * @param {import("./proj/Projection.js").default} dataProjection Data projection.
     */
    VectorTile.prototype.onLoad = function (features, dataProjection) {
        this.setFeatures(features);
    };
    /**
     * Handler for tile load errors.
     */
    VectorTile.prototype.onError = function () {
        this.setState(_TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERROR);
    };
    /**
     * Function for use in an {@link module:ol/source/VectorTile~VectorTile}'s `tileLoadFunction`.
     * Sets the features for the tile.
     * @param {Array<import("./Feature.js").default>} features Features.
     * @api
     */
    VectorTile.prototype.setFeatures = function (features) {
        this.features_ = features;
        this.setState(_TileState_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOADED);
    };
    /**
     * Set the feature loader for reading this tile's features.
     * @param {import("./featureloader.js").FeatureLoader} loader Feature loader.
     * @api
     */
    VectorTile.prototype.setLoader = function (loader) {
        this.loader_ = loader;
    };
    return VectorTile;
}(_Tile_js__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VectorTile);
//# sourceMappingURL=VectorTile.js.map

/***/ }),

/***/ "./node_modules/ol/index.js":
/*!**********************************!*\
  !*** ./node_modules/ol/index.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AssertionError": () => (/* reexport safe */ _AssertionError_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "Collection": () => (/* reexport safe */ _Collection_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "Disposable": () => (/* reexport safe */ _Disposable_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "Feature": () => (/* reexport safe */ _Feature_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "Geolocation": () => (/* reexport safe */ _Geolocation_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "Graticule": () => (/* reexport safe */ _layer_Graticule_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "Image": () => (/* reexport safe */ _Image_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "ImageBase": () => (/* reexport safe */ _ImageBase_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "ImageCanvas": () => (/* reexport safe */ _ImageCanvas_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "ImageTile": () => (/* reexport safe */ _ImageTile_js__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   "Kinetic": () => (/* reexport safe */ _Kinetic_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "Map": () => (/* reexport safe */ _Map_js__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   "MapBrowserEvent": () => (/* reexport safe */ _MapBrowserEvent_js__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   "MapBrowserEventHandler": () => (/* reexport safe */ _MapBrowserEventHandler_js__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   "MapEvent": () => (/* reexport safe */ _MapEvent_js__WEBPACK_IMPORTED_MODULE_14__["default"]),
/* harmony export */   "Object": () => (/* reexport safe */ _Object_js__WEBPACK_IMPORTED_MODULE_15__["default"]),
/* harmony export */   "Observable": () => (/* reexport safe */ _Observable_js__WEBPACK_IMPORTED_MODULE_16__["default"]),
/* harmony export */   "Overlay": () => (/* reexport safe */ _Overlay_js__WEBPACK_IMPORTED_MODULE_17__["default"]),
/* harmony export */   "PluggableMap": () => (/* reexport safe */ _PluggableMap_js__WEBPACK_IMPORTED_MODULE_18__["default"]),
/* harmony export */   "Tile": () => (/* reexport safe */ _Tile_js__WEBPACK_IMPORTED_MODULE_19__["default"]),
/* harmony export */   "TileCache": () => (/* reexport safe */ _TileCache_js__WEBPACK_IMPORTED_MODULE_20__["default"]),
/* harmony export */   "TileQueue": () => (/* reexport safe */ _TileQueue_js__WEBPACK_IMPORTED_MODULE_21__["default"]),
/* harmony export */   "TileRange": () => (/* reexport safe */ _TileRange_js__WEBPACK_IMPORTED_MODULE_22__["default"]),
/* harmony export */   "VERSION": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_26__.VERSION),
/* harmony export */   "VectorRenderTile": () => (/* reexport safe */ _VectorRenderTile_js__WEBPACK_IMPORTED_MODULE_23__["default"]),
/* harmony export */   "VectorTile": () => (/* reexport safe */ _VectorTile_js__WEBPACK_IMPORTED_MODULE_24__["default"]),
/* harmony export */   "View": () => (/* reexport safe */ _View_js__WEBPACK_IMPORTED_MODULE_25__["default"]),
/* harmony export */   "getUid": () => (/* reexport safe */ _util_js__WEBPACK_IMPORTED_MODULE_26__.getUid)
/* harmony export */ });
/* harmony import */ var _AssertionError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AssertionError.js */ "./node_modules/ol/AssertionError.js");
/* harmony import */ var _Collection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Collection.js */ "./node_modules/ol/Collection.js");
/* harmony import */ var _Disposable_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Disposable.js */ "./node_modules/ol/Disposable.js");
/* harmony import */ var _Feature_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Feature.js */ "./node_modules/ol/Feature.js");
/* harmony import */ var _Geolocation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Geolocation.js */ "./node_modules/ol/Geolocation.js");
/* harmony import */ var _layer_Graticule_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./layer/Graticule.js */ "./node_modules/ol/layer/Graticule.js");
/* harmony import */ var _Image_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Image.js */ "./node_modules/ol/Image.js");
/* harmony import */ var _ImageBase_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ImageBase.js */ "./node_modules/ol/ImageBase.js");
/* harmony import */ var _ImageCanvas_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ImageCanvas.js */ "./node_modules/ol/ImageCanvas.js");
/* harmony import */ var _ImageTile_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ImageTile.js */ "./node_modules/ol/ImageTile.js");
/* harmony import */ var _Kinetic_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Kinetic.js */ "./node_modules/ol/Kinetic.js");
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Map.js */ "./node_modules/ol/Map.js");
/* harmony import */ var _MapBrowserEvent_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./MapBrowserEvent.js */ "./node_modules/ol/MapBrowserEvent.js");
/* harmony import */ var _MapBrowserEventHandler_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MapBrowserEventHandler.js */ "./node_modules/ol/MapBrowserEventHandler.js");
/* harmony import */ var _MapEvent_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./MapEvent.js */ "./node_modules/ol/MapEvent.js");
/* harmony import */ var _Object_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Object.js */ "./node_modules/ol/Object.js");
/* harmony import */ var _Observable_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./Observable.js */ "./node_modules/ol/Observable.js");
/* harmony import */ var _Overlay_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./Overlay.js */ "./node_modules/ol/Overlay.js");
/* harmony import */ var _PluggableMap_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./PluggableMap.js */ "./node_modules/ol/PluggableMap.js");
/* harmony import */ var _Tile_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./Tile.js */ "./node_modules/ol/Tile.js");
/* harmony import */ var _TileCache_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./TileCache.js */ "./node_modules/ol/TileCache.js");
/* harmony import */ var _TileQueue_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./TileQueue.js */ "./node_modules/ol/TileQueue.js");
/* harmony import */ var _TileRange_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./TileRange.js */ "./node_modules/ol/TileRange.js");
/* harmony import */ var _VectorRenderTile_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./VectorRenderTile.js */ "./node_modules/ol/VectorRenderTile.js");
/* harmony import */ var _VectorTile_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./VectorTile.js */ "./node_modules/ol/VectorTile.js");
/* harmony import */ var _View_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./View.js */ "./node_modules/ol/View.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./util.js */ "./node_modules/ol/util.js");
/**
 * @module ol
 */



























//# sourceMappingURL=index.js.map

/***/ })

}])
//# sourceMappingURL=vendors-node_modules_ol_index_js.js.map