"use strict"

//play the next songs after the song we clicked on
function nextSong(playingSong){
    playingSong.classList.remove("playing"); //remove the last song playing
    if (playingSong.nextSibling !== null){
        playingSong.nextSibling.classList.add("playing");
        playingSong = document.getElementsByClassName("playing")[0]; //playingSong = next song on the list
        let songId = Number(playingSong.id[playingSong.id.length - 1]); //create ID number by removing the word song from the id
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
//The function receives a song id and returns its place in the player.songs array
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
        for (let i = 0 ; i <= arrayOfID.length; i++){
            if (i+1 !== arrayOfID[i]){ //uses i+1 for ID bigger then 0.
            return i+1;
            }
        }
    } else { // if id was sent - cheks if available - if not return undefined
        for (let value of arrayOfID){
            if (value === id){
                return undefined;}
      }
      return id;
    } 
}
//The function gets song playlist song id and index and deletes it from the playlist
function removeSongFromPlaylist(songId , index){
    const songsArray = player.playlists[index].songs;
    for (let j = 0; j < songsArray.length; j++){
        if (songsArray[j] === songId){
            songsArray.splice(j, 1);
        }
    } 
}
//Duration color scale -Less than 2 min = green - Above 7 min = completely red.
function durationColorScale (duration) {
    const maxDuration = 7 * 60; //7 min
    const minDuration = 2 * 60; //2 min
    const scale = 255 / (maxDuration - minDuration) ; // 255 = highest value on rgb(,,)
    if (duration > maxDuration) duration = maxDuration;
    if (duration < minDuration) duration = minDuration;
    let colorUnit = Math.floor((duration - minDuration) * scale);
    return `rgb(${colorUnit},${255-colorUnit},0)`;
}
//The function produces elements for each song in player songs and add them as children of the div songs
function addingSongsToDom (){
    let songs = document.getElementById("songs");
    player.songs.sort((song1 , song2) => { return song1.title > song2.title ? 1 : -1});
    for (let song of player.songs){
        let newSong = createSongElement(song);
        songs.appendChild(newSong);
    }
}
// The function produces elements for each playlist in player playlists and add them as children of the div playlists
function addingPlaylistToDom (){
    let playlists = document.getElementById("playlists");
    player.playlists.sort((playlist1 , playlist2) => { return playlist1.name > playlist2.name ? 1 : -1});
    for (let playlist of player.playlists){
        let newPlaylist = createPlaylistElement(playlist);
        playlists.appendChild(newPlaylist);
    }
}
