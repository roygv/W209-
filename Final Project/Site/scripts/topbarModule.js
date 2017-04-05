///////  Get time to display in the top bar ///////

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

///////  Refresh what needs to be refreshed depending on live switch ///////

var liveon = document.getElementById("liveswitch").checked;

function liveswitchClick(){
    var liveon = document.getElementById("liveswitch").checked;
    if (!liveon) {
        top_graph();
        document.getElementById("datetop").innerHTML = "";
        image = "images/cloud-no-bolt.png";
    }
    if (liveon){
        d3.selectAll(".topgraph").remove();
        document.getElementById("datetop").innerHTML = new Date();
        image = "images/cloud-bolt.png"
    }
    document.getElementById("logo").src = image;
}


///////  Top bar graph ///////

document.getElementById("logo").src = "images/cloud-bolt.png";
document.getElementById("datetop").innerHTML = new Date();

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
           .attr("transform", "translate(" + (margin.left+1) + "," + (height+5) + ")")
           .attr("font-size", "12px")
           .attr("fill", "silver")
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
    var formatDate = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ");
    document.getElementById('start_date').innerHTML = formatDate(start_date);
    document.getElementById('end_date').innerHTML = formatDate(end_date);
}

function type_timeseries(d) {
    d.date = parseDate(d.date);
    d.events = +d.events;
    return d;
}
