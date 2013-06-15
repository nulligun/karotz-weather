include("util.js");
include("weather.js");

//var karotz_ip="192.168.1.22";
var karotz_ip="localhost";

var errorRaised = false;
var spokenError = "";
var lastWeatherCode = -1;
var currentWeatherCode = -1;
var lastCodeFilename = "last_code.txt";
var maxRunTime = 0;
var startTime = 0;
var lastPingTime = 0;

var raise_error = function(error_message, color) {
    errorRaised = true;
    spokenError = error_message;
    debuglog(error_message);
    karotz.led.pulse(color,100, -1);
};

var done_speaking = function(event)
{
    if ((event == "CANCELLED") || (event == "TERMINATED")) 
    { 
        debuglog("exiting because we are done talking");
        exit(); 
    } 
    return true; 
};

var speak_and_quit = function(event)
{
    if ((event == "CANCELLED") || (event == "TERMINATED")) 
    {
        if (errorRaised)
        {
            karotz.tts.start("<voice emotion='cross'>" + spokenError + "</voice>", 'en', done_speaking);
        } 
        else 
        {
            var emote = 'cross';
            if (semiBadWeatherCodes.indexOf(currentWeatherCode) > -1)
            {
                emote = 'sad';
            } 
            else if (blandWeatherCodes.indexOf(currentWeatherCode) > -1)
            {
                emote = 'calm';
            }
            else if (goodWeatherCodes.indexOf(currentWeatherCode) > -1)
            {
                emote = 'happy';
            }

            var weatherString = weatherCodeToText["" + currentWeatherCode];
            debuglog("emote: " + emote);
            debuglog("weather string announce: " + weatherString);

            karotz.tts.start("<voice emotion='" + emote + "'>" + weatherString + "</voice>", 'en', done_speaking);
        }
    }
};

var buttonListener = function(event) {
    // say the weather and exit;
    debuglog("buttonListener");
    file.write(lastCodeFilename, currentWeatherCode.toString());
    speak_and_quit("TERMINATED");
    return true;
};

var getWeatherData = function()
{
    var location = null;
    if (karotz_ip == 'localhost') 
    { 
        location = params[instanceName].location;
    }
    else 
    {
        location = "K2L4C1";
    }

    var localWeatherInput = {
            query: location,
            format: 'JSON',
            num_of_days: '1',
            date: '',
            fx: '',
            cc: '',
            includelocation: '',
            show_comments: ''
    };

    var url = buildWeatherURL(localWeatherInput);
    debuglog("weather url: " + url);

    return http.get(url);
}

var getWeatherCode = function(data)
{
    var weatherCode = null;

    if (data == "")
    {
        raise_error("The weather service sent an empty response.", "FF0000");
    } 
    else 
    {
        var obj = null;
        try
        {
            obj = JSON.parse(data);
        } catch (exception) {
            debuglog("Error parsing data");
        }

        if ((obj == null) || (typeof(obj) == "undefined"))
        {
            raise_error("The weather service is having issues, I can't check the weather right now.","FF0000");
            debuglog("invalid json object: " + data);
        } 
        else 
        {
            try
            {
                weatherCode = parseInt(obj.data.weather[0].weatherCode);
            } catch (exception) {
                debuglog("JSON object is malformed");
            }

            if ((weatherCode == null) || (typeof(weatherCode) == "undefined"))
            {
                var error = null;
                try
                {
                    err = obj.data.error[0].msg;
                    raise_error(err, "9F00FF");
                } catch (exception) {
                    raise_error("The weather code and the error message were not found in the JAYSON response", "75FF00");
                }
            } 
            else 
            {
                debuglog("Weather code: " + weatherCode);
            }
        }
    }

    if ((weatherCode == null) || (typeof(weatherCode) == "undefined"))
    {
        return -1;
    } else {
        return weatherCode;
    }
};

var displayWeather = function(weatherCode, callback) 
{    
    if (badWeatherCodes.indexOf(weatherCode) > -1)
    {
        karotz.led.light("FF0000");
        karotz.ears.move(4, 5, callback);
    } 
    else if (semiBadWeatherCodes.indexOf(weatherCode) > -1)
    {
        karotz.led.light("FFA500");
        karotz.ears.move(9, 10, callback);
    } 
    else if (blandWeatherCodes.indexOf(weatherCode) > -1)
    {
        karotz.led.light("0000FF");
        karotz.ears.move(12, 13, callback);
    }
    else if (goodWeatherCodes.indexOf(weatherCode) > -1)
    {
        karotz.led.light("75FF00");
        karotz.ears.move(14, 15, callback);
    } else {
        if (weatherCode != -1)
        {
            raise_error("The weather code " + weatherCode + " is unknown", "00FF00");
        }
        callback("TERMINATED");
    }
}

var idle = function(event) 
{
    debuglog("idle");
    var curTime = (new Date).getTime();
    if (maxRunTime > 0)
    {
        if ((curTime - startTime) > maxRunTime)
        {
            debuglog("exiting because maxRunTime has been reached");
            exit();
        }
    }

    if ((curTime - lastPingTime) > 300000)
    {
        lastPingTime = (new Date).getTime();
        ping();
        debuglog("ping");
    }

    return true;
}

var startEarpopManually = function()
{
    var data = getWeatherData();
    currentWeatherCode = getWeatherCode(data);
    displayWeather(currentWeatherCode, speak_and_quit);
}

var startEarpopFromScheduler = function()
{
    // get the last code we saved when the user pressed a button
    var file_data;

    try
    {
        file_data = file.read(lastCodeFilename);
        lastWeatherCode = parseInt(file_data.text);
    } 
    catch (exception)
    {
        lastWeatherCode = -1;
    }

    if (karotz_ip == 'localhost') 
    { 
        maxRunTime = params[instanceName].exitminutes * 60 * 1000;
    }
    else 
    {
        maxRunTime = 60000;
    }
    startTime = (new Date).getTime();
    lastPingTime = (new Date).getTime();

    debuglog("Last weather code: " + lastWeatherCode);
    
    var data = getWeatherData();
    currentWeatherCode = getWeatherCode(data);

    var announceChangesOnly;
    if (karotz_ip == 'localhost') 
    { 
        announceChangesOnly = params[instanceName].changes;
    }
    else 
    {
        announceChangesOnly = "Y"; // Y or N
    }

    if (announceChangesOnly == "Y")
    {
        if (currentWeatherCode == lastWeatherCode) 
        {
            debuglog("Weather code did not change, exiting");
            exit();  // exit silently if the code was the same as last time, the user already ack'ed
        }
    }

    displayWeather(currentWeatherCode, startIdling);
};

var startIdling = function(event)
{
    if ((event == "CANCELLED") || (event == "TERMINATED")) 
    {
        // start listening after we get the weather, just in case we try to invoke speak&quit withou the right data.
        karotz.button.addListener(buttonListener);

        idle();

        setTimeout(60000, function() {
            if (errorRaised) 
            {
                debuglog("Error was raised, we idled 1 minute, now to the exit stage");
                exit(); // just exit silently after a minute if there was an error, no talking
            }
            idle();  // no error means we wait until he user does some kind of input, button or ears
            return true; 
        });
    }
};

var resetComplete = function(event)
{
    debuglog("reset complete:" + event);
    if ((event == "CANCELLED") || (event == "TERMINATED")) 
    {
        startEarpopFromScheduler();
    }
    return true;
};

var onKarotzConnect = function(data) 
{
    karotz.led.light("000000");

    var launch_type;
    if (karotz_ip == 'localhost')
    {
        launch_type = launchType.name;
    } else {
        launch_type = "SCHEDULER";
    }
    if (launch_type == "SCHEDULER")
    {
        karotz.ears.reset(resetComplete);
    } else {
        startEarpopManually();
    }
};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});