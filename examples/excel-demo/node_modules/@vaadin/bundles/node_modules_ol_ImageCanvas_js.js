(self["webpackChunk_vaadin_bundles"] = self["webpackChunk_vaadin_bundles"] || []).push([["node_modules_ol_ImageCanvas_js"],{

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

/***/ })

}])
//# sourceMappingURL=node_modules_ol_ImageCanvas_js.js.map