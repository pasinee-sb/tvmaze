// "use strict";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function searchShows(term){
  
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  const shows=[];
  for (let data of res.data){
 
    let {id, name, summary, image} = data.show;

    let showObj = {id, name, summary, image: image? image.original : "https://tinyurl.com/tv-missing"};
 
shows.push(showObj);

};

return shows;
}
 

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
     const $show = $(
        `<div id=${show.id} class="Show col-md-12 col-lg-3 ">
         <div class="card">
           <img 
              class="card-img-top" src="${show.image}"
              alt="${show.name}"
              class="w-25 mr-3">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary get-episodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show); 
   
}

}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

// async function searchForShowAndDisplay() {
//   const term = $("#searchForm-term").val();
//   const shows = await searchShows(term);

//   $episodesArea.hide();
//   populateShows(shows);
// }



$("#search-form").on("submit", async function handleClick (evt) {
  evt.preventDefault();
 

let $myTerm = $("#search-query").val();
if (!$myTerm) return;

$("#episodes-area").hide();

  let myShows = await searchShows($myTerm);
  populateShows(myShows)
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  // console.log(res.data);
 
  let episodes = [];
  for (let episode of res.data){
    // console.log(episode.id);
    let {id, name, season, number} = episode;
    let episodeObj = {id, name, season, number};
    episodes.push(episodeObj);
  }
return episodes;
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  //  console.log(episodes);

  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
    // console.log(episode.name, episode.season, episode.number);
  }



   $("#episodes-area").show();
}


$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  // console.log(evt);
 
  // console.log($(evt.target).closest(".Show").attr('id'));
  let showId = ($(evt.target).closest(".Show").attr('id'));
  console.log(showId);
  let episodes = await getEpisodesOfShow(showId);
  // console.log(episodes);
  console.log(episodes);
  populateEpisodes(episodes);
});