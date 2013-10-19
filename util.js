var debuglog = function(string) {
    //http.get("http://nonlocal.ca/?log=" + escape(string));
    //log(string);
    return true;
};

karotz.connectAndStart = function(host, port, callback, data){  
    try {
        karotz.connect(host, port);
        debuglog("connected");
        karotz.start(callback, data);
    } catch(err) {
        debuglog(err);
    }
};
