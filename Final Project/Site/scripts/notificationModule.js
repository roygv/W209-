///////  Notification Center ///////

var node = null;
var nbNotifications = 0;

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
       
       nbNotifications = data.length;
       $('#nbNotifications').html(nbNotifications);
       
       console.log(nbNotifications);
       
});

function type_alert(d) {
    d.date = new Date(d.date);
    d.alertID = +d.alertID;
    d.nodeID = +d.nodeID;
    return d;
}

function notifClick(d){
    node = d.id;
    document.getElementById('node').innerHTML = node;
}


$(document).on("click", ".toggle, .sidetoggle", function () {
                                $(".sidebar").toggleClass('active');
                                });

$(document).on("click",".cancel, .solved", function () {
               $(this).parent().toggleClass('gone');
               nbNotifications += -1;
               $('#nbNotifications').html(nbNotifications);
               });

$(document).on("click",".escalate", function () {
               $(this).parent().toggleClass('escalated');
               });
