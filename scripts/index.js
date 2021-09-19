"use strict"
/* START OF MAIN FUNCTIONS */
/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    //remove the last song playing
    let playingSongElement= document.getElementsByClassName("playing");
    if (playingSongElement.length > 0){
        playingSongElement[0].classList.remove("playing");
    }
    //play the song
    let playingSong= document.getElementById("song"+songId);
    playingSong.classList.add("playing");
    //move to next song
    let thisSongDuration = getSongByID(songId).duration;
    setTimeout(() => nextSong(playingSong) , thisSongDuration *1000);
}

/**
 * Removes a song from the player, and updates the DOM to match.
 *
 * @param {Number} songId - the ID of the song to remove
 */
 function removeSong(songId) {
     //remove from songs on DOM
    document.getElementById(`song${songId}`).remove();
    //remove from player.songs array
    let songIndex = getSongLocationByID(songId);
    player.songs.splice(songIndex, 1);
    //update player.playlists && playlists in DOM
    for (let i = 0; i < player.playlists.length; i++){
        if (player.playlists[i].songs.includes(songId)){
            updatePlaylist (i, songId);
        }
    }
}

/**
 * Adds a song to the player, and updates the DOM to match.
 */
function addSong({ title, album, artist, duration, coverArt }) {
    let newID = findAvailableID ("songs");
    let newSong = {"id": newID, title, album, artist, "duration": durationFromMMSS(duration), coverArt};
    //adding and re-sorting player.song array
    player.songs.push(newSong);
    player.songs.sort((song1 , song2) => { return song1.title > song2.title ? 1 : -1});
    const songIndex = getSongLocationByID(newID);
    //adding to DOM in place sorted by "title"
    const songs = document.getElementById("songs");
    songs.childNodes[songIndex+3].insertAdjacentElement("beforebegin", createSongElement(newSong));
}
/**
 * Acts on a click event on an element inside the songs list.
 * Should handle clicks on play buttons and remove buttons of songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleSongClickEvent(event) {
    const song = event.target.parentElement;
    let id = Number(song.id[song.id.length - 1]);
    const action = event.target.classList[0]; 
    if (action === "play"){
        playSong(id);
    } else if (action === "remove") {
        removeSong(id);
    } else {
        return;
    }
}

/**
 * Handles a click event on the button that adds songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleAddSongEvent(event) {
    //getting information from inputs
    let title = document.getElementsByName("title")[0].value;
    let album = document.getElementsByName("album")[0].value;
    let artist = document.getElementsByName("artist")[0].value;
    let duration = document.getElementsByName("duration")[0].value;
    let coverArt = document.getElementsByName("cover-art")[0].value;
    addSong({ title, album, artist, duration, coverArt });
}

/**
 * Creates a song DOM element based on a song object.
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const children = createSongChildren({ id, title, album, artist, duration, coverArt }) ;
    const classes = ["song", "box" ];
    const attrs = {id: `song${id}` }; 
    const eventListeners = {};
    return createElement("div", children, classes, attrs, eventListeners);
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const children = createPlaylistChildren({ id, name, songs });
    const classes = ["playlist", "box"];
    const attrs = {id : "playlist"+id};
    const eventListeners = {};
    return createElement("div", children, classes, attrs, eventListeners);
}

/**
 * Creates a new DOM element.
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 * @param {Object} eventListeners - the event listeners on the element
 */
function createElement(tagName, children = [], classes = [], attributes = {}, eventListeners = {}) {
    let newElement = document.createElement(tagName);
    //children
    for (let child of children){
        newElement.append(child);
    }
    //classes
    for (let clas of classes){
        newElement.classList.add(clas);
    }
    //attributes
    const attributesKeys = Object.keys(attributes);
    const attributesValues =Object.values(attributes);
    for (let i = 0; i < attributesKeys.length; i++){
        newElement.setAttribute(attributesKeys[i],attributesValues[i]);
    }
    //eventListeners
    const eventListenersKeys = Object.keys(eventListeners);
    const eventListenersValues =Object.values(eventListeners);
    for (let i = 0; i < eventListenersKeys.length; i++){
        newElement.addEventListener(eventListenersKeys[i],eventListenersValues[i]);
    }
    return newElement;
}
/* END OF MAIN FUNCTIONS */

/* START OF CREATING DOM */

addingSongsToDom (); 
addingPlaylistToDom ();

document.getElementById("add-button").addEventListener("click", handleAddSongEvent);
document.getElementById("songs").addEventListener("click", handleSongClickEvent);
/* END OF CREATING DOM */