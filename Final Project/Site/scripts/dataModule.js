var AgIData = (function () {

    var p_url, p_user, p_password;

    // A private counter variable
    myPrivateVar = 0;

//    var formatDate = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ");
    var formatDate = d3.utcFormat("%Y-%m-%dT%H:%M:%SZ");

    getURL = function (point, from, until, interval, agg) {
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
        //"select "+agg+"(value) as value " +
        //"  from \"" + point +
         "select "+agg+"(usage_system) as value " +
            "  from \"cpu\" " + 
            " where " + where
        if (agg != 'last')
            query = query +
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

            var url = getURL(point, from, until, interval, "mean");
            d3.json(url)
                .header("Authorization", "Basic " + btoa(p_user + ":" + p_password))
                .get(callback);
        }, // getData

        getLast: function (point, from, until, callback) {
            var url = getURL(point, from, until, '30d', "last");
            d3.json(url)
                .header("Authorization", "Basic " + btoa(p_user + ":" + p_password))
                .get(callback);
        } // getData
    };

})();

AgIData.init("http://ec2-54-244-197-222.us-west-2.compute.amazonaws.com:8086/query?db=telegraf&q=","roy","Kaftor");
