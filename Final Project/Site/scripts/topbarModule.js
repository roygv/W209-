///////  Get time to display in the top bar ///////

function startTime() {
    var today = new Date();
    var d = today.getDate();
    var y = today.getYear()+1900;
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var mo = month[today.getMonth()];
    var weekday = new Array(7);
    weekday[0] =  "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tues";
    weekday[3] = "Wed";
    weekday[4] = "Thurs";
    weekday[5] = "Fri";
    weekday[6] = "Sat";
    var day = weekday[today.getDay()];
    
    m = checkTime(m);
    s = checkTime(s);
    
    var liveon = document.getElementById("liveswitch").checked;
    var disp = day+" "+mo+" "+d+" "+y+"  "+ h + ":" + m + ":" + s;
    
    document.getElementById("datetop").innerHTML = disp;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

///////  Refresh ///////

function updateSwitch(){
    var liveon = document.getElementById("liveswitch").checked;
    if (!liveon) {
        top_graph();
        var image = "images/cloud-no-bolt.png";
        var t = "Historical mode";
        $('#notificationCenter').html("");
        $('#histCenter').html("<div style='margin-left:15px; font-size:14px'>Period: <span id='start_date'></span> - <span id='end_date'></span></div><div class='notibox'><b>Summary statistics (TBD)</b></br></br>Statistics on notifications in the selected period</br></br>Data on the main panel should also vary with dates</br></br></br></br></br></br></br></br></br></br></br></br></br></div>");
    }
    if (liveon){
        d3.selectAll(".topgraph").remove();
        var image = "images/cloud-bolt.png";
        var t = "Live mode";
        notififCenter();
        $('#histCenter').html("");
    }
    document.getElementById("logo").src = image;
    document.getElementById("logo").title = t;
}

/////// bar graph ///////


var context = d3.select("#context"),
margin = {top: 10, bottom: 15, right: 10, left: 10},
width = +context.attr("width") - margin.left - margin.right,
height = +context.attr("height") - margin.top - margin.bottom;

context.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("class", "context")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseDate = d3.timeParse("%b %Y");

var x = d3.scaleTime().range([0, width]),
y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x).tickSize(3),
yAxis = d3.axisLeft(y);

var brush = d3.brushX()
.extent([[0, 0], [width, height]])
.on("brush end", brushed);

var area = d3.area()
.curve(d3.curveMonotoneX)
.x(function(d) { return x(d.date); })
.y0(height)
.y1(function(d) { return y(d.events); });

context.append("defs").append("clipPath")
.attr("id", "clip")
.append("rect")
.attr("width", width)
.attr("height", height);

function top_graph(){
    
    d3.csv("data/alert_timeseries.csv", type_timeseries, function(error, data) {
           if (error) throw error;
           
           x.domain(d3.extent(data, function(d) { return d.date; }));
           y.domain([0, d3.max(data, function(d) { return d.events; })]);

           var x_init = x.range()[1]/2;
           
           // New ones
           
           context.append("path")
           .datum(data)
           .attr("class", "area topgraph")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
           .attr("d", area);
           
           context.append("g")
           .attr("class", "axis topgraph")
           .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
           .call(xAxis);
           
           context.append("text")
           .attr("class", "axis topgraph")
           .attr("transform", "translate(" + (margin.left+1) + "," + (height+8) + ")")
           .attr("font-size", "12px")
           .attr("fill", "white")
           .text("Nb events");
           
           context.append("g")
           .attr("class", "brush topgraph")
           .call(brush)
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
           .call(brush.move, [x_init, x.range()[1]]);
           });

};

function brushed() {
    var s = d3.event.selection || x.range();
    var start_date = s.map(x.invert, x)[0];
    var end_date = s.map(x.invert, x)[1];
    var formatDate = d3.timeFormat("%b %d %Y");
    document.getElementById('start_date').innerHTML = formatDate(start_date);
    document.getElementById('end_date').innerHTML = formatDate(end_date);
}

function type_timeseries(d) {
    d.date = parseDate(d.date);
    d.events = +d.events;
    return d;
}

///////  About pop up ///////

// When the user clicks on div, open the popup
function aboutPopup() {
    var popup = document.getElementById("aboutPopup");
    popup.classList.toggle("show");
}

document.getElementById('aboutPopup').innerHTML = "<b>Project:</b>  Building a dashboard to remotely monitor Battery Storage Power Stations, which are usually deployed as small, distributed and unmanned facilities <br /> \
<b>Audience:</b> Remote Operators <br /> <br />\
The visual has 3 main panels, a top bar and a side bar. Below are a description of the content and main functions of each:\
<ul> \
<li><b>Top bar:</b> Navigation bar; Enter name of node to select that element (site shown if none selected); Click on menu icon to make side bar appear </li>\
<li><b>Top left panel:</b> Key high level metrics for the selected node; Hover over graph to see precise value</li>\
<li><b>Top right panel:</b> Tree representation of storage plant; Nodes with alarm in orange / size depending on number of alarms; Double-click node to collapsable; Click to select node (appears in red); Alarms for selected node summarized in top left</li>\
<li><b>Bottom panel:</b> List of detailed metrics for selected node, and graph of selected metric; Last value by metric shown next to metric; Click on metric to change graph on the right; Zoom by scrolling on top graph or modifying size of grey box in bottom</li>\
<li><b>Side bar:</b> Tools allowing operator to act, and backlog of notifications to treat; Tool buttons inactive except `Live` switch (revealing WIP historical statistics); Notifications box for each alarm, with buttons allowing to Dismiss/Resolve/Escalate; Click on notification to select node </li>\
</ul> Due to limited time, some elements may not fully work as expected. Notably some functions are not linked (e.g. dismissed notifications are still present in tree), and data is a sample (e.g. all nodes of same level have the same metrics/data)<br /><br />\
<b>Design:</b>  Guillaume De Roo, Roy Gvirtsman, Shih Yu Chang <br /> "

