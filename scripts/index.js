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
     //remove from songs on DOM
    document.getElementById(`song${songId}`).remove();
    //remove from player.songs array
    let songIndex = getSongLocationByID(songId);
    player.songs.splice(songIndex, 1);
    //update palyer.playlists && playlists in DOM
    for (let i = 0; i < player.playlists.length; i++){
        if (player.playlists[i].songs.includes(songId)){
            removeSongFromPlaylist(songId , i);
          }
        let currrentId = player.playlists[i].id;
        let playlistElem = document.getElementById(`playlist${currrentId}`).childNodes;
        let numOfSongs = player.playlists[i].songs.length;
        playlistElem[1].textContent = `${numOfSongs} songs`;
        let playlistDuration = playlistDuration(currrentId);
        playlistElem[2].textContent = playlistDuration;
    }
}

/**
 * Adds a song to the player, and updates the DOM to match.
 */
function addSong() {
    let title = document.getElementsByName("title")[0].value;
    let album = document.getElementsByName("album")[0].value;
    let artist = document.getElementsByName("artist")[0].value;
    let duration = document.getElementsByName("duration")[0].value;
    let newID = findAvailableID ("songs");
    let coverArt = document.getElementsByName("cover-art")[0].value;
    let newSong = {"id" :newID, title, album, artist, "duration" : durationFromMMSS(duration), coverArt};
    player.songs.push(newSong);
    songs.append(createSongElement(newSong));
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
    addSong();
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
    const playElem = createElement("input" , [] , ["play"], {"type" : "button" , "value": "▶"});
    const removeElem = createElement("input" , [] , ["remove"], {"type" : "button" , "value": "🗑️"});
    //insert them into song
    const children = [coverArtElem , titleElem , albumElem , artistElem , durationElem, playElem, removeElem];
    const classes = ["song" , "box" ];
    const attrs = {id: `song${id}` }; 
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
//convert duretion from String - "mm:ss" to Number -seconds.
function durationFromMMSS(duration) {
    const splitDuration = duration.split(":");
    let durationMinutes = splitDuration[0]; 
    let durationSeconds = splitDuration[1];
    return durationMinutes*60 + durationSeconds*1;
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

  function getSongLocationByID (id) {
    for (let i = 0; i < player.songs.length ; i++){
      if (player.songs[i].id === id){
        return i;
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
  // create an array of the reserved ID's sort him and return the array
function reservedID (key){
    const arrayOfID = [];
    for (let obj of player[key]){
      arrayOfID.push(obj["id"]);
    }
    arrayOfID.sort((a,b)=>a-b);
    return arrayOfID;
  }
  //serach in "songs" or "playlists" (key) if the id is available if not create new one. 
  function findAvailableID (key , id) {
    const arrayOfID = reservedID(key);
    if (id === undefined){ // if id was omitted - create new id
      for (let i = 0 ; i < arrayOfID.length; i++){
        if (i+1 !== arrayOfID[i]){ //uses i+1 for ID bigger then 0.
          return i+1;
        }
      }
    } else { // if id was sent - cheks if available - if not return undefined
      for (let value of arrayOfID){
        if (value === id){
          return undefined;
        }
      }
      return id;
    } 
  }

  function removeSongFromPlaylist(songId , index){
    const songsArray = player.playlists[index].songs;
    for (let j = 0; j < songsArray.length; j++){
      if (songsArray[j] === songId){
        songsArray.splice(j, 1);
      }
    } 
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

document.getElementById("add-button").addEventListener("click", handleAddSongEvent);
document.getElementById("songs").addEventListener("click", handleSongClickEvent);
/* END OF CREATING DOM */