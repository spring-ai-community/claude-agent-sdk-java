(self["webpackChunk_vaadin_bundles"] = self["webpackChunk_vaadin_bundles"] || []).push([["vendors-node_modules_ol_layer_Graticule_js"],{

/***/ "./node_modules/ol/geom/flat/geodesic.js":
/*!***********************************************!*\
  !*** ./node_modules/ol/geom/flat/geodesic.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "greatCircleArc": () => (/* binding */ greatCircleArc),
/* harmony export */   "meridian": () => (/* binding */ meridian),
/* harmony export */   "parallel": () => (/* binding */ parallel)
/* harmony export */ });
/* harmony import */ var _proj_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../proj.js */ "./node_modules/ol/proj.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../math.js */ "./node_modules/ol/math.js");
/**
 * @module ol/geom/flat/geodesic
 */


/**
 * @param {function(number): import("../../coordinate.js").Coordinate} interpolate Interpolate function.
 * @param {import("../../proj.js").TransformFunction} transform Transform from longitude/latitude to
 *     projected coordinates.
 * @param {number} squaredTolerance Squared tolerance.
 * @return {Array<number>} Flat coordinates.
 */
function line(interpolate, transform, squaredTolerance) {
    // FIXME reduce garbage generation
    // FIXME optimize stack operations
    /** @type {Array<number>} */
    var flatCoordinates = [];
    var geoA = interpolate(0);
    var geoB = interpolate(1);
    var a = transform(geoA);
    var b = transform(geoB);
    /** @type {Array<import("../../coordinate.js").Coordinate>} */
    var geoStack = [geoB, geoA];
    /** @type {Array<import("../../coordinate.js").Coordinate>} */
    var stack = [b, a];
    /** @type {Array<number>} */
    var fractionStack = [1, 0];
    /** @type {!Object<string, boolean>} */
    var fractions = {};
    var maxIterations = 1e5;
    var geoM, m, fracA, fracB, fracM, key;
    while (--maxIterations > 0 && fractionStack.length > 0) {
        // Pop the a coordinate off the stack
        fracA = fractionStack.pop();
        geoA = geoStack.pop();
        a = stack.pop();
        // Add the a coordinate if it has not been added yet
        key = fracA.toString();
        if (!(key in fractions)) {
            flatCoordinates.push(a[0], a[1]);
            fractions[key] = true;
        }
        // Pop the b coordinate off the stack
        fracB = fractionStack.pop();
        geoB = geoStack.pop();
        b = stack.pop();
        // Find the m point between the a and b coordinates
        fracM = (fracA + fracB) / 2;
        geoM = interpolate(fracM);
        m = transform(geoM);
        if ((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.squaredSegmentDistance)(m[0], m[1], a[0], a[1], b[0], b[1]) <
            squaredTolerance) {
            // If the m point is sufficiently close to the straight line, then we
            // discard it.  Just use the b coordinate and move on to the next line
            // segment.
            flatCoordinates.push(b[0], b[1]);
            key = fracB.toString();
            fractions[key] = true;
        }
        else {
            // Otherwise, we need to subdivide the current line segment.  Split it
            // into two and push the two line segments onto the stack.
            fractionStack.push(fracB, fracM, fracM, fracA);
            stack.push(b, m, m, a);
            geoStack.push(geoB, geoM, geoM, geoA);
        }
    }
    return flatCoordinates;
}
/**
 * Generate a great-circle arcs between two lat/lon points.
 * @param {number} lon1 Longitude 1 in degrees.
 * @param {number} lat1 Latitude 1 in degrees.
 * @param {number} lon2 Longitude 2 in degrees.
 * @param {number} lat2 Latitude 2 in degrees.
 * @param {import("../../proj/Projection.js").default} projection Projection.
 * @param {number} squaredTolerance Squared tolerance.
 * @return {Array<number>} Flat coordinates.
 */
function greatCircleArc(lon1, lat1, lon2, lat2, projection, squaredTolerance) {
    var geoProjection = (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.get)('EPSG:4326');
    var cosLat1 = Math.cos((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(lat1));
    var sinLat1 = Math.sin((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(lat1));
    var cosLat2 = Math.cos((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(lat2));
    var sinLat2 = Math.sin((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(lat2));
    var cosDeltaLon = Math.cos((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(lon2 - lon1));
    var sinDeltaLon = Math.sin((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(lon2 - lon1));
    var d = sinLat1 * sinLat2 + cosLat1 * cosLat2 * cosDeltaLon;
    return line(
    /**
     * @param {number} frac Fraction.
     * @return {import("../../coordinate.js").Coordinate} Coordinate.
     */
    function (frac) {
        if (1 <= d) {
            return [lon2, lat2];
        }
        var D = frac * Math.acos(d);
        var cosD = Math.cos(D);
        var sinD = Math.sin(D);
        var y = sinDeltaLon * cosLat2;
        var x = cosLat1 * sinLat2 - sinLat1 * cosLat2 * cosDeltaLon;
        var theta = Math.atan2(y, x);
        var lat = Math.asin(sinLat1 * cosD + cosLat1 * sinD * Math.cos(theta));
        var lon = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(lon1) +
            Math.atan2(Math.sin(theta) * sinD * cosLat1, cosD - sinLat1 * Math.sin(lat));
        return [(0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toDegrees)(lon), (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toDegrees)(lat)];
    }, (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.getTransform)(geoProjection, projection), squaredTolerance);
}
/**
 * Generate a meridian (line at constant longitude).
 * @param {number} lon Longitude.
 * @param {number} lat1 Latitude 1.
 * @param {number} lat2 Latitude 2.
 * @param {import("../../proj/Projection.js").default} projection Projection.
 * @param {number} squaredTolerance Squared tolerance.
 * @return {Array<number>} Flat coordinates.
 */
function meridian(lon, lat1, lat2, projection, squaredTolerance) {
    var epsg4326Projection = (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.get)('EPSG:4326');
    return line(
    /**
     * @param {number} frac Fraction.
     * @return {import("../../coordinate.js").Coordinate} Coordinate.
     */
    function (frac) {
        return [lon, lat1 + (lat2 - lat1) * frac];
    }, (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.getTransform)(epsg4326Projection, projection), squaredTolerance);
}
/**
 * Generate a parallel (line at constant latitude).
 * @param {number} lat Latitude.
 * @param {number} lon1 Longitude 1.
 * @param {number} lon2 Longitude 2.
 * @param {import("../../proj/Projection.js").default} projection Projection.
 * @param {number} squaredTolerance Squared tolerance.
 * @return {Array<number>} Flat coordinates.
 */
function parallel(lat, lon1, lon2, projection, squaredTolerance) {
    var epsg4326Projection = (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.get)('EPSG:4326');
    return line(
    /**
     * @param {number} frac Fraction.
     * @return {import("../../coordinate.js").Coordinate} Coordinate.
     */
    function (frac) {
        return [lon1 + (lon2 - lon1) * frac, lat];
    }, (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.getTransform)(epsg4326Projection, projection), squaredTolerance);
}
//# sourceMappingURL=geodesic.js.map

/***/ }),

/***/ "./node_modules/ol/layer/Graticule.js":
/*!********************************************!*\
  !*** ./node_modules/ol/layer/Graticule.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Collection_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Collection.js */ "./node_modules/ol/Collection.js");
/* harmony import */ var _render_EventType_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../render/EventType.js */ "./node_modules/ol/render/EventType.js");
/* harmony import */ var _Feature_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Feature.js */ "./node_modules/ol/Feature.js");
/* harmony import */ var _style_Fill_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../style/Fill.js */ "./node_modules/ol/style/Fill.js");
/* harmony import */ var _geom_GeometryLayout_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../geom/GeometryLayout.js */ "./node_modules/ol/geom/GeometryLayout.js");
/* harmony import */ var _geom_LineString_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../geom/LineString.js */ "./node_modules/ol/geom/LineString.js");
/* harmony import */ var _geom_Point_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../geom/Point.js */ "./node_modules/ol/geom/Point.js");
/* harmony import */ var _style_Stroke_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style/Stroke.js */ "./node_modules/ol/style/Stroke.js");
/* harmony import */ var _style_Style_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../style/Style.js */ "./node_modules/ol/style/Style.js");
/* harmony import */ var _style_Text_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../style/Text.js */ "./node_modules/ol/style/Text.js");
/* harmony import */ var _Vector_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./Vector.js */ "./node_modules/ol/layer/Vector.js");
/* harmony import */ var _source_Vector_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../source/Vector.js */ "./node_modules/ol/source/Vector.js");
/* harmony import */ var _extent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../extent.js */ "./node_modules/ol/extent.js");
/* harmony import */ var _obj_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../obj.js */ "./node_modules/ol/obj.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../math.js */ "./node_modules/ol/math.js");
/* harmony import */ var _coordinate_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../coordinate.js */ "./node_modules/ol/coordinate.js");
/* harmony import */ var _proj_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../proj.js */ "./node_modules/ol/proj.js");
/* harmony import */ var _render_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../render.js */ "./node_modules/ol/render.js");
/* harmony import */ var _geom_flat_geodesic_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../geom/flat/geodesic.js */ "./node_modules/ol/geom/flat/geodesic.js");
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
 * @module ol/layer/Graticule
 */



















/**
 * @type {Stroke}
 * @private
 * @const
 */
var DEFAULT_STROKE_STYLE = new _style_Stroke_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
    color: 'rgba(0,0,0,0.2)',
});
/**
 * @type {Array<number>}
 * @private
 */
var INTERVALS = [
    90, 45, 30, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.01, 0.005, 0.002, 0.001,
];
/**
 * @typedef {Object} GraticuleLabelDataType
 * @property {Point} geom Geometry.
 * @property {string} text Text.
 */
/**
 * @typedef {Object} Options
 * @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
 * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
 * method was used.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 * @property {number} [minZoom] The minimum view zoom level (exclusive) above which this layer will be
 * visible.
 * @property {number} [maxZoom] The maximum view zoom level (inclusive) at which this layer will
 * be visible.
 * @property {number} [maxLines=100] The maximum number of meridians and
 * parallels from the center of the map. The default value of 100 means that at
 * most 200 meridians and 200 parallels will be displayed. The default value is
 * appropriate for conformal projections like Spherical Mercator. If you
 * increase the value, more lines will be drawn and the drawing performance will
 * decrease.
 * @property {Stroke} [strokeStyle] The
 * stroke style to use for drawing the graticule. If not provided, the following stroke will be used:
 * ```js
 * new Stroke({
 *   color: 'rgba(0, 0, 0, 0.2)' // a not fully opaque black
 * });
 * ```
 * @property {number} [targetSize=100] The target size of the graticule cells,
 * in pixels.
 * @property {boolean} [showLabels=false] Render a label with the respective
 * latitude/longitude for each graticule line.
 * @property {function(number):string} [lonLabelFormatter] Label formatter for
 * longitudes. This function is called with the longitude as argument, and
 * should return a formatted string representing the longitude. By default,
 * labels are formatted as degrees, minutes, seconds and hemisphere.
 * @property {function(number):string} [latLabelFormatter] Label formatter for
 * latitudes. This function is called with the latitude as argument, and
 * should return a formatted string representing the latitude. By default,
 * labels are formatted as degrees, minutes, seconds and hemisphere.
 * @property {number} [lonLabelPosition=0] Longitude label position in fractions
 * (0..1) of view extent. 0 means at the bottom of the viewport, 1 means at the
 * top.
 * @property {number} [latLabelPosition=1] Latitude label position in fractions
 * (0..1) of view extent. 0 means at the left of the viewport, 1 means at the
 * right.
 * @property {Text} [lonLabelStyle] Longitude label text
 * style. If not provided, the following style will be used:
 * ```js
 * new Text({
 *   font: '12px Calibri,sans-serif',
 *   textBaseline: 'bottom',
 *   fill: new Fill({
 *     color: 'rgba(0,0,0,1)'
 *   }),
 *   stroke: new Stroke({
 *     color: 'rgba(255,255,255,1)',
 *     width: 3
 *   })
 * });
 * ```
 * Note that the default's `textBaseline` configuration will not work well for
 * `lonLabelPosition` configurations that position labels close to the top of
 * the viewport.
 * @property {Text} [latLabelStyle] Latitude label text style.
 * If not provided, the following style will be used:
 * ```js
 * new Text({
 *   font: '12px Calibri,sans-serif',
 *   textAlign: 'end',
 *   fill: new Fill({
 *     color: 'rgba(0,0,0,1)'
 *   }),
 *   stroke: Stroke({
 *     color: 'rgba(255,255,255,1)',
 *     width: 3
 *   })
 * });
 * ```
 * Note that the default's `textAlign` configuration will not work well for
 * `latLabelPosition` configurations that position labels close to the left of
 * the viewport.
 * @property {Array<number>} [intervals=[90, 45, 30, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.01, 0.005, 0.002, 0.001]]
 * Intervals (in degrees) for the graticule. Example to limit graticules to 30 and 10 degrees intervals:
 * ```js
 * [30, 10]
 * ```
 * @property {boolean} [wrapX=true] Whether to repeat the graticule horizontally.
 * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
 */
/**
 * @classdesc
 * Layer that renders a grid for a coordinate system (currently only EPSG:4326 is supported).
 * Note that the view projection must define both extent and worldExtent.
 *
 * @fires import("../render/Event.js").RenderEvent
 * @extends {VectorLayer<import("../source/Vector.js").default>}
 * @api
 */
var Graticule = /** @class */ (function (_super) {
    __extends(Graticule, _super);
    /**
     * @param {Options} [opt_options] Options.
     */
    function Graticule(opt_options) {
        var _this = this;
        var options = opt_options ? opt_options : {};
        var baseOptions = (0,_obj_js__WEBPACK_IMPORTED_MODULE_2__.assign)({
            updateWhileAnimating: true,
            updateWhileInteracting: true,
            renderBuffer: 0,
        }, options);
        delete baseOptions.maxLines;
        delete baseOptions.strokeStyle;
        delete baseOptions.targetSize;
        delete baseOptions.showLabels;
        delete baseOptions.lonLabelFormatter;
        delete baseOptions.latLabelFormatter;
        delete baseOptions.lonLabelPosition;
        delete baseOptions.latLabelPosition;
        delete baseOptions.lonLabelStyle;
        delete baseOptions.latLabelStyle;
        delete baseOptions.intervals;
        _this = _super.call(this, baseOptions) || this;
        /**
         * @type {import("../proj/Projection.js").default}
         */
        _this.projection_ = null;
        /**
         * @type {number}
         * @private
         */
        _this.maxLat_ = Infinity;
        /**
         * @type {number}
         * @private
         */
        _this.maxLon_ = Infinity;
        /**
         * @type {number}
         * @private
         */
        _this.minLat_ = -Infinity;
        /**
         * @type {number}
         * @private
         */
        _this.minLon_ = -Infinity;
        /**
         * @type {number}
         * @private
         */
        _this.maxX_ = Infinity;
        /**
         * @type {number}
         * @private
         */
        _this.maxY_ = Infinity;
        /**
         * @type {number}
         * @private
         */
        _this.minX_ = -Infinity;
        /**
         * @type {number}
         * @private
         */
        _this.minY_ = -Infinity;
        /**
         * @type {number}
         * @private
         */
        _this.targetSize_ =
            options.targetSize !== undefined ? options.targetSize : 100;
        /**
         * @type {number}
         * @private
         */
        _this.maxLines_ = options.maxLines !== undefined ? options.maxLines : 100;
        /**
         * @type {Array<LineString>}
         * @private
         */
        _this.meridians_ = [];
        /**
         * @type {Array<LineString>}
         * @private
         */
        _this.parallels_ = [];
        /**
         * @type {Stroke}
         * @private
         */
        _this.strokeStyle_ =
            options.strokeStyle !== undefined
                ? options.strokeStyle
                : DEFAULT_STROKE_STYLE;
        /**
         * @type {import("../proj.js").TransformFunction|undefined}
         * @private
         */
        _this.fromLonLatTransform_ = undefined;
        /**
         * @type {import("../proj.js").TransformFunction|undefined}
         * @private
         */
        _this.toLonLatTransform_ = undefined;
        /**
         * @type {import("../coordinate.js").Coordinate}
         * @private
         */
        _this.projectionCenterLonLat_ = null;
        /**
         * @type {import("../coordinate.js").Coordinate}
         * @private
         */
        _this.bottomLeft_ = null;
        /**
         * @type {import("../coordinate.js").Coordinate}
         * @private
         */
        _this.bottomRight_ = null;
        /**
         * @type {import("../coordinate.js").Coordinate}
         * @private
         */
        _this.topLeft_ = null;
        /**
         * @type {import("../coordinate.js").Coordinate}
         * @private
         */
        _this.topRight_ = null;
        /**
         * @type {Array<GraticuleLabelDataType>}
         * @private
         */
        _this.meridiansLabels_ = null;
        /**
         * @type {Array<GraticuleLabelDataType>}
         * @private
         */
        _this.parallelsLabels_ = null;
        if (options.showLabels) {
            /**
             * @type {null|function(number):string}
             * @private
             */
            _this.lonLabelFormatter_ =
                options.lonLabelFormatter == undefined
                    ? _coordinate_js__WEBPACK_IMPORTED_MODULE_3__.degreesToStringHDMS.bind(_this, 'EW')
                    : options.lonLabelFormatter;
            /**
             * @type {function(number):string}
             * @private
             */
            _this.latLabelFormatter_ =
                options.latLabelFormatter == undefined
                    ? _coordinate_js__WEBPACK_IMPORTED_MODULE_3__.degreesToStringHDMS.bind(_this, 'NS')
                    : options.latLabelFormatter;
            /**
             * Longitude label position in fractions (0..1) of view extent. 0 means
             * bottom, 1 means top.
             * @type {number}
             * @private
             */
            _this.lonLabelPosition_ =
                options.lonLabelPosition == undefined ? 0 : options.lonLabelPosition;
            /**
             * Latitude Label position in fractions (0..1) of view extent. 0 means left, 1
             * means right.
             * @type {number}
             * @private
             */
            _this.latLabelPosition_ =
                options.latLabelPosition == undefined ? 1 : options.latLabelPosition;
            /**
             * @type {Style}
             * @private
             */
            _this.lonLabelStyleBase_ = new _style_Style_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
                text: options.lonLabelStyle !== undefined
                    ? options.lonLabelStyle.clone()
                    : new _style_Text_js__WEBPACK_IMPORTED_MODULE_5__["default"]({
                        font: '12px Calibri,sans-serif',
                        textBaseline: 'bottom',
                        fill: new _style_Fill_js__WEBPACK_IMPORTED_MODULE_6__["default"]({
                            color: 'rgba(0,0,0,1)',
                        }),
                        stroke: new _style_Stroke_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                            color: 'rgba(255,255,255,1)',
                            width: 3,
                        }),
                    }),
            });
            /**
             * @private
             * @param {import("../Feature").default} feature Feature
             * @return {Style} style
             */
            _this.lonLabelStyle_ = function (feature) {
                var label = feature.get('graticule_label');
                this.lonLabelStyleBase_.getText().setText(label);
                return this.lonLabelStyleBase_;
            }.bind(_this);
            /**
             * @type {Style}
             * @private
             */
            _this.latLabelStyleBase_ = new _style_Style_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
                text: options.latLabelStyle !== undefined
                    ? options.latLabelStyle.clone()
                    : new _style_Text_js__WEBPACK_IMPORTED_MODULE_5__["default"]({
                        font: '12px Calibri,sans-serif',
                        textAlign: 'right',
                        fill: new _style_Fill_js__WEBPACK_IMPORTED_MODULE_6__["default"]({
                            color: 'rgba(0,0,0,1)',
                        }),
                        stroke: new _style_Stroke_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                            color: 'rgba(255,255,255,1)',
                            width: 3,
                        }),
                    }),
            });
            /**
             * @private
             * @param {import("../Feature").default} feature Feature
             * @return {Style} style
             */
            _this.latLabelStyle_ = function (feature) {
                var label = feature.get('graticule_label');
                this.latLabelStyleBase_.getText().setText(label);
                return this.latLabelStyleBase_;
            }.bind(_this);
            _this.meridiansLabels_ = [];
            _this.parallelsLabels_ = [];
            _this.addEventListener(_render_EventType_js__WEBPACK_IMPORTED_MODULE_7__["default"].POSTRENDER, _this.drawLabels_.bind(_this));
        }
        /**
         * @type {Array<number>}
         * @private
         */
        _this.intervals_ =
            options.intervals !== undefined ? options.intervals : INTERVALS;
        // use a source with a custom loader for lines & text
        _this.setSource(new _source_Vector_js__WEBPACK_IMPORTED_MODULE_8__["default"]({
            loader: _this.loaderFunction.bind(_this),
            strategy: _this.strategyFunction.bind(_this),
            features: new _Collection_js__WEBPACK_IMPORTED_MODULE_9__["default"](),
            overlaps: false,
            useSpatialIndex: false,
            wrapX: options.wrapX,
        }));
        /**
         * feature pool to use when updating graticule
         * @type {Array<Feature>}
         * @private
         */
        _this.featurePool_ = [];
        /**
         * @type {Style}
         * @private
         */
        _this.lineStyle_ = new _style_Style_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
            stroke: _this.strokeStyle_,
        });
        /**
         * @type {?import("../extent.js").Extent}
         * @private
         */
        _this.loadedExtent_ = null;
        /**
         * @type {?import("../extent.js").Extent}
         * @private
         */
        _this.renderedExtent_ = null;
        /**
         * @type {?number}
         * @private
         */
        _this.renderedResolution_ = null;
        _this.setRenderOrder(null);
        return _this;
    }
    /**
     * Strategy function for loading features based on the view's extent and
     * resolution.
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @return {Array<import("../extent.js").Extent>} Extents.
     */
    Graticule.prototype.strategyFunction = function (extent, resolution) {
        // extents may be passed in different worlds, to avoid endless loop we use only one
        var realWorldExtent = extent.slice();
        if (this.projection_ && this.getSource().getWrapX()) {
            (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.wrapX)(realWorldExtent, this.projection_);
        }
        if (this.loadedExtent_) {
            if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.approximatelyEquals)(this.loadedExtent_, realWorldExtent, resolution)) {
                // make sure result is exactly equal to previous extent
                realWorldExtent = this.loadedExtent_.slice();
            }
            else {
                // we should not keep track of loaded extents
                this.getSource().removeLoadedExtent(this.loadedExtent_);
            }
        }
        return [realWorldExtent];
    };
    /**
     * Update geometries in the source based on current view
     * @param {import("../extent").Extent} extent Extent
     * @param {number} resolution Resolution
     * @param {import("../proj/Projection.js").default} projection Projection
     */
    Graticule.prototype.loaderFunction = function (extent, resolution, projection) {
        this.loadedExtent_ = extent;
        var source = this.getSource();
        // only consider the intersection between our own extent & the requested one
        var layerExtent = this.getExtent() || [
            -Infinity,
            -Infinity,
            Infinity,
            Infinity,
        ];
        var renderExtent = (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.getIntersection)(layerExtent, extent);
        if (this.renderedExtent_ &&
            (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.equals)(this.renderedExtent_, renderExtent) &&
            this.renderedResolution_ === resolution) {
            return;
        }
        this.renderedExtent_ = renderExtent;
        this.renderedResolution_ = resolution;
        // bail out if nothing to render
        if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.isEmpty)(renderExtent)) {
            return;
        }
        // update projection info
        var center = (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.getCenter)(renderExtent);
        var squaredTolerance = (resolution * resolution) / 4;
        var updateProjectionInfo = !this.projection_ || !(0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.equivalent)(this.projection_, projection);
        if (updateProjectionInfo) {
            this.updateProjectionInfo_(projection);
        }
        this.createGraticule_(renderExtent, center, resolution, squaredTolerance);
        // first make sure we have enough features in the pool
        var featureCount = this.meridians_.length + this.parallels_.length;
        if (this.meridiansLabels_) {
            featureCount += this.meridians_.length;
        }
        if (this.parallelsLabels_) {
            featureCount += this.parallels_.length;
        }
        var feature;
        while (featureCount > this.featurePool_.length) {
            feature = new _Feature_js__WEBPACK_IMPORTED_MODULE_11__["default"]();
            this.featurePool_.push(feature);
        }
        var featuresColl = source.getFeaturesCollection();
        featuresColl.clear();
        var poolIndex = 0;
        // add features for the lines & labels
        var i, l;
        for (i = 0, l = this.meridians_.length; i < l; ++i) {
            feature = this.featurePool_[poolIndex++];
            feature.setGeometry(this.meridians_[i]);
            feature.setStyle(this.lineStyle_);
            featuresColl.push(feature);
        }
        for (i = 0, l = this.parallels_.length; i < l; ++i) {
            feature = this.featurePool_[poolIndex++];
            feature.setGeometry(this.parallels_[i]);
            feature.setStyle(this.lineStyle_);
            featuresColl.push(feature);
        }
    };
    /**
     * @param {number} lon Longitude.
     * @param {number} minLat Minimal latitude.
     * @param {number} maxLat Maximal latitude.
     * @param {number} squaredTolerance Squared tolerance.
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} index Index.
     * @return {number} Index.
     * @private
     */
    Graticule.prototype.addMeridian_ = function (lon, minLat, maxLat, squaredTolerance, extent, index) {
        var lineString = this.getMeridian_(lon, minLat, maxLat, squaredTolerance, index);
        if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.intersects)(lineString.getExtent(), extent)) {
            if (this.meridiansLabels_) {
                var text = this.lonLabelFormatter_(lon);
                if (index in this.meridiansLabels_) {
                    this.meridiansLabels_[index].text = text;
                }
                else {
                    this.meridiansLabels_[index] = {
                        geom: new _geom_Point_js__WEBPACK_IMPORTED_MODULE_12__["default"]([]),
                        text: text,
                    };
                }
            }
            this.meridians_[index++] = lineString;
        }
        return index;
    };
    /**
     * @param {number} lat Latitude.
     * @param {number} minLon Minimal longitude.
     * @param {number} maxLon Maximal longitude.
     * @param {number} squaredTolerance Squared tolerance.
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} index Index.
     * @return {number} Index.
     * @private
     */
    Graticule.prototype.addParallel_ = function (lat, minLon, maxLon, squaredTolerance, extent, index) {
        var lineString = this.getParallel_(lat, minLon, maxLon, squaredTolerance, index);
        if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.intersects)(lineString.getExtent(), extent)) {
            if (this.parallelsLabels_) {
                var text = this.latLabelFormatter_(lat);
                if (index in this.parallelsLabels_) {
                    this.parallelsLabels_[index].text = text;
                }
                else {
                    this.parallelsLabels_[index] = {
                        geom: new _geom_Point_js__WEBPACK_IMPORTED_MODULE_12__["default"]([]),
                        text: text,
                    };
                }
            }
            this.parallels_[index++] = lineString;
        }
        return index;
    };
    /**
     * @param {import("../render/Event.js").default} event Render event.
     * @private
     */
    Graticule.prototype.drawLabels_ = function (event) {
        var rotation = event.frameState.viewState.rotation;
        var resolution = event.frameState.viewState.resolution;
        var size = event.frameState.size;
        var extent = event.frameState.extent;
        var rotationCenter = (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.getCenter)(extent);
        var rotationExtent = extent;
        if (rotation) {
            var unrotatedWidth = size[0] * resolution;
            var unrotatedHeight = size[1] * resolution;
            rotationExtent = [
                rotationCenter[0] - unrotatedWidth / 2,
                rotationCenter[1] - unrotatedHeight / 2,
                rotationCenter[0] + unrotatedWidth / 2,
                rotationCenter[1] + unrotatedHeight / 2,
            ];
        }
        var startWorld = 0;
        var endWorld = 0;
        var labelsAtStart = this.latLabelPosition_ < 0.5;
        var projectionExtent = this.projection_.getExtent();
        var worldWidth = (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.getWidth)(projectionExtent);
        if (this.getSource().getWrapX() &&
            this.projection_.canWrapX() &&
            !(0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.containsExtent)(projectionExtent, extent)) {
            startWorld = Math.floor((extent[0] - projectionExtent[0]) / worldWidth);
            endWorld = Math.ceil((extent[2] - projectionExtent[2]) / worldWidth);
            var inverted = Math.abs(rotation) > Math.PI / 2;
            labelsAtStart = labelsAtStart !== inverted;
        }
        var vectorContext = (0,_render_js__WEBPACK_IMPORTED_MODULE_13__.getVectorContext)(event);
        for (var world = startWorld; world <= endWorld; ++world) {
            var poolIndex = this.meridians_.length + this.parallels_.length;
            var feature = void 0, index = void 0, l = void 0, textPoint = void 0;
            if (this.meridiansLabels_) {
                for (index = 0, l = this.meridiansLabels_.length; index < l; ++index) {
                    var lineString = this.meridians_[index];
                    if (!rotation && world === 0) {
                        textPoint = this.getMeridianPoint_(lineString, extent, index);
                    }
                    else {
                        var clone = lineString.clone();
                        clone.translate(world * worldWidth, 0);
                        clone.rotate(-rotation, rotationCenter);
                        textPoint = this.getMeridianPoint_(clone, rotationExtent, index);
                        textPoint.rotate(rotation, rotationCenter);
                    }
                    feature = this.featurePool_[poolIndex++];
                    feature.setGeometry(textPoint);
                    feature.set('graticule_label', this.meridiansLabels_[index].text);
                    vectorContext.drawFeature(feature, this.lonLabelStyle_(feature));
                }
            }
            if (this.parallelsLabels_) {
                if ((world === startWorld && labelsAtStart) ||
                    (world === endWorld && !labelsAtStart)) {
                    for (index = 0, l = this.parallels_.length; index < l; ++index) {
                        var lineString = this.parallels_[index];
                        if (!rotation && world === 0) {
                            textPoint = this.getParallelPoint_(lineString, extent, index);
                        }
                        else {
                            var clone = lineString.clone();
                            clone.translate(world * worldWidth, 0);
                            clone.rotate(-rotation, rotationCenter);
                            textPoint = this.getParallelPoint_(clone, rotationExtent, index);
                            textPoint.rotate(rotation, rotationCenter);
                        }
                        feature = this.featurePool_[poolIndex++];
                        feature.setGeometry(textPoint);
                        feature.set('graticule_label', this.parallelsLabels_[index].text);
                        vectorContext.drawFeature(feature, this.latLabelStyle_(feature));
                    }
                }
            }
        }
    };
    /**
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {import("../coordinate.js").Coordinate} center Center.
     * @param {number} resolution Resolution.
     * @param {number} squaredTolerance Squared tolerance.
     * @private
     */
    Graticule.prototype.createGraticule_ = function (extent, center, resolution, squaredTolerance) {
        var interval = this.getInterval_(resolution);
        if (interval == -1) {
            this.meridians_.length = 0;
            this.parallels_.length = 0;
            if (this.meridiansLabels_) {
                this.meridiansLabels_.length = 0;
            }
            if (this.parallelsLabels_) {
                this.parallelsLabels_.length = 0;
            }
            return;
        }
        var wrapX = false;
        var projectionExtent = this.projection_.getExtent();
        var worldWidth = (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.getWidth)(projectionExtent);
        if (this.getSource().getWrapX() &&
            this.projection_.canWrapX() &&
            !(0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.containsExtent)(projectionExtent, extent)) {
            if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.getWidth)(extent) >= worldWidth) {
                extent[0] = projectionExtent[0];
                extent[2] = projectionExtent[2];
            }
            else {
                wrapX = true;
            }
        }
        // Constrain the center to fit into the extent available to the graticule
        var validCenterP = [
            (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(center[0], this.minX_, this.maxX_),
            (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(center[1], this.minY_, this.maxY_),
        ];
        // Transform the center to lon lat
        // Some projections may have a void area at the poles
        // so replace any NaN latitudes with the min or max value closest to a pole
        var centerLonLat = this.toLonLatTransform_(validCenterP);
        if (isNaN(centerLonLat[1])) {
            centerLonLat[1] =
                Math.abs(this.maxLat_) >= Math.abs(this.minLat_)
                    ? this.maxLat_
                    : this.minLat_;
        }
        var centerLon = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(centerLonLat[0], this.minLon_, this.maxLon_);
        var centerLat = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(centerLonLat[1], this.minLat_, this.maxLat_);
        var maxLines = this.maxLines_;
        var cnt, idx, lat, lon;
        // Limit the extent to fit into the extent available to the graticule
        var validExtentP = extent;
        if (!wrapX) {
            validExtentP = [
                (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(extent[0], this.minX_, this.maxX_),
                (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(extent[1], this.minY_, this.maxY_),
                (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(extent[2], this.minX_, this.maxX_),
                (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(extent[3], this.minY_, this.maxY_),
            ];
        }
        // Transform the extent to get the lon lat ranges for the edges of the extent
        var validExtent = (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.applyTransform)(validExtentP, this.toLonLatTransform_, undefined, 8);
        var maxLat = validExtent[3];
        var maxLon = validExtent[2];
        var minLat = validExtent[1];
        var minLon = validExtent[0];
        if (!wrapX) {
            // Check if extremities of the world extent lie inside the extent
            // (for example the pole in a polar projection)
            // and extend the extent as appropriate
            if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.containsCoordinate)(validExtentP, this.bottomLeft_)) {
                minLon = this.minLon_;
                minLat = this.minLat_;
            }
            if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.containsCoordinate)(validExtentP, this.bottomRight_)) {
                maxLon = this.maxLon_;
                minLat = this.minLat_;
            }
            if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.containsCoordinate)(validExtentP, this.topLeft_)) {
                minLon = this.minLon_;
                maxLat = this.maxLat_;
            }
            if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.containsCoordinate)(validExtentP, this.topRight_)) {
                maxLon = this.maxLon_;
                maxLat = this.maxLat_;
            }
            // The transformed center may also extend the lon lat ranges used for rendering
            maxLat = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(maxLat, centerLat, this.maxLat_);
            maxLon = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(maxLon, centerLon, this.maxLon_);
            minLat = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(minLat, this.minLat_, centerLat);
            minLon = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(minLon, this.minLon_, centerLon);
        }
        // Create meridians
        centerLon = Math.floor(centerLon / interval) * interval;
        lon = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(centerLon, this.minLon_, this.maxLon_);
        idx = this.addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, 0);
        cnt = 0;
        if (wrapX) {
            while ((lon -= interval) >= minLon && cnt++ < maxLines) {
                idx = this.addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, idx);
            }
        }
        else {
            while (lon != this.minLon_ && cnt++ < maxLines) {
                lon = Math.max(lon - interval, this.minLon_);
                idx = this.addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, idx);
            }
        }
        lon = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(centerLon, this.minLon_, this.maxLon_);
        cnt = 0;
        if (wrapX) {
            while ((lon += interval) <= maxLon && cnt++ < maxLines) {
                idx = this.addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, idx);
            }
        }
        else {
            while (lon != this.maxLon_ && cnt++ < maxLines) {
                lon = Math.min(lon + interval, this.maxLon_);
                idx = this.addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, idx);
            }
        }
        this.meridians_.length = idx;
        if (this.meridiansLabels_) {
            this.meridiansLabels_.length = idx;
        }
        // Create parallels
        centerLat = Math.floor(centerLat / interval) * interval;
        lat = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(centerLat, this.minLat_, this.maxLat_);
        idx = this.addParallel_(lat, minLon, maxLon, squaredTolerance, extent, 0);
        cnt = 0;
        while (lat != this.minLat_ && cnt++ < maxLines) {
            lat = Math.max(lat - interval, this.minLat_);
            idx = this.addParallel_(lat, minLon, maxLon, squaredTolerance, extent, idx);
        }
        lat = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(centerLat, this.minLat_, this.maxLat_);
        cnt = 0;
        while (lat != this.maxLat_ && cnt++ < maxLines) {
            lat = Math.min(lat + interval, this.maxLat_);
            idx = this.addParallel_(lat, minLon, maxLon, squaredTolerance, extent, idx);
        }
        this.parallels_.length = idx;
        if (this.parallelsLabels_) {
            this.parallelsLabels_.length = idx;
        }
    };
    /**
     * @param {number} resolution Resolution.
     * @return {number} The interval in degrees.
     * @private
     */
    Graticule.prototype.getInterval_ = function (resolution) {
        var centerLon = this.projectionCenterLonLat_[0];
        var centerLat = this.projectionCenterLonLat_[1];
        var interval = -1;
        var target = Math.pow(this.targetSize_ * resolution, 2);
        /** @type {Array<number>} **/
        var p1 = [];
        /** @type {Array<number>} **/
        var p2 = [];
        for (var i = 0, ii = this.intervals_.length; i < ii; ++i) {
            var delta = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(this.intervals_[i] / 2, 0, 90);
            // Don't attempt to transform latitudes beyond the poles!
            var clampedLat = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(centerLat, -90 + delta, 90 - delta);
            p1[0] = centerLon - delta;
            p1[1] = clampedLat - delta;
            p2[0] = centerLon + delta;
            p2[1] = clampedLat + delta;
            this.fromLonLatTransform_(p1, p1);
            this.fromLonLatTransform_(p2, p2);
            var dist = Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2);
            if (dist <= target) {
                break;
            }
            interval = this.intervals_[i];
        }
        return interval;
    };
    /**
     * @param {number} lon Longitude.
     * @param {number} minLat Minimal latitude.
     * @param {number} maxLat Maximal latitude.
     * @param {number} squaredTolerance Squared tolerance.
     * @return {LineString} The meridian line string.
     * @param {number} index Index.
     * @private
     */
    Graticule.prototype.getMeridian_ = function (lon, minLat, maxLat, squaredTolerance, index) {
        var flatCoordinates = (0,_geom_flat_geodesic_js__WEBPACK_IMPORTED_MODULE_15__.meridian)(lon, minLat, maxLat, this.projection_, squaredTolerance);
        var lineString = this.meridians_[index];
        if (!lineString) {
            lineString = new _geom_LineString_js__WEBPACK_IMPORTED_MODULE_16__["default"](flatCoordinates, _geom_GeometryLayout_js__WEBPACK_IMPORTED_MODULE_17__["default"].XY);
            this.meridians_[index] = lineString;
        }
        else {
            lineString.setFlatCoordinates(_geom_GeometryLayout_js__WEBPACK_IMPORTED_MODULE_17__["default"].XY, flatCoordinates);
            lineString.changed();
        }
        return lineString;
    };
    /**
     * @param {LineString} lineString Meridian
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} index Index.
     * @return {Point} Meridian point.
     * @private
     */
    Graticule.prototype.getMeridianPoint_ = function (lineString, extent, index) {
        var flatCoordinates = lineString.getFlatCoordinates();
        var bottom = 1;
        var top = flatCoordinates.length - 1;
        if (flatCoordinates[bottom] > flatCoordinates[top]) {
            bottom = top;
            top = 1;
        }
        var clampedBottom = Math.max(extent[1], flatCoordinates[bottom]);
        var clampedTop = Math.min(extent[3], flatCoordinates[top]);
        var lat = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(extent[1] + Math.abs(extent[1] - extent[3]) * this.lonLabelPosition_, clampedBottom, clampedTop);
        var coordinate0 = flatCoordinates[bottom - 1] +
            ((flatCoordinates[top - 1] - flatCoordinates[bottom - 1]) *
                (lat - flatCoordinates[bottom])) /
                (flatCoordinates[top] - flatCoordinates[bottom]);
        var coordinate = [coordinate0, lat];
        var point = this.meridiansLabels_[index].geom;
        point.setCoordinates(coordinate);
        return point;
    };
    /**
     * Get the list of meridians.  Meridians are lines of equal longitude.
     * @return {Array<LineString>} The meridians.
     * @api
     */
    Graticule.prototype.getMeridians = function () {
        return this.meridians_;
    };
    /**
     * @param {number} lat Latitude.
     * @param {number} minLon Minimal longitude.
     * @param {number} maxLon Maximal longitude.
     * @param {number} squaredTolerance Squared tolerance.
     * @return {LineString} The parallel line string.
     * @param {number} index Index.
     * @private
     */
    Graticule.prototype.getParallel_ = function (lat, minLon, maxLon, squaredTolerance, index) {
        var flatCoordinates = (0,_geom_flat_geodesic_js__WEBPACK_IMPORTED_MODULE_15__.parallel)(lat, minLon, maxLon, this.projection_, squaredTolerance);
        var lineString = this.parallels_[index];
        if (!lineString) {
            lineString = new _geom_LineString_js__WEBPACK_IMPORTED_MODULE_16__["default"](flatCoordinates, _geom_GeometryLayout_js__WEBPACK_IMPORTED_MODULE_17__["default"].XY);
        }
        else {
            lineString.setFlatCoordinates(_geom_GeometryLayout_js__WEBPACK_IMPORTED_MODULE_17__["default"].XY, flatCoordinates);
            lineString.changed();
        }
        return lineString;
    };
    /**
     * @param {LineString} lineString Parallels.
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} index Index.
     * @return {Point} Parallel point.
     * @private
     */
    Graticule.prototype.getParallelPoint_ = function (lineString, extent, index) {
        var flatCoordinates = lineString.getFlatCoordinates();
        var left = 0;
        var right = flatCoordinates.length - 2;
        if (flatCoordinates[left] > flatCoordinates[right]) {
            left = right;
            right = 0;
        }
        var clampedLeft = Math.max(extent[0], flatCoordinates[left]);
        var clampedRight = Math.min(extent[2], flatCoordinates[right]);
        var lon = (0,_math_js__WEBPACK_IMPORTED_MODULE_14__.clamp)(extent[0] + Math.abs(extent[0] - extent[2]) * this.latLabelPosition_, clampedLeft, clampedRight);
        var coordinate1 = flatCoordinates[left + 1] +
            ((flatCoordinates[right + 1] - flatCoordinates[left + 1]) *
                (lon - flatCoordinates[left])) /
                (flatCoordinates[right] - flatCoordinates[left]);
        var coordinate = [lon, coordinate1];
        var point = this.parallelsLabels_[index].geom;
        point.setCoordinates(coordinate);
        return point;
    };
    /**
     * Get the list of parallels.  Parallels are lines of equal latitude.
     * @return {Array<LineString>} The parallels.
     * @api
     */
    Graticule.prototype.getParallels = function () {
        return this.parallels_;
    };
    /**
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @private
     */
    Graticule.prototype.updateProjectionInfo_ = function (projection) {
        var epsg4326Projection = (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.get)('EPSG:4326');
        var worldExtent = projection.getWorldExtent();
        this.maxLat_ = worldExtent[3];
        this.maxLon_ = worldExtent[2];
        this.minLat_ = worldExtent[1];
        this.minLon_ = worldExtent[0];
        // If the world extent crosses the dateline define a custom transform to
        // return longitudes which wrap the dateline
        var toLonLatTransform = (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.getTransform)(projection, epsg4326Projection);
        if (this.minLon_ < this.maxLon_) {
            this.toLonLatTransform_ = toLonLatTransform;
        }
        else {
            var split_1 = this.minLon_ + this.maxLon_ / 2;
            this.maxLon_ += 360;
            this.toLonLatTransform_ = function (coordinates, opt_output, opt_dimension) {
                var dimension = opt_dimension || 2;
                var lonLatCoordinates = toLonLatTransform(coordinates, opt_output, dimension);
                for (var i = 0, l = lonLatCoordinates.length; i < l; i += dimension) {
                    if (lonLatCoordinates[i] < split_1) {
                        lonLatCoordinates[i] += 360;
                    }
                }
                return lonLatCoordinates;
            };
        }
        // Transform the extent to get the limits of the view projection extent
        // which should be available to the graticule
        this.fromLonLatTransform_ = (0,_proj_js__WEBPACK_IMPORTED_MODULE_0__.getTransform)(epsg4326Projection, projection);
        var worldExtentP = (0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.applyTransform)([this.minLon_, this.minLat_, this.maxLon_, this.maxLat_], this.fromLonLatTransform_, undefined, 8);
        this.minX_ = worldExtentP[0];
        this.maxX_ = worldExtentP[2];
        this.minY_ = worldExtentP[1];
        this.maxY_ = worldExtentP[3];
        // Determine the view projection coordinates of the extremities of the world extent
        // as these may lie inside a view extent (for example the pole in a polar projection)
        this.bottomLeft_ = this.fromLonLatTransform_([this.minLon_, this.minLat_]);
        this.bottomRight_ = this.fromLonLatTransform_([this.maxLon_, this.minLat_]);
        this.topLeft_ = this.fromLonLatTransform_([this.minLon_, this.maxLat_]);
        this.topRight_ = this.fromLonLatTransform_([this.maxLon_, this.maxLat_]);
        // Transform the projection center to lon lat
        // Some projections may have a void area at the poles
        // so replace any NaN latitudes with the min or max value closest to a pole
        this.projectionCenterLonLat_ = this.toLonLatTransform_((0,_extent_js__WEBPACK_IMPORTED_MODULE_10__.getCenter)(projection.getExtent()));
        if (isNaN(this.projectionCenterLonLat_[1])) {
            this.projectionCenterLonLat_[1] =
                Math.abs(this.maxLat_) >= Math.abs(this.minLat_)
                    ? this.maxLat_
                    : this.minLat_;
        }
        this.projection_ = projection;
    };
    return Graticule;
}(_Vector_js__WEBPACK_IMPORTED_MODULE_18__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Graticule);
//# sourceMappingURL=Graticule.js.map

/***/ }),

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
//# sourceMappingURL=vendors-node_modules_ol_layer_Graticule_js.js.map