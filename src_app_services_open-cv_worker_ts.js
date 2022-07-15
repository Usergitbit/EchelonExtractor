/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 389:
/*!*********************************************!*\
  !*** ./src/app/models/WorkerRequestType.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WorkerRequestType": () => (/* binding */ WorkerRequestType)
/* harmony export */ });
var WorkerRequestType;
(function (WorkerRequestType) {
    WorkerRequestType[WorkerRequestType["Load"] = 0] = "Load";
    WorkerRequestType[WorkerRequestType["ExtractEchelons"] = 1] = "ExtractEchelons";
    WorkerRequestType[WorkerRequestType["CombineEchelons"] = 2] = "CombineEchelons";
})(WorkerRequestType || (WorkerRequestType = {}));


/***/ }),

/***/ 3601:
/*!**********************************************!*\
  !*** ./src/app/models/WorkerResponseType.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WorkerResponseType": () => (/* binding */ WorkerResponseType)
/* harmony export */ });
var WorkerResponseType;
(function (WorkerResponseType) {
    WorkerResponseType[WorkerResponseType["LoadCompleted"] = 0] = "LoadCompleted";
    WorkerResponseType[WorkerResponseType["EchelonExtracted"] = 1] = "EchelonExtracted";
    WorkerResponseType[WorkerResponseType["EchelonsCombined"] = 2] = "EchelonsCombined";
    WorkerResponseType[WorkerResponseType["Error"] = 3] = "Error";
})(WorkerResponseType || (WorkerResponseType = {}));


/***/ }),

/***/ 4762:
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__extends": () => (/* binding */ __extends),
/* harmony export */   "__assign": () => (/* binding */ __assign),
/* harmony export */   "__rest": () => (/* binding */ __rest),
/* harmony export */   "__decorate": () => (/* binding */ __decorate),
/* harmony export */   "__param": () => (/* binding */ __param),
/* harmony export */   "__metadata": () => (/* binding */ __metadata),
/* harmony export */   "__awaiter": () => (/* binding */ __awaiter),
/* harmony export */   "__generator": () => (/* binding */ __generator),
/* harmony export */   "__createBinding": () => (/* binding */ __createBinding),
/* harmony export */   "__exportStar": () => (/* binding */ __exportStar),
/* harmony export */   "__values": () => (/* binding */ __values),
/* harmony export */   "__read": () => (/* binding */ __read),
/* harmony export */   "__spread": () => (/* binding */ __spread),
/* harmony export */   "__spreadArrays": () => (/* binding */ __spreadArrays),
/* harmony export */   "__spreadArray": () => (/* binding */ __spreadArray),
/* harmony export */   "__await": () => (/* binding */ __await),
/* harmony export */   "__asyncGenerator": () => (/* binding */ __asyncGenerator),
/* harmony export */   "__asyncDelegator": () => (/* binding */ __asyncDelegator),
/* harmony export */   "__asyncValues": () => (/* binding */ __asyncValues),
/* harmony export */   "__makeTemplateObject": () => (/* binding */ __makeTemplateObject),
/* harmony export */   "__importStar": () => (/* binding */ __importStar),
/* harmony export */   "__importDefault": () => (/* binding */ __importDefault),
/* harmony export */   "__classPrivateFieldGet": () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   "__classPrivateFieldSet": () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   "__classPrivateFieldIn": () => (/* binding */ __classPrivateFieldIn)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./src/app/services/open-cv.worker.ts ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4762);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ 389);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models */ 3601);


addEventListener("message", (messageEvent) => {
    const data = messageEvent.data;
    switch (data.information.requestType) {
        case _models__WEBPACK_IMPORTED_MODULE_0__.WorkerRequestType.Load: {
            try {
                handleLoadRequest(data);
            }
            catch (error) {
                handleError(error, data);
            }
            break;
        }
        case _models__WEBPACK_IMPORTED_MODULE_0__.WorkerRequestType.ExtractEchelons: {
            try {
                handleExtractEchelonRequest(data);
            }
            catch (error) {
                handleError(error, data);
            }
            break;
        }
        case _models__WEBPACK_IMPORTED_MODULE_0__.WorkerRequestType.CombineEchelons: {
            try {
                handleCombineEchelonsRequest(data);
            }
            catch (error) {
                handleError(error, data);
            }
            break;
        }
        default:
            throw new Error(`Request type ${data.information.requestType} not implemented.`);
    }
});
function handleLoadRequest(data) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__awaiter)(this, void 0, void 0, function* () {
        console.log("Recieved load request");
        // eslint-disable-next-line @typescript-eslint/dot-notation
        self["Module"] = {
            wasmBinaryFile: "assets/opencv/wasm/4.4/opencv_js.wasm",
            usingWasm: true,
            locateFile: locateFile,
            onRuntimeInitialized: () => {
                // postResponse( {information: { responseType: WorkerResponseType.Error, requestId: data.information.id, message: "dummy error"}  });
                postResponse({ information: { responseType: _models__WEBPACK_IMPORTED_MODULE_2__.WorkerResponseType.LoadCompleted, requestId: data.information.requestId, processingUnitId: data.information.processingUnitId } });
            }
        };
        // script sets global cv variable to a factory function that returns a promise with the cv object
        self.importScripts("./assets/opencv/wasm/4.4/opencv.js");
        cv = yield cv();
    });
}
function handleExtractEchelonRequest(data) {
    if (!data.content) {
        throw new Error("Image content must not be null or undefined");
    }
    const images = data.content.images;
    const extractedEchelons = new Array();
    for (const image of images) {
        const results = extractEchelons(image);
        results.forEach(result => {
            extractedEchelons.push(result);
        });
    }
    const responseInformation = createResponseInformation(_models__WEBPACK_IMPORTED_MODULE_2__.WorkerResponseType.EchelonExtracted, data.information.requestId, data.information.processingUnitId);
    const responseContent = createResponseContent(extractedEchelons);
    postResponse({ information: responseInformation, content: responseContent });
}
function handleCombineEchelonsRequest(data) {
    if (!data.content) {
        throw new Error("Image content must not be null or undefined");
    }
    const images = data.content.images;
    const result = combineEchelons(images);
    const responseInformation = createResponseInformation(_models__WEBPACK_IMPORTED_MODULE_2__.WorkerResponseType.EchelonsCombined, data.information.requestId, data.information.processingUnitId);
    const responseContent = createResponseContent(new Array(result));
    postResponse({ information: responseInformation, content: responseContent });
}
function handleError(error, data) {
    const errorMessage = `There was an error processing the request. Message:${error.message}. Line number ${error.lineno} Column number: ${error.colno}`;
    const responseInformation = createResponseInformation(_models__WEBPACK_IMPORTED_MODULE_2__.WorkerResponseType.Error, data.information.requestId, data.information.processingUnitId, errorMessage);
    postResponse({ information: responseInformation });
}
function combineEchelons(images) {
    let rows = images.reduce((height, image2) => height + image2.height, 0);
    const columns = images.reduce((cols, image2) => {
        if (cols > image2.width) {
            return cols;
        }
        else {
            return image2.width;
        }
    }, 0);
    let type = cv.CV_8UC4;
    // hconcat didn't work so we do it manually
    const resultMat = cv.Mat.ones(rows, columns, type);
    let startRow = 0;
    let endRow = images[0].height;
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
        const imageMat = cv.matFromImageData(imageData);
        rows += imageMat.rows;
        type = imageMat.type();
        imageMat.copyTo(resultMat.rowRange(startRow, endRow).colRange(0, imageMat.cols));
        if (i !== images.length - 1) {
            startRow = endRow;
            endRow += images[i + 1].height;
        }
        imageMat.delete();
    }
    const result = imageDataFromMat(resultMat);
    resultMat.delete();
    return result;
}
function extractEchelons(image) {
    const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
    const initialMat = cv.matFromImageData(imageData);
    const processedMat = cv.matFromImageData(imageData);
    // grayscale
    cv.cvtColor(processedMat, processedMat, cv.COLOR_RGBA2GRAY, 0);
    // threshold numbers were determined experimentally
    cv.threshold(processedMat, processedMat, 50, 250, cv.THRESH_BINARY);
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(processedMat, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    const imageDataResults = new Array();
    for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const rectangle = cv.boundingRect(contour);
        const aspectRatio = rectangle.width / rectangle.height;
        if (isGriffinEchelon(aspectRatio, rectangle.width) || isSangvisEchelon(aspectRatio, rectangle.width)) {
            const resultMat = initialMat.roi(rectangle);
            const echelonImageData = imageDataFromMat(resultMat);
            imageDataResults.push(echelonImageData);
            resultMat.delete();
        }
        contour.delete();
    }
    hierarchy.delete();
    contours.delete();
    processedMat.delete();
    initialMat.delete();
    // the order of the contours is reversed for some reason so we revert it back
    return imageDataResults.reverse();
}
function isGriffinEchelon(aspectRatio, width) {
    if (aspectRatio >= 6.1 && aspectRatio <= 6.5 && width > 200) {
        return true;
    }
    return false;
}
function isSangvisEchelon(aspectRatio, width) {
    if (aspectRatio >= 4.7 && aspectRatio <= 5 && width > 200) {
        return true;
    }
    return false;
}
function createResponseInformation(responseType, requestId, processingUnitId, message) {
    return { requestId: requestId, responseType: responseType, message: message, processingUnitId: processingUnitId };
}
function createResponseContent(imageData) {
    const responseImages = new Array();
    imageData.forEach(imgData => {
        responseImages.push({ imageArrayBuffer: imgData.data.buffer, height: imgData.height, width: imgData.width });
    });
    return { images: responseImages };
}
function postResponse(response) {
    if (response.content) {
        const arrayBuffers = response.content.images.map(image => image.imageArrayBuffer);
        postMessage(response, arrayBuffers);
    }
    else {
        postMessage(response);
    }
}
function locateFile(path, scriptDirectory) {
    if (path === "opencv_js.wasm") {
        return scriptDirectory + "assets/opencv/wasm/4.4/" + path;
    }
    else {
        return scriptDirectory + path;
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function imageDataFromMat(mat) {
    // converts the mat type to cv.CV_8U
    const img = new cv.Mat();
    const depth = mat.type() % 8;
    const scale = depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0;
    const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0;
    mat.convertTo(img, cv.CV_8U, scale, shift);
    // converts the img type to cv.CV_8UC4
    switch (img.type()) {
        case cv.CV_8UC1:
            cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA);
            break;
        case cv.CV_8UC3:
            cv.cvtColor(img, img, cv.COLOR_RGB2RGBA);
            break;
        case cv.CV_8UC4:
            break;
        default:
            throw new Error("Bad number of channels (Source image must have 1, 3 or 4 channels)");
    }
    const imageData = new ImageData(new Uint8ClampedArray(img.data), img.cols, img.rows);
    img.delete();
    return imageData;
}

})();

/******/ })()
;
//# sourceMappingURL=src_app_services_open-cv_worker_ts.js.map