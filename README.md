karotz-weather
==============

Check the weather with your Karotz Rabbit

This application will position the rabbit ears depending on the weather forcast. On sunny days the rabbit ears will point straight up. On severe weather days the ears will be flat.

If the application is started using a Karotz Mini then Earpop will simply check the weather, speak the current conditions and exit.

If the application is started via the scheduler, Earpop will set the LED to a solid color if everything is working. It will be flashing rapidly if there was an error. Tap the top button to exit the application. When you exit the application the current weather conditions (or the current error message) will be spoken out loud.

NOTE: When running from the scheduler try not to use exact hour increments.  Offset by a few minutes instead.  So instead of starting up at 10:00am each day, make it 10:03am.  Everyone in the world uses the exact hour increment to check their weather, so the weather service is much less reliable at these times.  When you offset by a few minutes you are pretty much guaranteed it will work every time.


Configuration
=============
City or Zip/Postal Code - Your location is a required field so the application can lookup the weather for your region.

 You can specify location by any of these methods:
  • City and Town Name
  • IP Address
  • UK Postcode
  • Canada Postal Code
  • US Zipcode
  • Latitude and Longitude (in decimal)

Minutes to wait before exiting ( 0 = never)
  - Set the number of minutes you want the application to wait before exiting.  Earpop will download the weather and then position the rabbit ears and change the LED colour.  It will patiently wait for as long as you wish before exiting.  Set this to 0 to try and leave the application running until you press the button to exit. A ping will be sent back to the Kartoz servers every minute to keep the application awake.  If there was an error downloading weather data, the application will always exit after 1 minute.

Exit immediately if weather has not changed.
  - If set to YES then Earpop will simply exit if there is no change in the weather forecast. When you press the button the current weather conditions are remembered, and Earpop will not notify you again until the forecast changes.


Flashing Light Error Codes
==========================
Purple = Probably the most common problem.  This means the weather server did not find your location. Check the configuration page for this app and try a different city, or a city near to you, or try zip postal code instead.  You can also specify latitude/longitude.  

Red = There is an issue with the weather server.  It returned a response that the application could not understand.  The problem could be temporary, or it may require that the developer updates the Earpop application.

Yellow = The JSON object that was returned from the weather server did not have a weather code or an error message to parse.  This is similar to the Red error above.  The problem may be temporary or it may require an update of the Ear application.

Green = We got a weather code back from the server but it's one that I don't know about. I don't know how to react to this code so I'll just blink green to tell you.


Flat Ears, Red Light
====================
Moderate or heavy snow in area with thunder
Moderate or heavy rain in area with thunder
Moderate or heavy showers of ice pellets
Light showers of ice pellets
Moderate or heavy snow showers
Moderate or heavy sleet showers
Torrential rain shower
Moderate or heavy rain shower
Ice pellets
Heavy snow
Patchy heavy snow
Moderate snow
Moderate or heavy sleet
Moderate or Heavy freezing rain
Light freezing rain
Heavy rain
Heavy rain at times
Moderate rain
Moderate rain at times
Heavy freezing drizzle
Freezing drizzle
Blizzard
Blowing snow
Thundery outbreaks in nearby

Half Ears, Orange Light
=======================
Patchy light snow in area with thunder
Patchy light rain in area with thunder
Light snow showers
Light sleet showers
Light rain shower
Patchy moderate snow
Light snow
Patchy light snow
Light sleet
Light rain
Patchy light rain
Light drizzle
Patchy light drizzle
Freezing fog
Patchy freezing drizzle nearby
Patchy sleet nearby
Patchy snow nearby
Patchy rain nearby
Mist

3/4 Ears, Blue Light
====================
Fog
Overcast
Cloudy

Full Ears, Yellow Light
=======================
Partly Cloudy (A bit of sun)
Clear/Sunny


For more information or to contact the developer please visit http://nonlocal.ca/earpop/

Weather data provided by http://worldweatheronline.com

Steve Mulligan
steve@nonlocal.ca

Updated 2:07pm May 17th, 2013