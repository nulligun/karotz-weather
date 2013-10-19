include("util.js");
include("weather.js");

//var karotz_ip="192.168.1.110";
var karotz_ip="localhost";

var errorRaised = false;
var resetCompleted = false;
var startedIdling = false;
var spokenError = "";
var lastWeatherCode = -1;
var currentWeatherCode = -1;
var lastCodeFilename = "last_code.txt";
var maxRunTime = 0;
var startTime = 0;
var lastPingTime = 0;
var startedSpeaking = false;

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

var start_speaking = function()
{
    startedSpeaking = true;
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

var speak_and_quit = function(event)
{
    if ((event == "CANCELLED") || (event == "TERMINATED")) 
    {
        start_speaking();
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

    debuglog("idle maxRunTime " + maxRunTime.toString() + " lastPingTime " + lastPingTime.toString() + " curTime " + curTime.toString() + " startTime " + startTime.toString());
    debuglog("curTime - starTime  = " + (curTime - startTime).toString());
    debuglog("curTime - lastPingTime = " + (curTime - lastPingTime).toString());

    if ((curTime - lastPingTime) > 300000)
    {
        debuglog("reset ping time");
        lastPingTime = (new Date).getTime();
        debuglog("about to send ping");
        // FIXME : The docs have kartoz. prefix but before this was just 'ping'
        // the 'ping' message never shows up in the debug log. 
        ping();
        debuglog("ping");
    }

    setTimeout(60000, doidle);
}

var doidle = function() {
        if (errorRaised)
        {
            debuglog("Error was raised, we idled 1 minute, now to the exit stage");
            exit(); // just exit silently after a minute if there was an error, no talking
        }
        debuglog("starting idle from inside idle");
        idle();  // no error means we wait until he user does some kind of input, button or ears
    };

var startEarpopManually = function()
{
    var data = getWeatherData();
    currentWeatherCode = getWeatherCode(data);
    displayWeather(currentWeatherCode, speak_and_quit);
    setTimeout(5000, function() {
            if (!startedSpeaking) 
            {
                start_speaking();
                debuglog("Ears did finish turning after 10s, jiggle it or something");
            } 
        });
}

var startEarpopFromScheduler = function()
{
    // get the last code we saved when the user pressed a button
    var file_data;

    debuglog("Getting lastWeatherCode");

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
        maxRunTime = 203300000;
    }
    startTime = (new Date).getTime();
    lastPingTime = (new Date).getTime();
    
    var data = getWeatherData();
    currentWeatherCode = getWeatherCode(data);

    var announceChangesOnly;
    if (karotz_ip == 'localhost') 
    { 
        announceChangesOnly = params[instanceName].changes;
    }
    else 
    {
        announceChangesOnly = "N"; // Y or N
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
    setTimeout(5000, function() {
            if (!startedIdling) 
            {
                debuglog("We started idling due to timeout waiting for displayWeather to finish");
                startedIdling = true;
                karotz.button.addListener(buttonListener);
                idle();
            } 
        });
};

var startIdling = function(event)
{
    debuglog("StartIdling: " + event);
    if ((event == "CANCELLED") || (event == "TERMINATED")) 
    {
        if (!startedIdling)
        {
            debuglog("We started idling inside startIdling");
            startedIdling = true;
            // start listening after we get the weather, just in case we try to invoke speak&quit withou the right data.
            karotz.button.addListener(buttonListener);

            idle();
        }
    }
};

var resetComplete = function(event)
{
    debuglog("reset complete:" + event);
    if ((event == "CANCELLED") || (event == "TERMINATED")) 
    {
        if (!resetCompleted)
        {
            debuglog("We are inside resetComplete doing restetComplete");
            resetCompleted = true;
            startEarpopFromScheduler();
        }
    } 
    return true;
};

var onKarotzConnect = function(data) 
{
    debuglog("Karotz launching 1.4.2");
    karotz.led.pulse("7f7f7f", 100, -1);
    //karotz.led.light("7f7f7f");

    var launch_type;
    if (karotz_ip == 'localhost')
    {
        launch_type = launchType.name;
    } else {
        launch_type = "SCHEDULER";
    }
    debuglog("launch_type " + launch_type);
    if (launch_type == "SCHEDULER")
    {
        debuglog("Scheduler invokation");
        karotz.ears.reset(resetComplete);
        setTimeout(5000, function() {
            if (!resetCompleted) 
            {
                debuglog("We are forcing reset complete due to timeout");
                resetCompleted = true;
                startEarpopFromScheduler();
            }
        });
    } else {
        debuglog("starting earpop manually");
        startEarpopManually();
    }
};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});