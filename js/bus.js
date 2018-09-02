function addBusPoint(arsId, stId, stNm, X, Y) {
	addPoint(X, Y, arsId, stNm);
	var div = document.createElement('div');

	var curStop = document.createElement('span');
	curStop.innerHTML = '[' + stNm + ' : ' + arsId +']';
	div.appendChild(curStop);
	document.getElementById('stoplist').appendChild(div);
}

function stationInfo(arsId) {
	removeStation();
	var data = {};
	data.arsId = arsId;

	$.ajax({
		type : 'POST',
		contentType : 'application/json',
		data : JSON.stringify(data),
		url : 'http://127.0.0.1:3000/bus',
		success : function(data) {
			console.log('success');
			var mydata = JSON.parse(data);
			$.each(mydata.ServiceResult.msgBody[0].itemList, function(i, d) {
				// console.log(d["rtNm"], d["nxtStn"], d["arrmsg1"],
				// d["routeType"], d["stNm"]);
				addBusInfo(d["stNm"], d["rtNm"], d["nxtStn"], d["arrmsg1"],
						d["routeType"]);
			});
		}
	});
}

function addBusInfo(stNm, rtNm, nxtStn, arrmsg, rType) {

	var div = document.createElement('div');

	var curStop = document.createElement('span');
	curStop.innerHTML = '[' + stNm + ' ';
	div.appendChild(curStop);

	var color;
	var busNum = document.createElement('span');
	if (rType == "1")
		color = "#FFFFFF";
	else if (rType == '2')
		color = "#FAED7D";
	else if (rType == '3')
		color = "#6799FF";
	else if (rType == '4')
		color = "#86E57F";
	else if (rType == '5')
		color = "#BDBDBD";
	else if (rType == '6')
		color = "#F15F5F";
	else if (rType == '7')
		color = "#A566FF";
	else if (rType == '8')
		color = "#FFC19E";
	busNum.setAttribute('style', "font-size: 15pt; margin-right: 20px; color:"
			+ color + ";  font-weight: bold");
	busNum.innerHTML = rtNm + "  ";
	div.appendChild(busNum);

	var arrms = document.createElement('span');
	if (arrmsg == "곧 도착")
		color = "#FF0000";
	else
		color = "#FFFFFF";
	console.log(arrmsg == 
		"곧 도착");
	arrms.setAttribute('style', "font-weight:bold; color:"+color+";");
	arrms.innerHTML = arrmsg + "  ";
	div.appendChild(arrms);

	var nxs = document.createElement('span');
	nxs.innerHTML = "다음 : " + nxtStn + " ]";
	div.appendChild(nxs);

	console.log(stNm + "," + rType);
	// div.innerHTML = stNm + ', ' + rtNm + ', ' + nxtStn+', '+arrmsg+',
	// '+rType;
	document.getElementById('stoplist').appendChild(div);
	console.log('hi');
}

function removeStation() {
	var cell = document.getElementById("stoplist");

	while (cell.hasChildNodes()) {
		cell.removeChild(cell.firstChild);
	}
	clearNeighbor();
}