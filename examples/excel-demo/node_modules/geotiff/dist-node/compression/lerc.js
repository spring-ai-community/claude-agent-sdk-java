"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zstd = void 0;
const pako_1 = require("pako");
const lerc_1 = __importDefault(require("lerc"));
const zstddec_1 = require("zstddec");
const basedecoder_js_1 = __importDefault(require("./basedecoder.js"));
const globals_js_1 = require("../globals.js");
exports.zstd = new zstddec_1.ZSTDDecoder();
class LercDecoder extends basedecoder_js_1.default {
    constructor(fileDirectory) {
        super();
        this.planarConfiguration = typeof fileDirectory.PlanarConfiguration !== 'undefined' ? fileDirectory.PlanarConfiguration : 1;
        this.samplesPerPixel = typeof fileDirectory.SamplesPerPixel !== 'undefined' ? fileDirectory.SamplesPerPixel : 1;
        this.addCompression = fileDirectory.LercParameters[globals_js_1.LercParameters.AddCompression];
    }
    decodeBlock(buffer) {
        switch (this.addCompression) {
            case globals_js_1.LercAddCompression.None:
                break;
            case globals_js_1.LercAddCompression.Deflate:
                buffer = (0, pako_1.inflate)(new Uint8Array(buffer)).buffer; // eslint-disable-line no-param-reassign, prefer-destructuring
                break;
            case globals_js_1.LercAddCompression.Zstandard:
                buffer = exports.zstd.decode(new Uint8Array(buffer)).buffer; // eslint-disable-line no-param-reassign, prefer-destructuring
                break;
            default:
                throw new Error(`Unsupported LERC additional compression method identifier: ${this.addCompression}`);
        }
        const lercResult = lerc_1.default.decode(buffer, { returnPixelInterleavedDims: this.planarConfiguration === 1 });
        const lercData = lercResult.pixels[0];
        return lercData.buffer;
    }
}
exports.default = LercDecoder;
//# sourceMappingURL=lerc.js.map