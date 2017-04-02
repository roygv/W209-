var AgIData = (function () {

    var p_url, p_user, p_password;

    // A private counter variable
    myPrivateVar = 0;

    var formatDate = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ");

    // A private function which logs any arguments
    getURL = function (point, from, until, interval) {
        var where='';
        if (from == NaN)
            where = '';
        else
            where = 'time >= \''+formatDate(from)+'\' AND ';
        if (until == NaN)
            where += 'time < now()';
        else
            where += 'time <= \''+formatDate(until)+'\'';

        var query =
            "select mean(value) as value " +
            "  from \"" + point +
            "\" where " + where +
            //       " where time > now() - 40w " +
            " group by time(" + interval +")"; // fill(0)";

        var url = p_url+encodeURIComponent(query);
        return(url);
    };

    myPrivateMethod = function( foo ) {
        console.log( foo );
    };

    return {

        // A public variable
        myPublicVar: "foo",
        parseDate: d3.utcParse("%Y-%m-%dT%H:%M:%SZ"),

        init: function(url, user, password) {
            p_url=url;
            p_user=user;
            p_password=password;
        }, //init

        // A public function
        getData: function (point, from, until, callback) {
            var interval;
            if((until-from)/(1000*60*5) < 3000)
                interval="5m";
            else if ((until-from)/(1000*60*60) < 3000)
                interval="1h";
            else
                interval="1d";

            var url = getURL(point, from, until,interval);
            d3.json(url)
                .header("Authorization", "Basic " + btoa(p_user + ":" + p_password))
                .get(callback);
        } // getData
    };

})();

AgIData.init("http://169.53.133.132:8086/query?db=w251&q=","roy","Kaftor");
