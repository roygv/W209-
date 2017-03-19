/**
 * Created by rgvirtsman on 3/5/2017.
 */
var overview;
var data;
d3.json("overview.json", function(error, json) {
    if (error) throw error;

    overview = json;

});

function getURL(point, from, until, interval) {
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
        "  from " + point +
        " where " + where +
 //       " where time > now() - 40w " +
        " group by time(" + interval +") fill(0)";

    var url = "https://spark1:8086/query?db=w251&q="+encodeURIComponent(query);
    return(url);
}

function getData(point, from, until, callback) {
    var interval
    if((until-from)/(1000*60*5) < 3000)
        interval="5m";
    else if ((until-from)/(1000*60*60) < 3000)
        interval="1h";
    else
        interval="1d";

    url=getURL(point, from, until,interval)
    d3.json(url)
        .header("Authorization", "Basic " + btoa('roy' + ":" + 'Kaftor'))
        .get(callback);
//            function(error, json) {
//            if(error) {
//                console.log(error);
//            }else{
//                data = json;
                // data.results[0].series[0].name = 'LMP'
                // data.results[0].series[0].columns[0] = 'time'
                // data.results[0].series[0].columns[1] = 'mean'
                // data.results[0].series[0].values[0][0] = '2016-06-11T22:00:00Z'
                // data.results[0].series[0].values[0][1] = 23.834181818181815
//            }
//        });
}

//console.log(getURL("401","2000-02-01 00:00:00-08:00","2000-03-01 00:00:00-08:00"));

