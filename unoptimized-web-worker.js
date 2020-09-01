/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js?!./node_modules/@ngtools/webpack/src/index.js!./src/app/services/open-cv.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js?!./node_modules/@ngtools/webpack/src/index.js!./src/app/services/open-cv.worker.ts":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js??ref--17-0!./node_modules/@ngtools/webpack/src!./src/app/services/open-cv.worker.ts ***!
  \********************************************************************************************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models */ "./src/app/models/index.ts");


addEventListener("message", (messageEvent) => {
    const data = messageEvent.data;
    switch (data.information.requestType) {
        case _models__WEBPACK_IMPORTED_MODULE_1__["WorkerRequestType"].Load: {
            handleLoadRequest(data);
            break;
        }
        case _models__WEBPACK_IMPORTED_MODULE_1__["WorkerRequestType"].ExtractEchelons: {
            handleExtractEchelonRequest(data);
            break;
        }
        case _models__WEBPACK_IMPORTED_MODULE_1__["WorkerRequestType"].CombineEchelons: {
            handleCombineEchelonsRequest(data);
            break;
        }
        default:
            throw new Error(`Request type ${data.information.requestType} not implemented.`);
    }
});
function handleLoadRequest(data) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
        console.log("Recieved load request");
        self["Module"] = {
            wasmBinaryFile: 'assets/opencv/wasm/4.4/opencv_js.wasm',
            usingWasm: true,
            locateFile: locateFile,
            onRuntimeInitialized: () => {
                postResponse({ information: { responseType: _models__WEBPACK_IMPORTED_MODULE_1__["WorkerResponseType"].LoadCompleted, requestId: data.information.id } });
            }
        };
        // script sets global cv variable to a factory function that returns a promise with the cv object
        self.importScripts('./assets/opencv/wasm/4.4/opencv.js');
        cv = yield cv();
    });
}
function handleExtractEchelonRequest(data) {
    if (!data.content)
        throw new Error("Image content must not be null or undefined");
    const images = data.content.images;
    let extractedEchelons = new Array();
    for (let i = 0; i < images.length; i++) {
        const results = extractEchelons(images[i]);
        results.forEach(result => {
            extractedEchelons.push(result);
        });
    }
    const responseInformation = createResponseInformation(_models__WEBPACK_IMPORTED_MODULE_1__["WorkerResponseType"].EchelonExtracted, data.information.id, true);
    const responseContent = createResponseContent(extractedEchelons);
    postResponse({ information: responseInformation, content: responseContent });
}
function handleCombineEchelonsRequest(data) {
    if (!data.content)
        throw new Error("Image content must not be null or undefined");
    const images = data.content.images;
    const result = combineEchelons(images);
    const responseInformation = createResponseInformation(_models__WEBPACK_IMPORTED_MODULE_1__["WorkerResponseType"].EchelonsCombined, data.information.id, true);
    const responseContent = createResponseContent(new Array(result));
    postResponse({ information: responseInformation, content: responseContent });
}
function combineEchelons(images) {
    let rows = images.reduce((height, image2) => height + image2.height, 0);
    let cols = images.reduce((cols, image2) => {
        if (cols > image2.width)
            return cols;
        else
            return image2.width;
    }, 0);
    let type = cv.CV_8UC4;
    //hconcat didn't work so we do it manually
    let resultMat = cv.Mat.ones(rows, cols, type);
    let startRow = 0;
    let endRow = images[0].height;
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
        const imageMat = cv.matFromImageData(imageData);
        rows += imageMat.rows;
        type = imageMat.type();
        imageMat.copyTo(resultMat.rowRange(startRow, endRow).colRange(0, imageMat.cols));
        if (i != images.length - 1) {
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
    let processedMat = cv.matFromImageData(imageData);
    //let destinationMat = cv.Mat.zeros(processedMat.rows, processedMat.cols, cv.CV_8UC3);
    //grayscale
    cv.cvtColor(processedMat, processedMat, cv.COLOR_RGBA2GRAY, 0);
    //threshold numbers were determined experimentally
    cv.threshold(processedMat, processedMat, 50, 250, cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(processedMat, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    const imageDataResults = new Array();
    for (let i = 0; i < contours.size(); i++) {
        let contour = contours.get(i);
        // let approximation = new cv.Mat();
        // let perimeter = cv.arcLength(contour, true);
        // cv.approxPolyDP(contour, approximation, 0.04 * perimeter, true);
        const rectangle = cv.boundingRect(contour);
        const aspectRatio = rectangle.width / rectangle.height;
        if (aspectRatio >= 6.1 && aspectRatio <= 6.5 && rectangle.width > 100) {
            console.log(`${i} : Width:${rectangle.width} Height:${rectangle.height}`);
            // const contoursColor = new cv.Scalar(255, 255, 255);
            // const rectangleColor = new cv.Scalar(255, 0, 0);
            // cv.drawContours(destinationMat, contours, 0, contoursColor, 1, 8, hierarchy, 100);
            // let point1 = new cv.Point(rectangle.x, rectangle.y);
            // let point2 = new cv.Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
            // cv.rectangle(destinationMat, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
            const resultMat = initialMat.roi(rectangle);
            const echelonImageData = imageDataFromMat(resultMat);
            imageDataResults.push(echelonImageData);
            resultMat.delete();
        }
        //approximation.delete();
        contour.delete();
    }
    hierarchy.delete();
    contours.delete();
    processedMat.delete();
    initialMat.delete();
    return imageDataResults;
}
function createResponseInformation(responseType, requestId, requestCompleted) {
    return { requestId: requestId, responseType: responseType, requestCompleted: requestCompleted };
}
function createResponseContent(imageData) {
    let responseImages = new Array();
    imageData.forEach(imageData => {
        responseImages.push({ imageArrayBuffer: imageData.data.buffer, height: imageData.height, width: imageData.width });
    });
    return { images: responseImages };
}
function postResponse(response) {
    if (response.content) {
        const arrayBuffers = response.content.images.map(image => image.imageArrayBuffer);
        postMessage(response, arrayBuffers);
    }
    else
        postMessage(response);
}
function locateFile(path, scriptDirectory) {
    if (path === 'opencv_js.wasm') {
        return scriptDirectory + "assets/opencv/wasm/4.4/" + path;
    }
    else {
        return scriptDirectory + path;
    }
}
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
            throw new Error('Bad number of channels (Source image must have 1, 3 or 4 channels)');
    }
    const imageData = new ImageData(new Uint8ClampedArray(img.data), img.cols, img.rows);
    img.delete();
    return imageData;
}


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
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
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
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
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
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

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./src/app/models/Echelon.ts":
/*!***********************************!*\
  !*** ./src/app/models/Echelon.ts ***!
  \***********************************/
/*! exports provided: Echelon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Echelon", function() { return Echelon; });
let Echelon = /*@__PURE__*/ (() => {
    class Echelon {
        constructor(imageData, selected) {
            this.imageData = new ImageData(1, 1);
            this.isSelected = true;
            this._id = Echelon.idCounter++;
            this.imageData = imageData;
        }
        get id() {
            return this._id;
        }
    }
    Echelon.idCounter = 0;
    return Echelon;
})();


/***/ }),

/***/ "./src/app/models/IImage.ts":
/*!**********************************!*\
  !*** ./src/app/models/IImage.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/IRequestContent.ts":
/*!*******************************************!*\
  !*** ./src/app/models/IRequestContent.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/IRequestInformation.ts":
/*!***********************************************!*\
  !*** ./src/app/models/IRequestInformation.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/IResponseContent.ts":
/*!********************************************!*\
  !*** ./src/app/models/IResponseContent.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/IResponseInformation.ts":
/*!************************************************!*\
  !*** ./src/app/models/IResponseInformation.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/IWorkerRequestMessageData.ts":
/*!*****************************************************!*\
  !*** ./src/app/models/IWorkerRequestMessageData.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/IWorkerRequestMessageEvent.ts":
/*!******************************************************!*\
  !*** ./src/app/models/IWorkerRequestMessageEvent.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/IWorkerResponseMessageData.ts":
/*!******************************************************!*\
  !*** ./src/app/models/IWorkerResponseMessageData.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/IWorkerResponseMessageEvent.ts":
/*!*******************************************************!*\
  !*** ./src/app/models/IWorkerResponseMessageEvent.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/models/WorkerRequestType.ts":
/*!*********************************************!*\
  !*** ./src/app/models/WorkerRequestType.ts ***!
  \*********************************************/
/*! exports provided: WorkerRequestType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkerRequestType", function() { return WorkerRequestType; });
var WorkerRequestType = /*@__PURE__*/ (function (WorkerRequestType) {
    WorkerRequestType[WorkerRequestType["Load"] = 0] = "Load";
    WorkerRequestType[WorkerRequestType["ExtractEchelons"] = 1] = "ExtractEchelons";
    WorkerRequestType[WorkerRequestType["CombineEchelons"] = 2] = "CombineEchelons";
    return WorkerRequestType;
})({});


/***/ }),

/***/ "./src/app/models/WorkerResponseType.ts":
/*!**********************************************!*\
  !*** ./src/app/models/WorkerResponseType.ts ***!
  \**********************************************/
/*! exports provided: WorkerResponseType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkerResponseType", function() { return WorkerResponseType; });
var WorkerResponseType = /*@__PURE__*/ (function (WorkerResponseType) {
    WorkerResponseType[WorkerResponseType["LoadCompleted"] = 0] = "LoadCompleted";
    WorkerResponseType[WorkerResponseType["EchelonExtracted"] = 1] = "EchelonExtracted";
    WorkerResponseType[WorkerResponseType["EchelonsCombined"] = 2] = "EchelonsCombined";
    WorkerResponseType[WorkerResponseType["Error"] = 3] = "Error";
    return WorkerResponseType;
})({});


/***/ }),

/***/ "./src/app/models/index.ts":
/*!*********************************!*\
  !*** ./src/app/models/index.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IImage */ "./src/app/models/IImage.ts");
/* harmony import */ var _IImage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_IImage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IImage__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IImage__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _WorkerRequestType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WorkerRequestType */ "./src/app/models/WorkerRequestType.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WorkerRequestType", function() { return _WorkerRequestType__WEBPACK_IMPORTED_MODULE_1__["WorkerRequestType"]; });

/* harmony import */ var _IRequestContent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IRequestContent */ "./src/app/models/IRequestContent.ts");
/* harmony import */ var _IRequestContent__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_IRequestContent__WEBPACK_IMPORTED_MODULE_2__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IRequestContent__WEBPACK_IMPORTED_MODULE_2__) if(["WorkerRequestType","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IRequestContent__WEBPACK_IMPORTED_MODULE_2__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _IRequestInformation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IRequestInformation */ "./src/app/models/IRequestInformation.ts");
/* harmony import */ var _IRequestInformation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_IRequestInformation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IRequestInformation__WEBPACK_IMPORTED_MODULE_3__) if(["WorkerRequestType","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IRequestInformation__WEBPACK_IMPORTED_MODULE_3__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _IWorkerRequestMessageData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./IWorkerRequestMessageData */ "./src/app/models/IWorkerRequestMessageData.ts");
/* harmony import */ var _IWorkerRequestMessageData__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_IWorkerRequestMessageData__WEBPACK_IMPORTED_MODULE_4__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IWorkerRequestMessageData__WEBPACK_IMPORTED_MODULE_4__) if(["WorkerRequestType","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IWorkerRequestMessageData__WEBPACK_IMPORTED_MODULE_4__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _IWorkerRequestMessageEvent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./IWorkerRequestMessageEvent */ "./src/app/models/IWorkerRequestMessageEvent.ts");
/* harmony import */ var _IWorkerRequestMessageEvent__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_IWorkerRequestMessageEvent__WEBPACK_IMPORTED_MODULE_5__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IWorkerRequestMessageEvent__WEBPACK_IMPORTED_MODULE_5__) if(["WorkerRequestType","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IWorkerRequestMessageEvent__WEBPACK_IMPORTED_MODULE_5__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _WorkerResponseType__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./WorkerResponseType */ "./src/app/models/WorkerResponseType.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WorkerResponseType", function() { return _WorkerResponseType__WEBPACK_IMPORTED_MODULE_6__["WorkerResponseType"]; });

/* harmony import */ var _IResponseContent__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./IResponseContent */ "./src/app/models/IResponseContent.ts");
/* harmony import */ var _IResponseContent__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_IResponseContent__WEBPACK_IMPORTED_MODULE_7__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IResponseContent__WEBPACK_IMPORTED_MODULE_7__) if(["WorkerRequestType","WorkerResponseType","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IResponseContent__WEBPACK_IMPORTED_MODULE_7__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _IResponseInformation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./IResponseInformation */ "./src/app/models/IResponseInformation.ts");
/* harmony import */ var _IResponseInformation__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_IResponseInformation__WEBPACK_IMPORTED_MODULE_8__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IResponseInformation__WEBPACK_IMPORTED_MODULE_8__) if(["WorkerRequestType","WorkerResponseType","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IResponseInformation__WEBPACK_IMPORTED_MODULE_8__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _IWorkerResponseMessageData__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./IWorkerResponseMessageData */ "./src/app/models/IWorkerResponseMessageData.ts");
/* harmony import */ var _IWorkerResponseMessageData__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_IWorkerResponseMessageData__WEBPACK_IMPORTED_MODULE_9__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IWorkerResponseMessageData__WEBPACK_IMPORTED_MODULE_9__) if(["WorkerRequestType","WorkerResponseType","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IWorkerResponseMessageData__WEBPACK_IMPORTED_MODULE_9__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _IWorkerResponseMessageEvent__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./IWorkerResponseMessageEvent */ "./src/app/models/IWorkerResponseMessageEvent.ts");
/* harmony import */ var _IWorkerResponseMessageEvent__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_IWorkerResponseMessageEvent__WEBPACK_IMPORTED_MODULE_10__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IWorkerResponseMessageEvent__WEBPACK_IMPORTED_MODULE_10__) if(["WorkerRequestType","WorkerResponseType","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IWorkerResponseMessageEvent__WEBPACK_IMPORTED_MODULE_10__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _Echelon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Echelon */ "./src/app/models/Echelon.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Echelon", function() { return _Echelon__WEBPACK_IMPORTED_MODULE_11__["Echelon"]; });















/***/ })

/******/ });