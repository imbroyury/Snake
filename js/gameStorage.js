const KEY = 'snake_leaderboard';

export default class GameStorage {

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