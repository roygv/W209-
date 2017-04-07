// Creating the autocomplete

$(function(){
  
  function node_structure(d) {
  d.id = +d.id;
  d.value = d.name;
  return d;
  }
  
  d3.csv("data/tree_structure.csv",node_structure,function(error, data){

         $('#search').autocomplete({
                                   lookup: data,
                                   onSelect: function (suggestion) {
                                   var found = suggestion.id;
                                   console.log("search"+found);
                                   updateNode(found);
                                   }
                                   });
         
         });
  
});

// Catches when the search is cleared

$('input[type=search]').on('search', function () {
                           updateNode(-1);
                           });


// Initialization of node number
var node = -1;
document.getElementById('node').innerHTML = node;


// Aggregating all the things which need to happen when the current node is updated

function updateNode(node){
    
    // Updating the name in the search bar
    function node_structure(d) {
        d.id = +d.id;
        d.name = d.name;
        return d;
    }
    d3.csv("data/tree_structure.csv",node_structure,function(error, data){
           var name = "";
           var type = "";
           data.forEach(function(d){
                        if (d.id == node){name = d.name;type = d.type;};
                        });
           $('#search').attr("value",name);
           $('input[name=search]').val(name);
           
           // Updating table
           AgITable.init(type);
           });
    
    // Updating the text indicator
    $('#node').html(node);
    
    // Updating the tree
    // not working and it's not because the click is inside the init function:
    // the visual effect is the same when we create a separate function
    // The key is to modify AgItree such that if I write AgITree.init(-1); at the end twice in a row, it works
    // AgITree.init(node);

}
