var express = require('express'), http = require('http'), path = require('path');
var expressErrorHandler = require('express-error-handler');

var bodyParser = require('body-parser');
var exec = require('child_process').exec;
// https://www.npmjs.com/package/jsmediatags
// Simple API - will fetch all tags
var jsmediatags = require("jsmediatags");
var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
// http://uiandwe.tistory.com/1002
var urlencode = require('urlencode');
var multer = require('multer');
var BUS_API_KEY = 'ozRw7ELpPqxuLKcdYq4Zv8ea4Ci%2B516ATn3IdPcBH3YS83ebxoH8BWg3LQ2gdj4UqQ6GEymCEk84mcD9%2BqY0CQ%3D%3D';
// exec('start chrome 127.0.0.1:3000 -kiosk', function(error, stdout, stderr){
// console.log(stdout);
// });
exec('start chrome 127.0.0.1:3000', function(error, stdout, stderr) {
	console.log(stdout);
});

var _storage = multer.diskStorage({
	// 객체(함수) 사용자가 전송한 파일을 해당 디렉에 저장한다 cb=callback
	destination : function(req, file, cb) {
		// if(파일형식이 이미지면
		// cb(null, 'uploads/images');
		// else if(text면)
		// cb(null, '어디');
		cb(null, 'public/audio')
	},
	// 객체(함수)디렉에 저장할 파일이름을 정한다
	filename : function(req, file, cb) {
		// if( already file exist)
		// cb(null, file.originalname에 동일이름파일중가장큰수끝에추가);
		// else
		// cb(null,file.originalname);
		cb(null, file.originalname);
	}
});
// 업로드한 파일이 dest에 저장된다
var upload = multer({
	storage : _storage
});

var fs = require('fs');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
// db connection
var database;
var UserSchema;
var UserModel;

// db 연결, 응답객체속성으로 db객체 추가
function connectDB() {
	// 연결정보
	var databaseUrl = 'mongodb://localhost:27017/mirror';
	// //디비연결

	mongoose.connect(databaseUrl);
	database = mongoose.connection;

	database.on('error', console.error.bind(console,
			'mongoose connection error'));
	database.on('open', function() {
		console.log('데이터베이스에 연결됨 : ', databaseUrl);

		// 스키마정의
		UserSchema = mongoose.Schema({
			id : String,
			name : String,
			password : String
		});
		console.log('UserSchema 정의');
		// User모델 정의
		UserModel = mongoose.model("users", UserSchema);
		console.log("user 정의");
	});
	database.on('disconnected', connectDB);
}

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	fs.readFile('index.html', function(error, data) {
		res.writeHead(200, {
			'Content-Type' : 'text/html'
		});
		res.end(data);
	});
});

app
		.post(
				'/station',
				function(req, res) {
					var data = JSON.stringify(req.body);
					var element = JSON.parse(data);
					var searchName = urlencode(element.stNm);

					var url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?serviceKey='
							+ BUS_API_KEY
							+ '&stSrch='
							+ searchName
							+ '&numOfRows=999&pageSize=999&pageNo=1&startPage=1';

					request({
						url : url,
						method : 'GET'
					}, function(error, response, body) {
						parser.parseString(body, function(err, result) {
							// console.dir(JSON.stringify(result));

							res.writeHead(200, {
								'Content-Type' : 'text/html'
							});
							res.write(JSON.stringify(result));
							res.end();
						});
					});
				});

app
		.post(
				'/bus',
				function(req, res) {
					console.log('enter bus');
					var data = JSON.stringify(req.body);
					var element = JSON.parse(data);
					var searchName = urlencode(element.arsId);

					var url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?serviceKey='
							+ BUS_API_KEY
							+ '&arsId='
							+ searchName
							+ '&numOfRows=999&pageSize=999&pageNo=1&startPage=1';

					console.log(searchName);

					request({
						url : url,
						method : 'GET',

					}, function(error, response, body) {
						parser.parseString(body, function(err, result) {
							// console.dir(JSON.stringify(result));
							res.writeHead(200, {
								'Content-Type' : 'text/html'
							});
							res.write(JSON.stringify(result));
							res.end();
						});
					});
				});

app.post('/news', function(req, res) {
	console.log('enter news');
	var url = 'http://fs.jtbc.joins.com//RSS/newsflash.xml';

	request({
		url : url,
		method : 'GET',

	}, function(error, response, body) {
		parser.parseString(body, function(err, result) {
			// console.dir(JSON.stringify(result));
			res.writeHead(200, {
				'Content-Type' : 'text/html'
			});
			res.write(JSON.stringify(result));
			res.end();
		});
	});
});

app.post('/audio', function(req, res) {
	console.log('enter audio');
	sendAudioData(res);
});

app.post('/deleteAudio', function(req, res) {

	var data = JSON.stringify(req.body);
	var element = JSON.parse(data);
	var file = element.file;
	console.log(file);
	var localpath = process.cwd();
	var audiopath = localpath + '\\public\\audio\\' + '\"' + file + '\"';
	console.log(audiopath);
	exec('del /q ' + audiopath, function(error, stdout, stderr) {
		if (error) {
			console.log('못지웠음')
		}
		console.log(stdout);
		sendAudioData(res);
		console.log("지웠음");
	});
});

var defaultfile = './img/music-player.png';
var dfData;
fs.readFile(defaultfile, function(err, data) {
	dfData = data;
});

function getFileTags(list, res) {
	var audioInfo = new Array();
	list.forEach(function(file) {
		jsmediatags.read("./public/audio/" + file, {
			onSuccess : function(tag) {
				var audioFile = new Object();
				try {
					var buffer = Buffer.from(tag.tags.picture.data);
					audioFile.data = buffer.toString('base64');
					audioFile.lyrics = tag.tags.lyrics.lyrics;
				} catch (err) {
					audioFile.data = dfData.toString('base64');
					audioFile.lyrics = "No lyric!";
				} finally {
					audioFile.path = './public/audio/' + file;
					audioFile.name = file;
					console.log(file);
					audioInfo.push(audioFile);
				}
			},
			onError : function(error) {
				console.log(':(', error.type, error.info);
			}
		});
	});
	setTimeout(function() {
		sendAudioinfo(res, audioInfo);
	}, 2000);
}
function sendAudioinfo(res, audioInfo) {
	var jsonf = new Object();
	jsonf.audio = audioInfo;
	var audiojson = JSON.stringify(jsonf);
	res.writeHead(200, {
		'Content-Type' : 'text/html'
	});
	res.write(audiojson);
	res.end();
}
function sendAudioData(res) {
	var path = './public/audio/';
	var fileList = new Array();
	// http://mudchobo.tistory.com/542
	fs.readdir(path, function(err, files) {
		if (err)
			throw err;
		files.forEach(function(file) {
			fileList.push(file);
		});
		console.log('sendAudioData');
		getFileTags(fileList, res);
	});
}

app.post('/process/audio', upload.single('audio'), function(req, res) {
	var files = req.file;

	// 현재 파일정보 저장변수
	var originalname = '', name = '', mimetype = '', size = 0;

	console.log("파일 개수 : 1");
	originalname = files.originalname;
	name = files.filename;
	mimetype = files.mimetype;
	size = files.size;

	console.log('현재 파일 정보 : ' + originalname + ', ' + name + ', ' + mimetype
			+ ', ' + size);

	// 클라 응답 전송
	res.writeHead('200', {
		'Content-Type' : 'text/html;charset=utf8'
	});
	res.write('<h1>파일 업로드 성공</h1>');
	res.write('<hr/>');
	res.write('<p>원본 파일 이름 : ' + originalname + ' -> 저장 파일 이름 : ' + name
			+ '</p>');
	res.write('<p>MIME TYPE : ' + mimetype + '</p>');
	res.write('<p>파일 크기 : ' + size + '</p>');
	res.end();
});

app.post('/process/login', function(req, res) {
	var id = req.body["id"];
	var pwd = req.body["password"]
	console.log("%s, %s", id, pwd);
	if (database) {
		authUser(database, id, pwd, function(err, docs) {
			if (err) {
				throw err;
			}

			if (docs) {
				console.dir(docs);
				res.writeHead('200', {
					'Content-Type' : 'text/html;charset=utf8'
				});
				res.write('<h1>로그인 성공</h1>')
				res.write('<p>아이디 : ' + req.body["id"] + ' , pwd : '
						+ req.body["password"] + '</p>');
				res.write('<br><br><a href="/public/login.html">다시로그인하기</a>');
				res.end();
			} else {
				res.writeHead('200', {
					'Content-Type' : 'text/html;charset=utf8'
				});
				res.write('<h1>로그인 실패</h1>')
				res.write('<p>아이디 :비번 재확인 필요 </p>');
				res.write('<br><br><a href="/public/login.html">다시로그인하기</a>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {
			'Content-Type' : 'text/html;charset=utf8'
		});
		res.write('<h1>디비연결 실패</h1>')
		res.write('<div><p>디비연결실패</p></div>');
		res.end();
	}

	// 클라 응답 전송

});

app.post('/process/adduser', function(req, res) {
	console.log('/process/adduser');
	var id = req.body["id"];
	var pwd = req.body["password"];
	var name = req.body["name"];

	if (database) {
		addUser(database, id, pwd, name, function(err, result) {
			if (err) {
				throw err;
			}

			if (result) {
				console.dir(result);
				res.writeHead('200', {
					'Content-Type' : 'text/html;charset=utf8'
				});
				res.write('<h1>사용자 추가 성공</h1>')
				res.end();
			} else {
				res.writeHead('200', {
					'Content-Type' : 'text/html;charset=utf8'
				});
				res.write('<h1>사용자 추가 실패</h1>')
				res.end();
			}
		});
	} else {
		res.writeHead('200', {
			'Content-Type' : 'text/html;charset=utf8'
		});
		res.write('<h1>디비연결 실패</h1>')
		res.write('<div><p>디비연결실패</p></div>');
		res.end();
	}

	// 클라 응답 전송

});

var errorHandler = expressErrorHandler({
	static : {
		'404' : './public/404.html'
	}
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


// 사용자 인증함수
var authUser = function(database, id, password, callback) {
	console.log('authUser 호출');

	//아이디 비번 으로 검색
	UserModel.find({"id":id,"password":password}, function(err, results){
		if(err){
			callback(err,null);
			return;
		}
		console.log('아이디 %s, 비번 %s 로 검색 결과', id,password);
		console.dir(results);
		
		if(results.length > 0){
			console.log("아이디 %s, 패스 %s 일치 유저 ", id, password);
			callback(null, results);
		}else{
			console.log('못찾음');
			callback(null,null);
		}
	})

}
// 사용자 등록
var addUser = function(database, id, password, name, callback) {
	console.log('addUser call');

	// UserModel 인스턴스 생성
	var users = new UserModel({"id":id, "password":password, "name":name});
	
	// save로 저장
	users.save(function(err){
		if(err){
			callback(err,null);
			return;
		}
		console.log('사용자 데이터 추가');
		callback(null,users);
	});
}

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));

	// db연결
	connectDB();
});
