
/////// Functions to open and close the notification center ///////

function openMenu() {
    document.getElementById("rightMenu").style.display = "block";}
function closeMenu() {
    document.getElementById("rightMenu").style.display = "none";}


///////  Get time to display in the top bar ///////

var current_date = new Date();
//document.getElementById('date').innerHTML = date;


///////  Refresh what needs to be refreshed depending on live switch ///////

var liveon = document.getElementById("liveswitch").checked;

function liveswitchClick(){
    var liveon = document.getElementById("liveswitch").checked;
    top_graph(liveon)
    // We would probably need to refresh the rest of the graphs too
}


///////  Top bar graph ///////

var context = d3.select("#context"),
margin = {top: 0, right: 20, bottom: 20, left: 25},
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

var xAxis = d3.axisBottom(x),
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

function top_graph(l){
    
    d3.csv("data/alert_timeseries.csv", type_timeseries, function(error, data) {
           if (error) throw error;
           
           x.domain(d3.extent(data, function(d) { return d.date; }));
           y.domain([0, d3.max(data, function(d) { return d.events; })]);

           var x_init = (l) ? x.range()[1]/2 : x.range()[1]/2;
           
           // Clean of past graphs
           d3.selectAll(".topgraph").remove();
           
           // New ones
           
           context.append("path")
           .datum(data)
           .attr("class", "area topgraph")
           .attr("transform", "translate(0," + margin.top + ")")
           .attr("d", area);
           
           context.append("g")
           .attr("class", "axis topgraph")
           .attr("transform", "translate(0," + (height+margin.top) + ")")
           .call(xAxis);
           
           context.append("text")
           .attr("class", "axis topgraph")
           .attr("transform", "translate(1," + (height-2) + ")")
           .attr("font-size", "12px")
           .attr("fill", "silver")
           .text("Nb events");
           
           context.append("g")
           .attr("class", "brush topgraph")
           .call(brush)
           .attr("transform", "translate(0," + margin.top + ")")
           .call(brush.move, [x_init, x.range()[1]]);
           });

};

top_graph(liveon)

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

///////  Notification Center ///////


var node = null;

document.getElementById('node').innerHTML = node;

function render_notification(v, d) {
    return v + "<div onclick='notifClick(this);' id='"+ d.nodeID +"' class='delay notibox'><b>"+ (d.date.toTimeString().split(' ')[0]) +"</b> (Notification #"+ d.alertID +") <br />\
    "+ d.nature + " at node "+ d.nodeID +" <br /> <br /> \
        <div class='delay cancel'>Dismiss</div> \
        <div class='delay solved'>Resolved</div> \
        <div class='delay escalate'>Escalate</div> \
    </div>"
}

d3.csv("data/alert_data.csv", type_alert, function(error, data) {
       if (error) throw error;
       
       var n = data.length;
       var notif_text = "";
       
       for (var i = 0; i < data.length; i++) {
       var notif_text = render_notification(notif_text, data[i]);
       }
       
       $('#notificationCenter').html(notif_text);
       
});

function type_alert(d) {
    d.date = new Date(d.date);
    d.alertID = +d.alertID;
    d.nodeID = +d.nodeID;
    return d;
}

function notifClick(d){
    var node = d.id;
    document.getElementById('node').innerHTML = node;
}


$(".toggle, .sidetoggle").click(function () {
                   $(".sidebar").toggleClass('active');
                   });

$(document).on("click",".cancel, .solved", function () {
                   $(this).parent().toggleClass('gone');
                   });

$(document).on("click",".escalate", function () {
                   $(this).parent().toggleClass('escalated');
                   });
