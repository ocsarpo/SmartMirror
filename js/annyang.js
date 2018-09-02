var i = 0;
var badtalk = false;
var m;
var popup;
if (annyang) {
	// Let's define our first command. First the text we expect, and then the
	// function it should call
	var commands = {	
		'*term 정류장' : function(tag) {
			if ($("#youtube").css("display") == "none") {
			} else {
				$('#lpack').slideUp("slow", function() {
					stopVideo();
					console.log('complete');
				});
			}
			$('#greeting').slideUp('slow');
			$('#question').slideUp('slow');
			$('#gMap').slideDown('slow', function() {
				initMap();
			});
			removeStation();
			tag = tag.replace(/\s/gi, '');
			var data = {};
			data.stNm = tag;

			$.ajax({
				type : 'POST',
				contentType : 'application/json',
				data : JSON.stringify(data),
				url : 'http://127.0.0.1:3000/station',
				success : function(data) {
					console.log('success');
					var mydata = JSON.parse(data);
					$.each(mydata.ServiceResult.msgBody[0].itemList, function(
							i, d) {
						addBusPoint(d["arsId"], d["stId"], d["stNm"], d["tmX"],
								d["tmY"]);
					});
					dropMarker();
				}
			});
			speak(tag +" 인근 정류장을 표시합니다.");
		},
		"속보 링크" : function(){ 
			opensite();
		},
		"링크 종료":function(){
			closesite();
		},
		"속보" : function(){
			news();
		},
		"속보 그만" : function(){
			newsstop();
		}
		,
		"*term 도착( 정보)(정보)" : function(tag) {
			tag = tag.replace(/\s/gi, '');
			console.log(tag);
			stationInfo(tag);
			speak(tag +" 정류장 버스 도착 정보를 표시합니다.");
		},
		"지도 사이즈 *term" : function(tag) {
			zoomNum(tag);
			speak("지도의 사이즈를"+tag+"로 변환합니다.");
		},
		"지도 *term" : function(tag) {
			if (tag == "확대")
				zoomIn();
			else if (tag == "축소")
				zoomOut();
			else if (tag == "위로")
				moveCenter('u');
			else if (tag == "아래로")
				moveCenter('d');
			else if (tag == "오른쪽으로")
				moveCenter('r');
			else if (tag == "왼쪽으로")
				moveCenter('l');
			else if (tag == "줌 크기") {
				speak("현재 지도의 줌 크기는" + getZoom() + " 입니다.");
			}
		},
		'*term 동영상 재생' : function(tag) {
			$('#greeting').slideUp("slow");
			$('#question').slideUp('slow');
			$('#gMap').slideUp('slow');
			showVideo(tag);
			speak(tag +" 동영상을 재생합니다.");
			// showVideo(tag);
		},
		'동영상 *term' : function(tag) {
			if (tag == "그만" || tag == "정지") {
				stopVideo();
			} else if (tag == "재생" || tag == "시작" || tag == "플레이")
				playVideo();
			else if (tag == "일시정지" || tag == "멈춰")
				pauseVideo();
		},
		'*term초 뒤로' : function(tag) {
			seekTo(tag * -1);
		},
		'*term초 앞으로' : function(tag) {
			seekTo(tag * 1);
		},
		'다음 *term' : function(tag) {
			if (tag == "동영상")
				nextVideo();
			else if (tag == "곡")
				mpNext();
			else if (tag =="상의" || tag =="상해" || tag =="상위")
				popup.nextcloth();
			else if (tag =="하의" || tag =="하이" || tag =="하위")
				popup.nextpants();
		},
		'이전 *term' : function(tag) {
			if (tag == "동영상")
				previousVideo();
			else if (tag == "곡")
				mpPrev();
			else if (tag =="상의" || tag =="상해" || tag =="상위")
				popup.prevcloth();
			else if (tag =="하의" || tag =="하이" || tag =="하위")
				popup.prevpants();
		},
		'동영상 *term' : function(tag) {
			if (tag == "그만" || tag == "정지")
				stopVideo();
			else if (tag == "재생" || tag == "시작" || tag == "플레이")
				playVideo();
			else if (tag == "일시정지" || tag == "멈춰")
				pauseVideo();
		},
		/* 페이지 전환 */
		'옷(장)(짱)' : function() {
			var $win = $(window);
			var height = $win.height();
			var width = $win.width()-20;
			popup = window.open("../public/cloth.html", "news", "width="+width+", height="+height+", toolbar=no, menubar=no, scrollbars=no, resizable=yes" );
			
		},
		'옷 그만' : function(){
			popup.close();
		},
		/* 페이지 전환 */
		'안경' : function() {
			var $win = $(window);
			var height = $win.height();
			var width = $win.width()-20;
			popup = window.open("../public/glasses.html", "news", "width="+width+", height="+height+", toolbar=no, menubar=no, scrollbars=no, resizable=yes" );
			
		},
		'안경 그만' : function(){
			popup.close();
		},
		
		'음악 *term' : function(tag) {
			if (tag == "재생" || tag == "틀어"){
				mp3Show();
				speak("저장된 음악을 재생합니다.");
			}
			else if (tag == "꺼" || tag == "정지")
				resultShow();
			else if (tag == "일시정지")
				mpPause();
			else if (tag == "다시 재생")
				mpRestart();			
			else if (tag == "새로고침") {
				mpStop();
				getAudio();
			}
		},
		'*term(번)( 번) 음악 *tag' : function(term, tag) {
			var len = getTotalCount();
			var re = /^[0-9]+$/;
			if (!re.test(term*1) || ((term * 1) > len)) {
				speak("정확한 인덱스를 말씀해주세요");
			} else {
				if (tag == "재생") {
					term = term.replace(/\s/gi, '');
					mpIndexPlay(term);
				}
				else if(tag == "삭제"){
					 mpStop();
					 term = term.replace(/\s/gi, '');
					 deleteAudio(term);
				}
			}
		},
		'가사' : function(tag) {
			showLyrics();
		},
		'홈으로' : function() {
			if ($("#youtube").css("display") == "none") {
			} else {
				$('#lpack').slideUp("slow", function() {
					stopVideo();
					console.log('complete');
				});
			}
			$('#greeting').slideDown('slow');
			$('#question').slideUp('slow');
			$('#gMap').slideUp('slow');
			$('#sitelink').slideUp('slow');
			resultShow();
		},
		/* 상호작용 */
		'안녕' : function() {
			speak(greetResponse());
		},
		'몇 살이(야)(니)' : function() {
			speak(oldResponse());
		},
		'지금 몇 시(야)' : function() {
			speak(whatTimeIsIt());
		},
		'사용 가능한 질문' : function() {
			if ($("#youtube").css("display") == "none") {
			} else {
				$('#lpack').slideUp("slow", function() {
					stopVideo();
					console.log('complete');
				});
			}
			$('#greeting').slideUp('slow');
			$('#gMap').slideUp('slow');
			$('#question').slideDown('slow');
			speak("사용 가능한 질문 목록입니다.")
		},
		'*term 날짜 (말해 줘)' : function(tag) {
			if (tag == "오늘" || tag == "") {
				speak(whatDay(true));
			}
		},
		'사라져' : function() {
			speak(byeResponse());
			$('#mirror').slideUp('slow');
			mpStop();
		},
		'돌아와' : function() {
			speak(returnResponse());
			$('#mirror').slideDown('slow');
		},
		'*allSpeech' : function(tag) {
			if (findBadword(tag)) {
				m = "욕 하지마세요! " + tag + "!";
				$("#greeting").html(".\\/. 욕하디망 <br/>" + tag);
				badtalk = true;
			} else if (tag == "메롱")
				m = "놀리지마세요! " + tag + "!";
			else
				m = errorResponse();
			speak(m);
		},
	};

	annyang.addCallback('resultMatch',
			function(userSaid, commandText, phrases) {
				console.log(userSaid); // sample output: 'hello'
				console.log(commandText); // sample output: 'hello
				// (there)'
				console.log(phrases); // sample output: ['hello',
				// 'halo',
				// 'yellow', 'polo', 'hello kitty']
				$('#result').html(userSaid);
				if (!findBadword(userSaid) && badtalk) {
					getGreeting();
					badtalk = false;
				}
			});
	// annyang.debug();
	annyang.setLanguage("ko");
	// Add our commands to annyang
	annyang.addCommands(commands);

	// Start listening. You can call this here, or attach this call to an event,
	// button, etc.
	annyang.start();
}

function speak(content, element){
	responsiveVoice.speak(content, "Korean Female");
	$('#result2').html(content);
}