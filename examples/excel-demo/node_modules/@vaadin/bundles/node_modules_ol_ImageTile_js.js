(self["webpackChunk_vaadin_bundles"] = self["webpackChunk_vaadin_bundles"] || []).push([["node_modules_ol_ImageTile_js"],{

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

/***/ })

}])
//# sourceMappingURL=node_modules_ol_ImageTile_js.js.map