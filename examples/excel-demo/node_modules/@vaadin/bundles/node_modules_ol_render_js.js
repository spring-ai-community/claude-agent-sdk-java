(self["webpackChunk_vaadin_bundles"] = self["webpackChunk_vaadin_bundles"] || []).push([["node_modules_ol_render_js"],{

/***/ "./node_modules/ol/render.js":
/*!***********************************!*\
  !*** ./node_modules/ol/render.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRenderPixel": () => (/* binding */ getRenderPixel),
/* harmony export */   "getVectorContext": () => (/* binding */ getVectorContext),
/* harmony export */   "toContext": () => (/* binding */ toContext)
/* harmony export */ });
/* harmony import */ var _render_canvas_Immediate_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./render/canvas/Immediate.js */ "./node_modules/ol/render/canvas/Immediate.js");
/* harmony import */ var _has_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./has.js */ "./node_modules/ol/has.js");
/* harmony import */ var _transform_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transform.js */ "./node_modules/ol/transform.js");
/* harmony import */ var _renderer_vector_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./renderer/vector.js */ "./node_modules/ol/renderer/vector.js");
/* harmony import */ var _proj_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./proj.js */ "./node_modules/ol/proj.js");
/**
 * @module ol/render
 */





/**
 * @typedef {Object} State
 * @property {CanvasRenderingContext2D} context Canvas context that the layer is being rendered to.
 * @property {import("./Feature.js").FeatureLike} feature Feature.
 * @property {import("./geom/SimpleGeometry.js").default} geometry Geometry.
 * @property {number} pixelRatio Pixel ratio used by the layer renderer.
 * @property {number} resolution Resolution that the render batch was created and optimized for.
 * This is not the view's resolution that is being rendered.
 * @property {number} rotation Rotation of the rendered layer in radians.
 */
/**
 * A function to be used when sorting features before rendering.
 * It takes two instances of {@link module:ol/Feature~Feature} or
 * {@link module:ol/render/Feature~RenderFeature} and returns a `{number}`.
 *
 * @typedef {function(import("./Feature.js").FeatureLike, import("./Feature.js").FeatureLike):number} OrderFunction
 */
/**
 * @typedef {Object} ToContextOptions
 * @property {import("./size.js").Size} [size] Desired size of the canvas in css
 * pixels. When provided, both canvas and css size will be set according to the
 * `pixelRatio`. If not provided, the current canvas and css sizes will not be
 * altered.
 * @property {number} [pixelRatio=window.devicePixelRatio] Pixel ratio (canvas
 * pixel to css pixel ratio) for the canvas.
 */
/**
 * Binds a Canvas Immediate API to a canvas context, to allow drawing geometries
 * to the context's canvas.
 *
 * The units for geometry coordinates are css pixels relative to the top left
 * corner of the canvas element.
 * ```js
 * import {toContext} from 'ol/render';
 * import Fill from 'ol/style/Fill';
 * import Polygon from 'ol/geom/Polygon';
 *
 * var canvas = document.createElement('canvas');
 * var render = toContext(canvas.getContext('2d'),
 *     { size: [100, 100] });
 * render.setFillStrokeStyle(new Fill({ color: blue }));
 * render.drawPolygon(
 *     new Polygon([[[0, 0], [100, 100], [100, 0], [0, 0]]]));
 * ```
 *
 * @param {CanvasRenderingContext2D} context Canvas context.
 * @param {ToContextOptions} [opt_options] Options.
 * @return {CanvasImmediateRenderer} Canvas Immediate.
 * @api
 */
function toContext(context, opt_options) {
    var canvas = context.canvas;
    var options = opt_options ? opt_options : {};
    var pixelRatio = options.pixelRatio || _has_js__WEBPACK_IMPORTED_MODULE_1__.DEVICE_PIXEL_RATIO;
    var size = options.size;
    if (size) {
        canvas.width = size[0] * pixelRatio;
        canvas.height = size[1] * pixelRatio;
        canvas.style.width = size[0] + 'px';
        canvas.style.height = size[1] + 'px';
    }
    var extent = [0, 0, canvas.width, canvas.height];
    var transform = (0,_transform_js__WEBPACK_IMPORTED_MODULE_2__.scale)((0,_transform_js__WEBPACK_IMPORTED_MODULE_2__.create)(), pixelRatio, pixelRatio);
    return new _render_canvas_Immediate_js__WEBPACK_IMPORTED_MODULE_3__["default"](context, pixelRatio, extent, transform, 0);
}
/**
 * Gets a vector context for drawing to the event's canvas.
 * @param {import("./render/Event.js").default} event Render event.
 * @return {CanvasImmediateRenderer} Vector context.
 * @api
 */
function getVectorContext(event) {
    if (!(event.context instanceof CanvasRenderingContext2D)) {
        throw new Error('Only works for render events from Canvas 2D layers');
    }
    // canvas may be at a different pixel ratio than frameState.pixelRatio
    var canvasPixelRatio = event.inversePixelTransform[0];
    var frameState = event.frameState;
    var transform = (0,_transform_js__WEBPACK_IMPORTED_MODULE_2__.multiply)(event.inversePixelTransform.slice(), frameState.coordinateToPixelTransform);
    var squaredTolerance = (0,_renderer_vector_js__WEBPACK_IMPORTED_MODULE_4__.getSquaredTolerance)(frameState.viewState.resolution, canvasPixelRatio);
    var userTransform;
    var userProjection = (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.getUserProjection)();
    if (userProjection) {
        userTransform = (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.getTransformFromProjections)(userProjection, frameState.viewState.projection);
    }
    return new _render_canvas_Immediate_js__WEBPACK_IMPORTED_MODULE_3__["default"](event.context, canvasPixelRatio, frameState.extent, transform, frameState.viewState.rotation, squaredTolerance, userTransform);
}
/**
 * Gets the pixel of the event's canvas context from the map viewport's CSS pixel.
 * @param {import("./render/Event.js").default} event Render event.
 * @param {import("./pixel.js").Pixel} pixel CSS pixel relative to the top-left
 * corner of the map viewport.
 * @return {import("./pixel.js").Pixel} Pixel on the event's canvas context.
 * @api
 */
function getRenderPixel(event, pixel) {
    return (0,_transform_js__WEBPACK_IMPORTED_MODULE_2__.apply)(event.inversePixelTransform, pixel.slice(0));
}
//# sourceMappingURL=render.js.map

/***/ })

}])
//# sourceMappingURL=node_modules_ol_render_js.js.map