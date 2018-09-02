var newslist = new Array();
var newscount = 0;
var popup;
var nxtNewsTimeout;
var newsTimer;
function news() {
	var data = {};
	clearnewslist();
	clearTimeout(nxtNewsTimeout);

	$.ajax({
		type : 'POST',
		contentType : 'application/json',
		data : JSON.stringify(data),
		url : 'http://127.0.0.1:3000/news',
		success : function(data) {
			console.log('success');
			var mydata = JSON.parse(data);
			$.each(mydata.rss.channel[0].item, function(i, d) {
				var ne = new Object();
				ne.category = d["category"];
				ne.title = d["title"];
				ne.description = d["description"];
				ne.link = d["link"];
				ne.pubDate = mydata.rss.channel[0].pubDate;
				ne.category = mydata.rss.channel[0].copyright;

				newslist.push(ne);
			});
			// $('#ncategory').html(mydata.rss.channel[0].item[0].category);
			// $('#ntitle').html(mydata.rss.channel[0].item[0].title);
			// $('#ndesc').html(mydata.rss.channel[0].item[0].description);
			// $('#nlink').html(mydata.rss.channel[0].item[0].link);
			// $('#npubDate').html(mydata.rss.channel[0].pubDate);
			// $('#ncopyright').html(mydata.rss.channel[0].copyright);
		}
	});
	nxtNews();
	// 1시간 주기로 새로가져옴
	newsTimer = setTimeout(news, 3600000);
}

function clearnewslist() {
	for (var i = 0; i < newslist.length; i++)
		newslist.pop();
}
function nxtNews() {
	if (newslist.length != 0) {
		var $ntitle = $('#ntitle');
		//console.log(newslist[newscount].title);
		$ntitle.html(newslist[newscount].title);
		$ntitle.attr('src',newslist[newscount].link);
		setAnim('fadeInLeft');
		newscount++;
		if (newscount >= newslist.length)
			newscount = 0;
	}
	nxtNewsTimeout = setTimeout(nxtNews, 5000);
}
function newsstop(){
	clearTimeout(newsTimer);
	clearTimeout(nxtNewsTimeout);
}
function opensite(){
	//removechild();
	var $ntitle = $('#ntitle');
	var $win = $(window);
	var height = $win.height();
	var width = $win.width()-20;
	popup = window.open($ntitle.attr('src'), "news", "width="+width+", height="+height+", toolbar=no, menubar=no, scrollbars=no, resizable=yes" );
	var x=0;
	var y= 1000;
	popup.scrollTo(x, y);
	popup.document.body.scrollTop = y;
	popup.document.body.scrollLeft = x;
}
function closesite(){
	popup.close();
}
function removechild(){
	var cell = document.getElementById("sitelink");

	while ( cell.hasChildNodes() )
	{
	     cell.removeChild( cell.firstChild );
	}

}
function setAnim(x) {
    $('#news').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
    		,function(){
    	setTimeout(function(){
    		$('#news').removeClass().addClass('fadeOutRight' + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
    		$(this).removeClass();
    	},3500);
    });
  };
