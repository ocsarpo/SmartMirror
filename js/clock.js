var monthEng = [ 'January', 'Febuary', 'March', 'April', 'May', 'June', 'July',
		'August', 'September', 'October', 'November', 'December' ];

var week = [ '일', '월', '화', '수', '목', '금', '토' ];
var weekeng = [ 'SUNDAY', 'MONDAY', 'TUESDAY', 'WENDSDAY', 'THURSDAY',
		'FRIDAY', 'SATURDAY' ];

function startTime() {
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	var date = today.getDate();

	var h = today.getHours();
	var m = today.getMinutes();

	m = checkTime(m);

	var crit;
	if (h > 12) {
		h = h - 12;
		crit = 'PM';
	} else
		crit = 'AM';

	var time = h + ":" + m +" " + crit;
	if (h < 10)
		time = '0' + h + ":" + m + " " + crit;

	$('#clock').html(time);
	$('#date').html(whatDay(false) + ". "
			+ monthEng[month] + ". " + date + " .  " + year);
	var t = setTimeout(startTime, 60000);
}
function checkTime(i) {
	if (i < 10) {
		i = "0" + i
	}
	; // 숫자가 10보다 작을 경우 앞에 0을 붙여줌
	return i;
}

function whatTimeIsIt() {
	var time = $('#clock').html();
	var s = time.split(" ");
	var hms = s[0].split(":");
	var ampm;
	if (s[1] == "AM")
		ampm = "오전";
	else
		ampm = "오후";

	return '현재 시각 ' + ampm + hms[0] + "시  " + hms[1] + "분  입니다";
}

function whatDay(voice) {
	var today = new Date();

	var ret = today.getMonth() + "월  " + today.getDate() + "일  ";
	if (voice)
		ret += week[today.getDay()] + '요일 입니다';
	else
		ret = weekeng[today.getDay()];
	return ret;
}