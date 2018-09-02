//http://www.auduno.com/headtrackr/documentation/reference.html
//http://ourcodeworld.com/articles/read/151/top-5-best-face-tracking-and-recognition-related-javascript-libraries
function camstart() {
	var d = document;
	var videoInput = document.getElementById('inputVideo');
	var canvasInput = document.getElementById('inputCanvas');

	var htracker = new headtrackr.Tracker();
	htracker.init(videoInput, canvasInput);
	htracker.start();

	d.addEventListener('facetrackingEvent', function(event) {
		updateFontSize(event);
	});
	var cnvs = document.getElementById("cnvs");
	// var context = cnvs.getContext("2d");
	// var cloth = new Image();
	// cloth.src = "./img/cloth.png";
}
function updateFontSize(ev) {
	// context.clearRect(cloth, 0, 0,300,300);
	console.log(ev.x + ',' + ev.y + ',' + ev.width + ',' + ev.height);
	cnvs.style.left = (parseInt(ev.x) - 470) + 'px';
	cnvs.style.top = (parseInt(ev.y) + 100) + 'px';
	// cnvs.style.width= ev.width+"px";
	// cnvs.style.height=ev.height+"px";
	// cnvs.style.width="300px";
	// cnvs.style.height="300px"
	// context.drawImage(cloth, 0, 0,300,300);
}