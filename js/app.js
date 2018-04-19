import Game from './game';
import GameStorage from './gameStorage';

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
let game = new Game(canvasParams, playerName, scoreDOMEl, gameEndDOMEl, renderLeaderboard);

/*
 * Retrieve storage data, if there is any do the following:
 * Clear leadeboard table
 * Insert all leaderboard entries
 */
function renderLeaderboard() {
    let storageData = GameStorage.retrieveStorageData();
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
                game = new Game(canvasParams, playerName, scoreDOMEl, gameEndDOMEl, renderLeaderboard);
                game.startGame();
            }
        });
    }
});
