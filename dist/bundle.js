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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/app.js":
/*!*******************!*\
  !*** ./js/app.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./js/game.js");
/* harmony import */ var _gameStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameStorage */ "./js/gameStorage.js");



const canvasDOMEl = document.getElementById('canvas');
canvasDOMEl.width = 500;
canvasDOMEl.height = 500;

// Default canvas parameters
const canvasParams = {
    canvasDOMEl,
    shadeOfGray: 150,
    gridSize: 25,
    gridLineWidth: 1
};

const scoreDOMEl = document.getElementById('score');
const scoreNameDOMEl = document.getElementById('score-name');
const gameEndDOMEl = document.getElementById('game-end-msg');

const playerNameModal = document.querySelector('.player-name-modal');
const playerNameForm = document.forms.nameform;
const playerNameErrorDOMEl = playerNameForm.querySelector('.error-message');

const leaderboardTable = document.querySelector('.leaderboard-table');
const leaderboardTableBody = leaderboardTable.tBodies[0];

let playerName = '';

// Initialize new Game to prerender canvas
let game = new _game__WEBPACK_IMPORTED_MODULE_0__["default"](canvasParams, playerName, scoreDOMEl, gameEndDOMEl, renderLeaderboard);

/*
 * Retrieve storage data, if there is any do the following:
 * Clear leadeboard table
 * Insert all leaderboard entries
 */
function renderLeaderboard() {
    let storageData = _gameStorage__WEBPACK_IMPORTED_MODULE_1__["default"].retrieveStorageData();
    if (storageData) {
        // Clear table body
        while (leaderboardTableBody.rows.length > 0) {
            leaderboardTableBody.deleteRow(0);
        }
        /*
         * Display only 15 latest entries
         * Easily customizable because we store all entries
         * in the game storage
         */
        storageData.splice(15);
        storageData.forEach((entry, index) => {
            const entryRow = leaderboardTableBody.insertRow();
            const scoreIndexCell = entryRow.insertCell(0);
            const playerNameCell = entryRow.insertCell(1);
            const playerScoreCell = entryRow.insertCell(2);
            scoreIndexCell.innerHTML = index + 1;
            playerNameCell.innerHTML = entry.player;
            playerScoreCell.innerHTML = entry.score;
        });
    }
}

renderLeaderboard();

/*
 * App flow is the following:
 * player is prompted to enter his / her username
 * if the name is correct, we delete the user prompt from the DOM,
 * create a SPACE keydown listener to create a new Game
 */
playerNameForm.addEventListener('submit', function submitPlayerNameForm(event) {
    event.preventDefault();
    const name = event.target.elements.nameinput.value.trim();
    if (!name) {
        playerNameErrorDOMEl.innerText = 'Name not entered';
    } else if (name.length > 10) {
        playerNameErrorDOMEl.innerText = 'Under 10 chars please';
    } else {
        playerName = name;
        playerNameModal.remove();
        scoreNameDOMEl.innerHTML = `Hi, ${name}! Your `;
        playerNameForm.removeEventListener('submit', submitPlayerNameForm);

        document.addEventListener('keydown', event => {
            if (event.keyCode === 32) {
                event.preventDefault();
                game = new _game__WEBPACK_IMPORTED_MODULE_0__["default"](canvasParams, playerName, scoreDOMEl, gameEndDOMEl, renderLeaderboard);
                game.startGame();
            }
        });
    }
});


/***/ }),

/***/ "./js/canvas.js":
/*!**********************!*\
  !*** ./js/canvas.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Canvas; });
class Canvas {
    constructor({gridSize, gridLineWidth, shadeOfGray, canvasDOMEl}) {
        this.gray = shadeOfGray;
        this.gridSize = gridSize;
        this.gridLineWidth = gridLineWidth;
        this.canvas = canvasDOMEl;
        this.cw = canvasDOMEl.width;
        this.ch = canvasDOMEl.height;
        this.ctx = canvasDOMEl.getContext('2d');
    }

    drawGridBackground() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(255, 255, 255)';
        ctx.fillRect(0, 0, this.cw, this.ch);
        ctx.lineWidth = this.gridLineWidth;
        ctx.strokeStyle = `rgb(${this.gray}, ${this.gray}, ${this.gray})`;
        for (let i = 0; i <= this.cw; i += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.ch);
            ctx.stroke();
        }
        for (let i = 0; i <= this.ch; i += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(this.cw, i);
            ctx.stroke();
        }
    }

    drawElements(snake, food) {
        snake.draw(this.ctx, this.gridLineWidth, this.gridSize);
        food.draw(this.ctx, this.gridLineWidth, this.gridSize);
    }
}

/***/ }),

/***/ "./js/food.js":
/*!********************!*\
  !*** ./js/food.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Food; });
/* harmony import */ var _libs_randomColor_min__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/randomColor.min */ "./libs/randomColor.min.js");
/* harmony import */ var _libs_randomColor_min__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_libs_randomColor_min__WEBPACK_IMPORTED_MODULE_0__);
/*
 * Using a tiny library for generating nice dark colors
 * https://github.com/davidmerfield/randomColor
 */


class Food {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = _libs_randomColor_min__WEBPACK_IMPORTED_MODULE_0___default()({luminosity: 'dark'});
    }

    draw(canvasCtx, canvasGridLineWidth) {
        canvasCtx.fillStyle = this.color;
        canvasCtx.fillRect(
            this.x + canvasGridLineWidth / 2,
            this.y + canvasGridLineWidth / 2,
            this.size - canvasGridLineWidth,
            this.size - canvasGridLineWidth
        );
    }
}

/***/ }),

/***/ "./js/game.js":
/*!********************!*\
  !*** ./js/game.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Game; });
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ "./js/canvas.js");
/* harmony import */ var _snake__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./snake */ "./js/snake.js");
/* harmony import */ var _food__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./food */ "./js/food.js");
/* harmony import */ var _gameStorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameStorage */ "./js/gameStorage.js");





class Game {
    constructor(canvasParams, playerName, scoreDOMEl, gameEndDOMEl, gameEndCallback) {
        this.canvas = new _canvas__WEBPACK_IMPORTED_MODULE_0__["default"](canvasParams);
        this.snake = new _snake__WEBPACK_IMPORTED_MODULE_1__["default"](canvasParams.gridSize, canvasParams.gridSize, canvasParams.gridSize);
        this.food = new _food__WEBPACK_IMPORTED_MODULE_2__["default"](...this.getRandomFoodPosition(), canvasParams.gridSize);
        this.gameOn = true;
        this.rafID = null;
        this.score = 0;
        this.scoreDOMEl = scoreDOMEl;
        this.gameEndDOMEl = gameEndDOMEl;
        this.playerName = playerName;
        this.gameEndCallback = gameEndCallback;
        this.prepareGame();
    }

    prepareGame() {
        this.canvas.drawGridBackground();
        this.gameEndDOMEl.classList.remove('visible');
    }

    startGame() {
        this.resetGameScore();
        this.addKeyDownListener();
        requestAnimationFrame(this.gameProcess.bind(this));
    }

    endGame() {
        cancelAnimationFrame(this.rafID);
        this.removeKeyDownListener();
        this.gameEndDOMEl.classList.add('visible');
        if (this.score > 0) _gameStorage__WEBPACK_IMPORTED_MODULE_3__["default"].setPlayerScore(this.playerName, this.score);
        this.gameEndCallback();
    }

    gameProcess() {
        this.canvas.drawGridBackground();
        this.canvas.drawElements(this.snake, this.food);

        if (this.gameOn) {
            if (this.rafID % 5 === 0) {
                // Change snake direction if scheduled
                this.snake.changeDirection();
                // If snake collided with self / canvas edge stop the game
                if (this.snake.checkOffCanvas(this.canvas.cw, this.canvas.ch) || this.snake.checkSelfCollision()) {
                    this.gameOn = false;
                } else {
                    // Update position if no collision detected
                    this.snake.updatePosition();
                }

                if (this.snake.isFoodEaten(this.food)) {
                    this.snake.addTailPiece();
                    this.snake.paintTail(this.food.color);
                    this.resetFood();
                    this.updateGameScore();
                }
            }
            this.rafID = requestAnimationFrame(this.gameProcess.bind(this));
        } else {
            this.endGame();
        }
    }

    getRandomFoodPosition() {
        let maxGridWidth = this.canvas.cw / this.canvas.gridSize;
        let maxGridHeight = this.canvas.ch / this.canvas.gridSize;
        let xPosition, yPosition;
        let forbiddenPosition = this.snake.getSnakePosition();

        do {
            xPosition = (Math.random() * maxGridWidth|0) * this.canvas.gridSize;
            yPosition = (Math.random() * maxGridHeight|0) * this.canvas.gridSize;
        } while (forbiddenPosition.filter(snakePart => snakePart.x === xPosition && snakePart.y === yPosition).length > 0);

        return [xPosition, yPosition];
    }

    resetFood() {
        this.food = new _food__WEBPACK_IMPORTED_MODULE_2__["default"](...this.getRandomFoodPosition(), this.canvas.gridSize);
    }

    resetGameScore() {
        this.score = 0;
        this.scoreDOMEl.innerText = 0;
    }

    updateGameScore () {
        this.score++;
        this.scoreDOMEl.innerText = this.score;
    }

    handleEvent(event) {
        if (event.type === 'keydown') {
            const keyCode = event.keyCode;
            if (keyCode === 38 || keyCode === 40 || keyCode === 37 || keyCode === 39) {
                event.preventDefault();
            }
            if (keyCode === 38 || keyCode === 87) {
                this.snake.scheduleMovementDirectionChange({x: 0, y: -1});
            } else if (keyCode === 40 || keyCode === 83) {
                this.snake.scheduleMovementDirectionChange({x: 0, y: 1});
            } else if (keyCode === 37 || keyCode === 65) {
                this.snake.scheduleMovementDirectionChange({x: -1, y: 0});
            } else if(keyCode === 39 || keyCode === 68) {
                this.snake.scheduleMovementDirectionChange({x: 1, y: 0});
            }
        }
    }

    addKeyDownListener() {
        document.addEventListener('keydown', this);
    }

    removeKeyDownListener() {
        document.removeEventListener('keydown', this);
    }
}

/***/ }),

/***/ "./js/gameStorage.js":
/*!***************************!*\
  !*** ./js/gameStorage.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return GameStorage; });
const KEY = 'snake_leaderboard';

class GameStorage {

    /*
     * Retrieves data from Local Storage
     * If an entry exists, gets it,
     * converts to an array and sorts it
     * Else returns null
     */
    static retrieveStorageData() {
        let data = localStorage.getItem(KEY);
        if (data) {
            data = JSON.parse(data);
            data.sort(sortEntriesByScore);
        }
        console.log(data);
        return data;
    }

    // Store only best 15 entries in Local Storage
    static setPlayerScore(player, score) {
        let data = GameStorage.retrieveStorageData();
        if (data) {
            data.push({player, score});
            data.sort(sortEntriesByScore);
        } else {
            data = [{player, score}];
        }
        localStorage.setItem(KEY, JSON.stringify(data));
    }
}

function sortEntriesByScore(a, b) {
    if (a.score > b.score) {
        return -1;
    } else if (a.score < b.score) {
        return 1;
    } else {
        return 0;
    }
}

/***/ }),

/***/ "./js/snake.js":
/*!*********************!*\
  !*** ./js/snake.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Snake; });
class Snake {
    constructor (x, y, size) {
        this.size = size;
        this.movementDirection = {x: 1, y: 0};
        this.head = new SnakePart(x, y);
        this.headColor = '#000000';
        this.tail = [];
        this.tailColor = '#000000';
        this.directionChangeArray = [];
    }

    updatePosition() {
        // Head
        this.head.incrementPosition(this.movementDirection.x * this.size, this.movementDirection.y * this.size);
        // Tail
        if (this.tail.length > 0) {
            for (let i = this.tail.length - 1; i >= 0; i--) {
                if (i === 0) {
                    // Set first tail element to previous position of head
                    this.tail[i].setPosition(this.head.x - (this.movementDirection.x * this.size),
                        this.head.y - (this.movementDirection.y * this.size));
                } else {
                    // Update other tail elements
                    this.tail[i].setPosition(this.tail[i - 1].x, this.tail[i - 1].y);
                }
            }
        }
    }

    scheduleMovementDirectionChange(direction) {
        let directionToCompare = this.movementDirection;

        /*
         * If we have direction changes pushed we check against the last scheduled
         * direction rather than against current direction
         */
        if (this.directionChangeArray.length > 0) {
            directionToCompare = this.directionChangeArray[this.directionChangeArray.length - 1];
        }

        if (Math.abs(directionToCompare.x) !== Math.abs(direction.x) ||
            Math.abs(directionToCompare.y) !== Math.abs(direction.y)) {
            this.directionChangeArray.push(direction);
        }
    }

    changeDirection() {
        if (this.directionChangeArray.length > 0) {
            this.movementDirection = this.directionChangeArray.shift();
        }
    }
    // Canvas Edge Mode
    checkOffCanvas(width, height) {
        const dX = this.movementDirection.x * this.size;
        const dY = this.movementDirection.y * this.size;
        return this.head.x + dX >= width ||
               this.head.x + dX < 0 ||
               this.head.y + dY >= height ||
               this.head.y + dY < 0;
    }

    checkSelfCollision() {
        const dX = this.movementDirection.x * this.size;
        const dY = this.movementDirection.y * this.size;
        return this.tail.some(piece => piece.x === this.head.x + dX && piece.y === this.head.y + dY);
    }

    isFoodEaten(food) {
        return this.head.x === food.x && this.head.y === food.y;
    }

    // Add a new piece directly on head's position. It will be changed during updatePosition()
    addTailPiece() {
        this.tail.unshift(new SnakePart(this.head.x, this.head.y));
    }

    paintTail(color) {
        this.tailColor = color;
    }

    draw(canvasCtx, canvasGridLineWidth) {
        this.head.drawSelf(canvasCtx, canvasGridLineWidth, this.size, this.headColor);
        this.tail.forEach(piece => piece.drawSelf(canvasCtx, canvasGridLineWidth, this.size, this.tailColor));
    }

    getSnakePosition() {
        return [this.head, ...this.tail];
    }
}

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    incrementPosition(dX, dY) {
        this.x += dX;
        this.y += dY;
    }

    drawSelf (canvasCtx, canvasGridLineWidth, size, color) {
        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(
            this.x + canvasGridLineWidth / 2,
            this.y + canvasGridLineWidth / 2,
            size - canvasGridLineWidth,
            size - canvasGridLineWidth
        );
    }
}

/***/ }),

/***/ "./libs/randomColor.min.js":
/*!*********************************!*\
  !*** ./libs/randomColor.min.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {!function(r,e){if(true){var n=e();"object"==typeof module&&module&&module.exports&&(exports=module.exports=n),exports.randomColor=n}else{}}(this,function(){function r(r){var e=o(r.hue),n=i(e);return n<0&&(n=360+n),n}function e(r,e){if("monochrome"===e.hue)return 0;if("random"===e.luminosity)return i([0,100]);var n=u(r),t=n[0],a=n[1];switch(e.luminosity){case"bright":t=55;break;case"dark":t=a-10;break;case"light":a=55}return i([t,a])}function n(r,e,n){var t=a(r,e),o=100;switch(n.luminosity){case"dark":o=t+20;break;case"light":t=(o+t)/2;break;case"random":t=0,o=100}return i([t,o])}function t(r,e){switch(e.format){case"hsvArray":return r;case"hslArray":return d(r);case"hsl":var n=d(r);return"hsl("+n[0]+", "+n[1]+"%, "+n[2]+"%)";case"hsla":var t=d(r),a=e.alpha||Math.random();return"hsla("+t[0]+", "+t[1]+"%, "+t[2]+"%, "+a+")";case"rgbArray":return f(r);case"rgb":return"rgb("+f(r).join(", ")+")";case"rgba":var o=f(r),a=e.alpha||Math.random();return"rgba("+o.join(", ")+", "+a+")";default:return c(r)}}function a(r,e){for(var n=s(r).lowerBounds,t=0;t<n.length-1;t++){var a=n[t][0],o=n[t][1],u=n[t+1][0],i=n[t+1][1];if(e>=a&&e<=u){var c=(i-o)/(u-a);return c*e+(o-c*a)}}return 0}function o(r){if("number"==typeof parseInt(r)){var e=parseInt(r);if(e<360&&e>0)return[e,e]}if("string"==typeof r)if(m[r]){var n=m[r];if(n.hueRange)return n.hueRange}else if(r.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)){const t=h(r)[0];return[t,t]}return[0,360]}function u(r){return s(r).saturationRange}function s(r){r>=334&&r<=360&&(r-=360);for(var e in m){var n=m[e];if(n.hueRange&&r>=n.hueRange[0]&&r<=n.hueRange[1])return m[e]}return"Color not found"}function i(r){if(null===v)return Math.floor(r[0]+Math.random()*(r[1]+1-r[0]));var e=r[1]||1,n=r[0]||0;v=(9301*v+49297)%233280;var t=v/233280;return Math.floor(n+t*(e-n))}function c(r){function e(r){var e=r.toString(16);return 1==e.length?"0"+e:e}var n=f(r);return"#"+e(n[0])+e(n[1])+e(n[2])}function l(r,e,n){var t=n[0][0],a=n[n.length-1][0],o=n[n.length-1][1],u=n[0][1];m[r]={hueRange:e,lowerBounds:n,saturationRange:[t,a],brightnessRange:[o,u]}}function f(r){var e=r[0];0===e&&(e=1),360===e&&(e=359),e/=360;var n=r[1]/100,t=r[2]/100,a=Math.floor(6*e),o=6*e-a,u=t*(1-n),s=t*(1-o*n),i=t*(1-(1-o)*n),c=256,l=256,f=256;switch(a){case 0:c=t,l=i,f=u;break;case 1:c=s,l=t,f=u;break;case 2:c=u,l=t,f=i;break;case 3:c=u,l=s,f=t;break;case 4:c=i,l=u,f=t;break;case 5:c=t,l=u,f=s}return[Math.floor(255*c),Math.floor(255*l),Math.floor(255*f)]}function h(r){r=r.replace(/^#/,""),r=3===r.length?r.replace(/(.)/g,"$1$1"):r;const e=parseInt(r.substr(0,2),16)/255,n=parseInt(r.substr(2,2),16)/255,t=parseInt(r.substr(4,2),16)/255,a=Math.max(e,n,t),o=a-Math.min(e,n,t),u=a?o/a:0;switch(a){case e:return[(n-t)/o%6*60||0,u,a];case n:return[60*((t-e)/o+2)||0,u,a];case t:return[60*((e-n)/o+4)||0,u,a]}}function d(r){var e=r[0],n=r[1]/100,t=r[2]/100,a=(2-n)*t;return[e,Math.round(n*t/(a<1?a:2-a)*1e4)/100,a/2*100]}function g(r){for(var e=0,n=0;n!==r.length&&!(e>=Number.MAX_SAFE_INTEGER);n++)e+=r.charCodeAt(n);return e}var v=null,m={};!function(){l("monochrome",null,[[0,0],[100,0]]),l("red",[-26,18],[[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]),l("orange",[19,46],[[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]),l("yellow",[47,62],[[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]),l("green",[63,178],[[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]),l("blue",[179,257],[[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]),l("purple",[258,282],[[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]),l("pink",[283,334],[[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]])}();var p=function(a){if(a=a||{},void 0!==a.seed&&null!==a.seed&&a.seed===parseInt(a.seed,10))v=a.seed;else if("string"==typeof a.seed)v=g(a.seed);else{if(void 0!==a.seed&&null!==a.seed)throw new TypeError("The seed value must be an integer or string");v=null}var o,u,s;if(null!==a.count&&void 0!==a.count){var i=a.count,c=[];for(a.count=null;i>c.length;)v&&a.seed&&(a.seed+=1),c.push(p(a));return a.count=i,c}return o=r(a),u=e(o,a),s=n(o,u,a),t([o,u,s],a)};return p});
//# sourceMappingURL=randomColor.min.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map