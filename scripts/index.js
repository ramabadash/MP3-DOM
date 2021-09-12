/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    // Your code here
}

/**
 * Creates a song DOM element based on a song object.
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const children = [coverArt , title , album , artist , durationToMMSS(duration)];
    const classes = ["song" , "box"];
    const attrs = { onclick: `playSong(${id})` };
    return createElement("div", children, classes, attrs);
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const children = [name , songs.length , playlistDuration(id)];
    const classes = ["playlist" , "box"];
    const attrs = {};
    return createElement("div", children, classes, attrs);
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 */
function createElement(tagName, children = [], classes = [], attributes = {}) {
    let newElement = document.createElement(tagName);
    for (let child of children){
        let newChild;
        newChild = document.createTextNode(child + "\n");
        newElement.appendChild(newChild);
    }
    for (let clas of classes){
        newElement.classList.add(clas);
    }
    for (let attribute in attributes){
        newElement.setAttribute(attribute , attributes.attribute)
    }
    return newElement;
}

/*START OF ASSIST FUNCTIONS*/
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
  
  /*END OF ASSIST FUNCTIONS*/
