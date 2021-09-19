# MP3 DOM

A web app GUI based on Mp3PlayerTask. Using Events and DOM manipulations.

https://ramabadash.github.io/MP3-DOM/

The page is divided into:

## Songs
* Each song display the following details: `title`, `album`, coverImg, `duration`.
* The list is sorted by their titles.
* You can play any song you want, one at a time. It will move to the next song when the song will end.
* You can remove a song from the song list and it will update the playlist list also.
* The color of the durations of songs reflect their length - from green to red.

## Playlists
* Each playlist display the following details: `name`, number of songs, `duration`.
* The list is sorted by their names.

## Add new song
* You can add a new song. The song will be added to the song list in the appropriate place according to the title.

## Structure

-   an HTML file (`index.html`)
-   a linked, CSS file (`style.css`)
-   a linked JS script with a sample `player` object (`player.js`)
-   a a linked JS script Assistance functions (`assistFunctiona.js`)
-   a linked JS script Main functions (`index.js`)
-   an `images` folder with the webpage icon and song cover art

The HTML defines the basic structure of the page. There are 2 container elements - one for the songs and one for the playlists. The DOM was created based on the `player` object.

