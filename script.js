let key = "AIzaSyDyp77zUobQnRPdmMXvGOzuHLCGv2X7sHg";
const videoContainer = document.getElementById("videos-container");

// get results based on location for default videos

// async function fetchDefaultData() {}

// getting search results
async function fetchData(searchQuery) {
  let result = [];
  let token = "";
  let searchUrl = `https://youtube.googleapis.com/youtube/v3/search?key=${key}&q=${searchQuery}`;
  for (let i = 0; i < 5; i++) {
    if (i != 0) {
      searchUrl = `https://youtube.googleapis.com/youtube/v3/search?key=${key}&pageToken=${token}&q=${searchQuery}`;
    } else {
      searchUrl = `https://youtube.googleapis.com/youtube/v3/search?key=${key}&q=${searchQuery}`;
    }
    const response = await fetch(searchUrl + `&q=${searchQuery}`);
    const data = await response.json();

    // console.log(searchQuery);
    token = data.nextPageToken;
    // console.log(data);
    // console.log(data);
    result = [...result, ...data.items];
  }
  //   console.log(data);
  return result;
}

function getVideosData(videoData) {
  //   const container = document.getElementById("imageContainer");
  videoData.forEach(async (videoInfo) => {
    let searchUrl = `https://youtube.googleapis.com/youtube/v3/videos?key=${key}&part=snippet%2CcontentDetails%2Cstatistics&id=${videoInfo.id.videoId}`;
    // console.log(searchUrl);
    // console.log(videoId);
    const res = await fetch(searchUrl);
    const data = await res.json();
    // console.log(data);
    let itemsArray = data.items;
    // console.log(i);
    // console.log(itemsArray);
    for (let i = 0; i < itemsArray.length; i++) {
      let videoStat = itemsArray[i].statistics;
      let snippet = itemsArray[i].snippet;

      //   console.log(snippet);
      //   let img = document.createElement("img");
      //   img.src = snippet.thumbnails.maxres.url;
      //   container.appendChild(img);
      // console.log(snippet);

      let thumbnailUrl = snippet.thumbnails.maxres?.url;
      let title = snippet.title;
      let uploadTime = new Date(snippet.publishedAt);
      let currentDate = new Date();

      let uploadInterval = Math.floor((currentDate - uploadTime) / 1000);

      uploadInterval = getTimeInterval(uploadInterval);

      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${key}&part=snippet&id=${snippet.channelId}`
      );
      const channelData = await channelResponse.json();

      let channelSnippetData = channelData.items[0].snippet;

      let channelTitle = channelSnippetData.title;
      let channelDP = channelSnippetData.thumbnails.high.url;
      // console.log(channelSnippetData);
      // console.log(videoStat);
      // console.log(videoStat.viewCount);
      let viewsCountString = getViewsCountString(parseInt(videoStat.viewCount));

      // console.log(thumbnailUrl);
      if (thumbnailUrl != undefined)
        createCard(
          thumbnailUrl,
          title,
          uploadInterval,
          channelTitle,
          channelDP,
          viewsCountString,
          videoInfo.id.videoId
        );
    }
  });
}

function getViewsCountString(viewCount) {
  if (viewCount < 1000) {
    return `${viewCount.toFixed(1)} views`;
  }

  if (viewCount < 1000000) {
    viewCount = viewCount / 1000;
    return `${viewCount.toFixed(1)}K views`;
  }

  viewCount = viewCount / 1000000;

  return `${viewCount.toFixed(1)}M views`;
}

function getTimeInterval(timeInSeconds) {
  if (timeInSeconds < 60) {
    return `${timeInSeconds} seconds ago`;
  }
  let timeInMinutes = parseInt(timeInSeconds / 60);
  if (timeInMinutes < 60) {
    return `${timeInMinutes} minutes ago`;
  }
  let timeInHours = parseInt(timeInMinutes / 60);

  if (timeInHours < 24) {
    return `${timeInHours} hours ago`;
  }

  let timeInDays = parseInt(timeInHours / 24);

  if (timeInDays < 30) {
    return `${timeInDays} days ago`;
  }

  let timeInMonths = parseInt(timeInDays / 30);

  if (timeInMonths < 12) {
    return `${timeInMonths} months ago`;
  }

  let timeInYears = parseInt(timeInMonths / 12);

  return `${timeInYears} years ago`;
}

function createCard(
  thumbnailUrl,
  title,
  uploadInterval,
  channelTitle,
  channelDP,
  views,
  videoId
) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
          <img src=${thumbnailUrl} alt="" />
          <p class="time">21:45</p>
          <div>
            <img src=${channelDP} alt="" />
            <p>${title}</p>
          </div>
          <p class="title">${channelTitle}</p>
          <p>${views} views. ${uploadInterval}</p>
        </div>`;
  videoContainer.appendChild(card);

  card.addEventListener("click", (e) => {
    window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
  });
}

// after clicking on search button following line will be implemented
// fetchData("anime").then((res) => getVideosData(res));

fetchData("india").then((res) => {
  // console.log(res.length);
  getVideosData(res);
});

const input = document.getElementById("search");
const searchButton = document.getElementById("search-icon");
searchButton.addEventListener("click", (e) => {
  const homeTextButton = document.getElementById("home-text");
  homeTextButton.classList.remove("selected");
  const searchQuery = input.value;
  // console.log(searchQuery);
  // console.log(searchQuery);
  videoContainer.innerHTML = "";
  fetchData(searchQuery).then((res) => getVideosData(res));
});

// if user clicks on home he will get the defaultfetchdata

function loadDataOnPage() {
  const homeTextButton = document.getElementById("home-text");
  homeTextButton.classList.add("selected");
  videoContainer.innerHTML = "";
  input.value = "";
  fetchData("india").then((res) => {
    // console.log(res.length);
    getVideosData(res);
  });
}

const homeButton = document.getElementById("home");
const homeName = document.getElementById("home-text");
homeButton.onclick = loadDataOnPage;
homeName.onclick = loadDataOnPage;

/*


{
    "publishedAt": "2023-10-23T17:38:32Z",
    "channelId": "UCKvwTsezozI7skPGsejA_-Q",
    "title": "Live: PAK Vs AFG, ICC World Cup 2023 | Live Match Centre | Pakistan Vs Afghanistan | 2nd Innings",
    "description": "",
    "thumbnails": {
        "default": {
            "url": "https://i.ytimg.com/vi/F2fmI_-_m2g/default.jpg",
            "width": 120,
            "height": 90
        },
        "medium": {
            "url": "https://i.ytimg.com/vi/F2fmI_-_m2g/mqdefault.jpg",
            "width": 320,
            "height": 180
        },
        "high": {
            "url": "https://i.ytimg.com/vi/F2fmI_-_m2g/hqdefault.jpg",
            "width": 480,
            "height": 360
        },
        "standard": {
            "url": "https://i.ytimg.com/vi/F2fmI_-_m2g/sddefault.jpg",
            "width": 640,
            "height": 480
        },
        "maxres": {
            "url": "https://i.ytimg.com/vi/F2fmI_-_m2g/maxresdefault.jpg",
            "width": 1280,
            "height": 720
        }
    },
    "channelTitle": "Mr. Prakash",
    "tags": [
        "pakistan vs afghanistan",
        "pak vs afg",
        "pakistan vs afghanistan live",
        "live cricket",
        "live cricket match",
        "live commentary",
        "live match",
        "world cup 2023",
        "world cup schedule",
        "world cup pak vs afg 2023",
        "ptv sports live",
        "ptv sports",
        "dd sports live",
        "live cricket match today",
        "playing 11",
        "dream 11 team of today match",
        "fantasy 11",
        "cricket news",
        "world cup",
        "world cup live cricket",
        "crictalks",
        "crictalks live",
        "mr prakash",
        "mr prakash live cricket",
        "odi world cup",
        "live world cup",
        "live",
        "cric",
        "cri"
    ],
    "categoryId": "20",
    "liveBroadcastContent": "none",
    "localized": {
        "title": "Live: PAK Vs AFG, ICC World Cup 2023 | Live Match Centre | Pakistan Vs Afghanistan | 2nd Innings",
        "description": ""
    }
}


// channel snippet =>
{
    "title": "Sana Amjad",
    "description": "Official YouTube Channel of Sana Amjad . Former Program Host at Urdu Point.com , Sports Reporter at CBS 19 Cleveland Ohio USA , Jaag Tv CNBC , Abb Takk News and C42 News.\nSubscribe My YouTube Channel For my Latest Videos and Stay keep in Touch with me 😊\nsanaamjad.journalist@gmail.com\n",
    "customUrl": "@sanaamjad",
    "publishedAt": "2016-11-30T06:19:13Z",
    "thumbnails": {
        "default": {
            "url": "https://yt3.ggpht.com/BXzwP37C7QA2UIRhAVe5TGp3bCtnaG-7Y45jnnDh8keYqXHapiDTBmqW1K9k60uvhyprzsc0=s88-c-k-c0x00ffffff-no-rj",
            "width": 88,
            "height": 88
        },
        "medium": {
            "url": "https://yt3.ggpht.com/BXzwP37C7QA2UIRhAVe5TGp3bCtnaG-7Y45jnnDh8keYqXHapiDTBmqW1K9k60uvhyprzsc0=s240-c-k-c0x00ffffff-no-rj",
            "width": 240,
            "height": 240
        },
        "high": {
            "url": "https://yt3.ggpht.com/BXzwP37C7QA2UIRhAVe5TGp3bCtnaG-7Y45jnnDh8keYqXHapiDTBmqW1K9k60uvhyprzsc0=s800-c-k-c0x00ffffff-no-rj",
            "width": 800,
            "height": 800
        }
    },
    "localized": {
        "title": "Sana Amjad",
        "description": "Official YouTube Channel of Sana Amjad . Former Program Host at Urdu Point.com , Sports Reporter at CBS 19 Cleveland Ohio USA , Jaag Tv CNBC , Abb Takk News and C42 News.\nSubscribe My YouTube Channel For my Latest Videos and Stay keep in Touch with me 😊\nsanaamjad.journalist@gmail.com\n"
    },
    "country": "PK"
}

*/
