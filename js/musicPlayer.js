var audio;
var playlist;
var tracks;
var current;
var duration; // Duration of audio clip
var pButton; // play button
var playhead; // playhead
var timeline; // timeline
// timeline width adjusted for playhead
var timelineWidth;

function mpInit() {
	$('#mp3').hide();
	getAudio();
}

function getAudio() {
	var data = {};
	removeAllAudio();
	$.ajax({
		type : 'POST',
		contentType : 'application/json',
		data : JSON.stringify(data),
		url : 'http://127.0.0.1:3000/audio',
		success : resultAudio,
		error : function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:"
					+ request.responseText + "\n" + "error:" + error);
		}
	});
}
function deleteAudio(order) {
	var data = {};
	console.log(jQuery('a[id='+"num"+order+']').attr('value'));
	data.file = jQuery('a[id='+"num"+order+']').attr('value');
	removeAllAudio();
	
	$.ajax({
		type : 'POST',
		contentType : 'application/json',
		data : JSON.stringify(data),
		url : 'http://127.0.0.1:3000/deleteAudio',
		success : resultAudio,
		error : function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:"
					+ request.responseText + "\n" + "error:" + error);
		}
	});
}
function resultAudio(result) {
	console.log('audio success');
	var mydata = JSON.parse(result);
	var f = true;
	var number = 0;
	$.each(mydata.audio, function(i, d) {
		add_audio(d["path"], d["name"], 'data:image/jpeg;base64,' + d.data,
				d["lyrics"], f, ++number);
		// console.log(d["path"], d["name"], d["lyrics"]);
		if (f)
			firstAudioPlay(d["path"]);
		f = false;
	});	
	init();
}

function init() {
	current = 0;
	audio = $('audio');
	playlist = $('#playlist');
	tracks = playlist.find('span a');
	len = tracks.length - 0;
	audio[0].volume = 1.0;
	playlist.find('a').click(function(e) {
		e.preventDefault();
		link = $(this);
		current = link.parent().index();
		run(link, audio[0]);
	});
	audio[0].addEventListener('ended', function(e) {
		current++;
		if (current == len) {
			current = 0;
			link = playlist.find('a')[0];
		} else {
			link = playlist.find('a')[current];
		}
		run($(link), audio[0]);
	});

	pButton = $('#pButton'); // play button
	playhead = $('#playhead'); // playhead
	timeline = $('#timeline'); // timeline
	// timeline width adjusted for playhead
	timelineWidth = timeline.width() - playhead.width();
	console.log(timelineWidth);
	// timeupdate event listener
	audio[0].addEventListener("timeupdate", timeUpdate, false);

	// Makes timeline clickable
	timeline.click(function(event) {
		moveplayhead(event);
		audio[0].currentTime = duration * clickPercent(event);
	});
	// timeUpdate
	// Synchronizes playhead position with current point in audio
	function timeUpdate() {
		var playPercent = timelineWidth * (audio[0].currentTime / duration);

		playhead.css('marginLeft', playPercent + "px");
		if (audio[0].currentTime == duration) {
			btnToPlay();
		}
	}
	// returns click as decimal (.77) of the total timelineWidth
	function clickPercent(e) {
		return (e.pageX - timeline.offset().left) / timelineWidth;
	}

	// Makes playhead draggable
	playhead.mousedown('mousedown', function mouseDown() {
		// mouseDown EventListener
		onplayhead = true;
		window.addEventListener('mousemove', moveplayhead, true);
		audio[0].removeEventListener('timeupdate', timeUpdate, false);
	}, false);
	$(window).mouseup('mouseup', function mouseUp(e) {
		// mouseUp EventListener
		// getting input from all mouse clicks
		if (onplayhead == true) {
			moveplayhead(e);
			window.removeEventListener('mousemove', moveplayhead, true);
			// change current time
			console.log(clickPercent(e));
			audio[0].currentTime = duration * clickPercent(e);
			audio[0].addEventListener('timeupdate', timeUpdate, false);
		}
		onplayhead = false;
	}, false);

	// Boolean value so that mouse is moved on mouseUp only when the
	// playhead is released
	var onplayhead = false;

	// mousemove EventListener
	// Moves playhead as user drags
	function moveplayhead(e) {
		var newMargLeft = e.pageX - timeline.offset().left;
		if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
			playhead.css('marginLeft', newMargLeft + "px");
		}
		if (newMargLeft < 0) {
			playhead.css('marginLeft', "0px");
		}
		if (newMargLeft > timelineWidth) {
			playhead.css('marginLeft', timelineWidth + "px");
		}
	}

	// Gets audio file duration
	audio[0].addEventListener("canplaythrough", function() {
		duration = audio[0].duration;
	}, false);
}

// Play and Pause
function play() {
	// start music
	if (audio[0].paused) {
		mpRestart();
		// remove play, add pause
		btnToPause();
	} else { // pause music
		mpPause();
		// remove pause, add play
		btnToPlay();
	}
}
function btnToPlay() {
	$('#pButton').removeClass("pause");
	$('#pButton').addClass("play");
}
function btnToPause() {
	$('#pButton').removeClass("play");
	$('#pButton').addClass("pause");
}

function run(link, player) {
	player.src = link.attr('href');
	par = link.parent();
	par.addClass('active').siblings().removeClass('active');
	audio[0].load();
	audio[0].play();
	$('#art').attr("src", link.children().attr('src'));
	$('#lyric').text(link.children('#lyric').attr('src'));
	convertLyric();
}

function mpNext() {
	current++;
	if (current == len) {
		current = 0;
		link = playlist.find('a')[0];
	} else {
		link = playlist.find('a')[current];
	}

	run($(link), audio[0]);
}

function mpPrev() {
	current--;
	if (current < 0) {
		current = len - 1;
		link = playlist.find('a')[len - 1];
	} else {
		link = playlist.find('a')[current];
	}

	run($(link), audio[0]);
}
function getTotalCount(){
	return len;
}
function mpIndexPlay(tag){
	current = (tag*1)-1;
	link = playlist.find('a')[current];
	run($(link), audio[0]);
}

function mpStop() {
	audio[0].pause();
	audio[0].currentTime = 0;
	btnToPlay();
}
function mpPause() {
	audio[0].pause();
	btnToPlay();
}
function mpRestart() {
	audio[0].play();
	btnToPause();
}
function mpStart() {
	link = playlist.find('a')[current];
	run($(link), audio[0]);
	btnToPause();
}

function add_audio(path, name, imgData, lyrics, first, number) {
	var span = document.createElement('span');
	if (first) {
		span.setAttribute('class', 'active');
		first = false;
	}
	var a = document.createElement('a');
	a.setAttribute('href', path);
	a.setAttribute('id', 'num'+number);
	a.setAttribute('value', name);
	a.innerHTML = name;
	
	var img = document.createElement('img');
	img.setAttribute('style','float:left')
	// img.setAttribute('class', 'thumbnail');
	img.setAttribute('src', imgData);
	img.setAttribute('width', '40px');
	img.setAttribute('height', '25px');
	a.appendChild(img);
	
	var num = document.createElement('div');
	num.setAttribute('style','float:right');
	num.innerHTML = number+'번';
	a.appendChild(num);
	

	var div = document.createElement('div');
	div.setAttribute('style', 'display:none;');
	div.setAttribute('src', lyrics);
	div.setAttribute('id', 'lyric');
	a.appendChild(div);

	span.appendChild(a);

	$('#playlist').append(span);
	console.log('hi');
}

function removeAllAudio() {
	var cell = document.getElementById("playlist");
	while (cell.hasChildNodes()) {
		cell.removeChild(cell.firstChild);
	}
	clearNeighbor();
}
function firstAudioPlay(path) {

	var source = document.createElement('source');
	source.setAttribute('type', 'audio/mp3');
	source.setAttribute('src', path);

	document.getElementById('audio').appendChild(source);
}

function resultShow() {
	$('#vresult').slideDown("slow");
	$('#mp3').fadeOut("slow");
	mpStop();
}
function mp3Show() {
	$('#mp3').slideDown("slow");
	$('#vresult').fadeOut("slow");
	mpStart();
}
function showLyrics() {
	if ($("#lpack").css("display") == "none") {
		$('#lpack').slideDown("slow", function() {
			console.log('complete');
			console.log($('#lyric').html());
		});
	} else {
		$('#lpack').slideUp("slow", function() {
			console.log('complete');
		});
	}
}
function convertLyric() {
	var ly = $('#lyric').html();
	ly = ly.replace(/\r\n/gi, '<br/>');
	$('#lyric').html(ly);
}
