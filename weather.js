var badWeatherCodes = [ 395, 389, 377, 374, 371, 365, 359, 356, 350, 338, 335, 332, 320, 314, 311, 308, 305, 302, 299, 284, 281, 230, 227, 200 ];
var semiBadWeatherCodes = [ 392, 386, 368, 362, 353, 329, 326, 323, 317, 296, 293, 266, 263, 260, 185, 182, 179, 176, 143 ];
var blandWeatherCodes = [ 248, 122, 119 ];
var goodWeatherCodes = [ 113, 116 ];

var weatherCodeToText = 
{
    395: "Snow and thunder, oh my god, run.",
    392: "Light snow and thunder, oh my god, hide!",
    389: "Duck! Cause if your not a duck, you're not going to like the weather.",
    386: "Not so bad I guess, just a bit of rain and thunder",
    377: "Ruuuuuuuun, it's raining ice from the sky",
    374: "Oh shut up, light showers of ice pellets, today? GREAT!",
    371: "Run or your life, there is a bit of snow in the forecast",
    368: "Get dressed and outside kids, it's only a bit of snow.",
    365: "It's very slushly, and not the kind you can drink",
    362: "Yuck, it's slightly sleeting",
    359: "Glug, glug, glug, glug, glug, I hope you have a boat",
    356: "Tee Vee, YAAAY, you get to stay inside all day",
    353: "It's time to go have fun in the rain, it's only a light shower",
    350: "Booooo , ice pellets suck",
    338: "Yay, snow!  I love snow outside!  Lot's of heavy snow.",
    335: "Splat Splat Smash moderate heavy snow",
    332: "nooooo!  I want more snow!  It's only moderate.",
    329: "Patchy moderate snow is my favourite weather.",
    326: "Yummy, because you get to stick your tounge out and eat it if it's light snow",
    323: "Christmas is almost here, it's patchy light snow",
    320: "The weather is gross, wear some big boots",
    317: "Light sleet makes me sad",
    314: "Warning it's ice cold rain falling Moderatly or Heavily",
    311: "Don't slip on the ice cause you'll fall on your but and hurt your but",
    308: "It's too Heavy I can't walk in this rain",
    305: "It's too Heavy I can't walk in this rain at times",
    302: "I don't like umbrellas, so I'm staying inside",
    299: "I don't like umbrellas, so I'm staying inside at times",
    296: "It's sprinkling",
    293: "Patchy light sprinkling",
    284: "We're all going to die from this heavy freezing drizzle",
    281: "It's Freezing drizzle again",
    266: "Who care's about Light drizzle",
    263: "Not that much sun, only Patchy light drizzle",
    260: "I can't see at all through this Freezing Fog",
    248: "I can't see at all through this Fog",
    230: "Ahh run for your lives, it's a blizzard, yum.",
    227: "Ow it hurts, there is snow in my eyes",
    200: "BOOM here comes the BOOM.  KABOOM.",
    185: "Patchy freezing drizzle nearby ",
    182: "Patchy sleet nearby",
    179: "Patchy snow nearby",
    176: "Patchy rain nearby",
    143: "It looks like perfume in the air",
    122: "It's pitch black",
    119: "Cloudy and kind of dark",
    116: "A bit of sun",
    113: "Clear and Sunny"
};

var _FreeApiBaseURL = 'http://api.worldweatheronline.com/free/v1/';
var _FreeApiKey = '43ps2eeyq6xmpkr9qbfyraxk';

var buildWeatherURL = function(input)
{
    var url = _FreeApiBaseURL + 'weather.ashx?q=' + input.query + '&format=' + input.format + '&extra=' + input.extra + '&num_of_days=' + input.num_of_days + '&date=' + input.date + '&fx=' + input.fx + '&cc=' + input.cc + '&includelocation=' + input.includelocation + '&show_comments=' + input.show_comments + '&key=' + _FreeApiKey;
    return url;
};