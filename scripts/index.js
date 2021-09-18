"use strict"
/* START OF MAIN FUNCTIONS */
/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    //remove the last song playing
    const notPlayingSong= document.getElementsByClassName("playing");
    if (notPlayingSong.length > 0){
        notPlayingSong[0].classList.remove("playing");
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
    // Your code here
}

/**
 * Adds a song to the player, and updates the DOM to match.
 */
function addSong({ title, album, artist, duration, coverArt }) {
    // Your code here
}

/**
 * Acts on a click event on an element inside the songs list.
 * Should handle clicks on play buttons and remove buttons of songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleSongClickEvent(event) {
    // Your code here
}

/**
 * Handles a click event on the button that adds songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleAddSongEvent(event) {
    // Your code here
}

/**
 * Creates a song DOM element based on a song object.
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    //creation spesific song elements
    const coverArtElem = createElement("img" , [] , ["img"], {"src" : coverArt});
    const titleElem = createElement("p" , [] , ["text" , "title"], {});
    titleElem.textContent = title;
    const albumElem = createElement("p" , [] , ["text" , "album"], {});
    albumElem.textContent = album;
    const artistElem = createElement("p" , [] , ["text" , "artist"], {});
    artistElem.textContent = artist;
    const durationElem = createElement("p" , [] , ["text" , "duration"], {});
    durationElem.textContent = durationToMMSS(duration);
    //insert them into song
    const children = [coverArtElem , titleElem , albumElem , artistElem , durationElem];
    const classes = ["song" , "box" ];
    const attrs = {onclick: `playSong(${id})` , id: `song${id}` }; 
    const eventListeners = {};
    return createElement("div", children, classes, attrs, eventListeners);
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    //creation spesific playlist elements
    const nameElem = createElement("p" , [] , ["text" , "name"], {});
    nameElem.textContent = name;
    const numberOfSongsElem = createElement("p" , [] , ["text" , "songs"], {});
    numberOfSongsElem.textContent = `${songs.length} songs`;
    const playlistDurationElem = createElement("p" , [] , ["text" , "duration"], {});
    playlistDurationElem.textContent = playlistDuration(id);
    //insert them into playlist
    const children = [nameElem , numberOfSongsElem, playlistDurationElem];
    const classes = ["playlist" , "box"];
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
    const seperateKeys = Object.keys(attributes);
    const seperateValues =Object.values(attributes);
    for (let i = 0; i < seperateKeys.length; i++)
    {
        newElement.setAttribute(seperateKeys[i],seperateValues[i]);
    }
    return newElement;
}
/* END OF MAIN FUNCTIONS */

/*START OF ASSIST FUNCTIONS*/
//play the next songs after the song we clicked on
function nextSong(playingSong){
    playingSong.classList.remove("playing"); //remove the last song playing
    if (playingSong.nextSibling !== null){
        playingSong.nextSibling.classList.add("playing");
        playingSong = document.getElementsByClassName("playing")[0]; //playingSong = next song on the list
        let songId = playingSong.id[playingSong.id.length - 1]*1; //create ID number by removing the word song from the id
        let thisSongDuration = getSongByID(songId).duration;
        setTimeout(() => nextSong(playingSong) , thisSongDuration*1000);
    } else {
        alert("out of songs");
    }
}
// Converts the duration from seconds to "mm: ss"
function durationToMMSS (duration){
    let durationMinutes = Math.floor(duration/60);
    let durationSeconds = duration % 60;
    if (durationMinutes < 10){
        durationMinutes =  "0" + durationMinutes;
    }
    if (durationSeconds < 10){
        durationSeconds = "0" + durationSeconds;
    }
    return durationMinutes + ":" + durationSeconds;
}
//The function receives a playlist id and returns the total duration of the playlist in "mm: ss" format
function playlistDuration(id) {
    let playlistLocation = getPlaylistLocationByID(id);
    if (playlistLocation === undefined){
        return new Error ("Error - Can't find playlist");
    }
    let playlistSongsArray = player.playlists[playlistLocation].songs;
    let totalDuration = 0;
    for (let songID of playlistSongsArray){
        let song = getSongByID(songID)
        totalDuration += song.duration;
    }
    return durationToMMSS(totalDuration);
}
//The function receives a song id and returns a matching song object
function getSongByID (id) {
    for (let song of player.songs){
        if (song.id === id){
        return song;
      }
    }
    return undefined;
  }
// The function receives a playlist id and returns its place in the player.playlists array
  function getPlaylistLocationByID (id) {
    for (let i = 0; i < player.playlists.length ; i++){
      if (player.playlists[i].id === id){
        return i;
      }
    }
    return undefined;
  }
  
  function addingSongsToDom (){
      let songs = document.getElementById("songs");
      const sortSongsArray = player.songs.slice().sort((song1 , song2) => { return song1.title > song2.title ? 1 : -1});
      for (let song of sortSongsArray){
          let newSong = createSongElement(song);
          songs.appendChild(newSong);
      }
  }
  
  function addingPlaylistToDom (){
      let playlists = document.getElementById("playlists");
      const sortPlaylistArray = player.playlists.slice().sort((playlist1 , playlist2) => { return playlist1.name > playlist2.name ? 1 : -1});
      for (let playlist of sortPlaylistArray){
          let newPlaylist = createPlaylistElement(playlist);
          playlists.appendChild(newPlaylist);
      }
  }
/*END OF ASSIST FUNCTIONS*/

/* START OF CREATING DOM */

addingSongsToDom (); 
addingPlaylistToDom ();

// Making the add-song-button actually do something
document.getElementById("add-button").addEventListener("click", handleAddSongEvent);
/* END OF CREATING DOM */