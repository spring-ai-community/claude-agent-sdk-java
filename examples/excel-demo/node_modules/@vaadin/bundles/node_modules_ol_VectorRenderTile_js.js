(self["webpackChunk_vaadin_bundles"] = self["webpackChunk_vaadin_bundles"] || []).push([["node_modules_ol_VectorRenderTile_js"],{

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

/***/ })

}])
//# sourceMappingURL=node_modules_ol_VectorRenderTile_js.js.map