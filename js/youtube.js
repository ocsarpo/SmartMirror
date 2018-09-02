var search_term;
var userCall = false;
var idArr = new Array();
var first = true;
function getYoutube() {
	var yout = httpGet("https://www.googleapis.com/youtube/v3/search?part=snippet&q="
			+ search_term + "&key=" + YOUTUBE_API_KEY + "&maxResults=30");
	var j = JSON.parse(yout);
	for (var i = 0; i < 30; i++) {
		idArr[i] = j.items[i].id.videoId;
	}
	console.dir(idArr);
}

function loadIFrame() {
	// 2. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
// 3. This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	getYoutube();
	player = new YT.Player('player', {
		height : $(window).height() - 500,
		width : $(window).width() - 20,
		loadPlaylist : {
			listType : 'playlist',
			list : idArr,
			index : parseInt(0),
			suggestedQuality : 'default'
		},
		// videoId: j.items[0].id.videoId,
		events : {
			'onReady' : onPlayerReady,
			'onStateChange' : onPlayerStateChange
		}
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	// event.target.playVideo();
	event.target.loadPlaylist(idArr);
}

// 5. The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		// setTimeout(stopVideo, 6000);
		// done = true;
	}
}
function stopVideo() {
	console.log('zzzz');
	player.stopVideo();
	hideYtElement();
}
function playVideo() {
	player.playVideo();
}
function pauseVideo() {
	player.pauseVideo();
}
function seekTo(time) {
	var t = time + player.getCurrentTime();
	player.seekTo(t, true);
}
function nextVideo() {
	player.nextVideo();
}
function previousVideo() {
	player.previousVideo();
}
function setSize(wh) {
	player.setSize(wh.width, wh.height);
}
function destroy() {
	player.destroy();
}
function setSearch_term(item) {
	search_term = item;
}
function showYtElement() {

	// $('#player').show();
	$('#youtube').slideDown("slow", function() {
		console.log('complete');
	});
	// $('#player').css("display", 'block');
}
function hideYtElement() {
	$('#youtube').slideUp("slow", function() {
		console.log('complete');
	});
	$('#greeting').slideDown("slow", function() {
		console.log('complete');
	});
}
function showVideo(tag) {
	if(first){
		loadIFrame();
		first = false;
		console.log('first load!')
	}
	if(player)
		destroy();
	showYtElement();
	setSearch_term(tag);
	onYouTubeIframeAPIReady();
}
