var wicons = {
	"clear-day" : "../img/clear-day.png",
	"cloudy" : "../img/cloudy.png",
	"clear-night" : "../img/clear-night.png",
	"rain" : "../img/rain.png",
	"snow" : "../img/snow.png",
	"sleet" : "../img/sleet.png",
	"wind" : "../img/wind.png",
	"fog" : "../img/fog.png",
	"partly-cloudy-day" : "../img/partly-cloudy-day.png",
	"partly-cloudy-night" : "../img/partly-cloudy-night.png",
	"thunderstorm" : "../img/thunderstorm.png",
	"hail" : "../img/hail.png"
};

function getForecast() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			$.ajax({
				url : "https://api.darksky.net/forecast/" + FORECAST_API_KEY
						+ "/" + latitude + "," + longitude,
				dataType : "jsonp",
				success : function(data) {

					/*
					 * https://darksky.net/dev/docs/response
					 * https://darksky.net/dev/docs/forecast
					 */
					console.log(data.currently["icon"]);
					console.log(wicons[data.currently["icon"]]);
					$('#weathericon').attr("src",
							wicons[data.currently["icon"]]);
					$('#tempe').html(
							toCelcius(data.currently["temperature"])
									+ "°C <br>");
					$('#humi').html("<br>" + data.currently["humidity"]);

					// add_row("시간대 : " + data.timezone);
					// add_row("현재 날씨 요약 : " + data.currently["summary"]);
					// add_row("아이콘 : " + data.currently["icon"]);
					// add_row("온도 : "
					// + toCelcius(data.currently["temperature"])
					// + "°C");
					// add_row("바람세기 : " + data.currently["windSpeed"]);
					// add_row("가시거리 : " + data.currently["visibility"]);
					// add_row("구름 : " + data.currently["cloudCover"]);
					// add_row("오존 : " + data.currently["ozone"]);
					// add_row("습도 : " + data.currently["humidity"]);
					// add_row("이슬점 : " + data.currently["dewPoint"]);
				}
			});
			/*
			 * 1초 1000 1분 60000 10분 600000
			 */
			setTimeout(getForecast, 600000);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}
function toCelcius(value) {
	var C = (value - 32) / 1.8;
	return Math.round(C);
}
