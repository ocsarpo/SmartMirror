var response = [ '안녕하세요', '반가워요', '하이욤!', '넹, 저도 반가워요'];
var greeting = [ "안녕하세요!", "반가워요!", "환영합니다", "오늘 기분 어때요?", "Hi, Honey!" ];
var error = [ "무슨 말인지 잘 모르겠어요", "해당 기능이 존재하지 않습니다.", "다시 말씀해주세요."];
var badwords = [ "씨*", "시발", "시팔", "씨팔", "개새끼야", "미친놈아", "뻐큐", "병신아",
		"f*** you", "지랄" ];
var old = ['안알랴쥼', '몇 살 같아 보이는데요?', '맞춰보세요!', '나이를 묻지 마세요!', '알면 다쳐요'];
var bye = ['편안한 시간 되세요!', '이만 물러갑니다.', '빠이욤', '안녕히계세요', '안녕.'];
var mreturn = ['돌아왔어요!', '다시 왔어요!', '하이', '하이욤', '제가 보고 싶었나요?', '나 보고 싶었쪙?', '짜쟌'];

function getGreeting() {
	$('#greeting').html(greeting[Math.floor(Math.random() * 10) % 5]);
	var t = setTimeout(getGreeting, 600000);
}

function greetResponse() {
	return response[Math.floor(Math.random() * 10) % 4];
}

function errorResponse() {
	return error[Math.floor(Math.random() * 10) % 3];
}

function findBadword(tag){
	return badwords.indexOf(tag) != -1 ? true : false;
}

function oldResponse() {
	return old[Math.floor(Math.random() * 10) % 5];
}
function byeResponse(){
	return bye[Math.floor(Math.random() * 10) % 5];
}
function returnResponse(){
	return mreturn[Math.floor(Math.random() * 10) % 7];
}