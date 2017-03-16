
// Functions to open and close the notification center

function openMenu() {
    document.getElementById("rightMenu").style.display = "block";}
function closeMenu() {
    document.getElementById("rightMenu").style.display = "none";}

// Get time to display at the top

var date = new Date();
document.getElementById('date').innerHTML = date;

