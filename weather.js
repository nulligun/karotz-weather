var badWeatherCodes = [ 395, 389, 377, 374, 371, 365, 359, 356, 350, 338, 335, 332, 320, 314, 311, 308, 305, 302, 299, 284, 281, 230, 227, 200 ];
var semiBadWeatherCodes = [ 392, 386, 368, 362, 353, 329, 326, 323, 317, 296, 293, 266, 263, 260, 185, 182, 179, 176, 143 ];
var blandWeatherCodes = [ 248, 122, 119 ];
var goodWeatherCodes = [ 113, 116 ];

var weatherCodeToText = 
{
    395: "Moderate or heavy snow in area with thunder",
    392: "Patchy light snow in area with thunder",
    389: "Moderate or heavy rain in area with thunder",
    386: "Patchy light rain in area with thunder",
    377: "Moderate or heavy showers of ice pellets",
    374: "Light showers of ice pellets",
    371: "Moderate or heavy snow showers",
    368: "Light snow showers",
    365: "Moderate or heavy sleet showers",
    362: "Light sleet showers",
    359: "Torrential rain shower",
    356: "Moderate or heavy rain shower",
    353: "Light rain shower",
    350: "Ice pellets",
    338: "Heavy snow",
    335: "Patchy heavy snow",
    332: "Moderate snow",
    329: "Patchy moderate snow",
    326: "Light snow",
    323: "Patchy light snow",
    320: "Moderate or heavy sleet",
    317: "Light sleet",
    314: "Moderate or Heavy freezing rain",
    311: "Light freezing rain",
    308: "Heavy rain",
    305: "Heavy rain at times",
    302: "Moderate rain",
    299: "Moderate rain at times",
    296: "Light rain",
    293: "Patchy light rain",
    284: "Heavy freezing drizzle",
    281: "Freezing drizzle",
    266: "Light drizzle",
    263: "Patchy light drizzle",
    260: "Freezing fog",
    248: "Fog",
    230: "Blizzard",
    227: "Blowing snow",
    200: "Thundery outbreaks nearby",
    185: "Patchy freezing drizzle nearby ",
    182: "Patchy sleet nearby",
    179: "Patchy snow nearby",
    176: "Patchy rain nearby",
    143: "Mist",
    122: "Overcast",
    119: "Cloudy",
    116: "A bit of sun",
    113: "Clear and Sunny"
};

var _FreeApiBaseURL = 'http://api.worldweatheronline.com/free/v1/';
var _FreeApiKey = ''; # Get your api key from http://developer.worldweatheronline.com/

var buildWeatherURL = function(input)
{
    var url = _FreeApiBaseURL + 'weather.ashx?q=' + input.query + '&format=' + input.format + '&extra=' + input.extra + '&num_of_days=' + input.num_of_days + '&date=' + input.date + '&fx=' + input.fx + '&cc=' + input.cc + '&includelocation=' + input.includelocation + '&show_comments=' + input.show_comments + '&key=' + _FreeApiKey;
    return url;
};