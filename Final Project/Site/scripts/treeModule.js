var AgITree = (function () {
               var modelNodes, modelLinks=[], nodes, links=[], simulation, context, width, height;
               
               function node_structure(d) {
               d.id = +d.id;
               d.core = +d.core;
               d.node = +d.node;
               d.alarm = +d.alarm;
               d.alarm_col = +d.alarm_col;
               d.parent = +d.parent;
               d.name = d.name;
               d.depth = +d.depth;
               d.hidden = 0;
               d.collapsed = 0;
               d.selected = 0;
               d.r = 0;
               return d;
               }
               
               function ticked() {
               context.clearRect(0, 0, width, height);
               context.save();
               context.translate(10, height / 2);
               
               context.beginPath();
               links.forEach(drawLink);
               context.strokeStyle = "#9ecae1";
               context.stroke();
               
               context.beginPath();
               nodes.forEach(drawNode);
               context.restore();
               }
               
               // Color leaf nodes orange, and packages white or blue.
               function color(d) {
               return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
               }
               
               function dragsubject() {
               return simulation.find(d3.event.x - 10, d3.event.y - height / 2, 10);
               }
               
               function dragstarted() {
               if (!d3.event.active) simulation.alphaTarget(0.1).restart();
               d3.event.subject.fx = d3.event.subject.x;
               d3.event.subject.fy = d3.event.subject.y;
               }
               
               function dragged() {
               console.log("drag" + d3.event.subject.id);
               d3.event.subject.fx = d3.event.x;
               d3.event.subject.fy = d3.event.y;
               }
               
               function selectTarget(id) {
               modelNodes.forEach(function (d){
                             d.selected = (d.id == id)? 1:0;
                                  });
               }
               
               function hide(id) {
               modelNodes.forEach(function(d){
                                  if (d.parent == id){
                                  d.hidden = 1;
                                  if (d.children.length > 0){d.collapsed = 1;}
                                  hide(d.id);}
                                  });
               }
               
               function dragended() {
               if (!d3.event.active) simulation.alphaTarget(0);
               d3.event.subject.fx = null;
               d3.event.subject.fy = null;
               }
               
               function drawLink(d) {
               if ((d.source.hidden == 0) && (d.target.hidden == 0)){
               context.moveTo(d.source.x, d.source.y);
               context.lineTo(d.target.x, d.target.y);
               }
               }
               
               function drawNode(d) {
               if (d.hidden == 0) {
               // Draw circle
               //var radius = d.type == 'Site' ? 0 : (d.type == 'Array' ? 18 : (d.type == 'Core' ? 12 : (d.type == 'Alert'? 4: 8)));
               //var radius = 2 + ((d.alarm - 1) * 1);
               //var radius = (d.alarm == 1) ? 2 : 4;
               var al = (d.collapsed == 0)? d.alarm : d.alarm_col;
               var radius = 7 + Math.sqrt(al)*2;
               d.r = radius;
               context.moveTo(d.x + radius, d.y);
               context.beginPath();
               context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
               context.fillStyle = (d.alarm > 0)? "orange" :((d.alarm_col > 0 && d.collapsed==1)? "orange" :(d.collapsed == 1) ? "#9ecae1" : "#FFFFFF");
               context.fill();
               if (d.selected == 1){
               context.strokeStyle = "red";
               context.strokeWidth = 3;
               } else {
               context.strokeStyle = "#3182bd";
               context.strokeWidth = 2;
               }
               context.stroke();
               
               // Write number in circle
               context.fillStyle = "black"; // font color to write the text with
               var font = radius * 1.3 + "1px Arial";
               context.font = font;
               context.textAlign = 'center';
               context.textBaseline = "middle";
               var text = (d.type == 'Core' ? d.core.toString() : (d.type == 'Node' ? d.node.toString() : ""));
               context.beginPath();
               context.fillText(text, d.x, d.y);
               context.stroke();
               }
               }
               
               // show tooltip when mouse hovers over dot
               
               function handleMouseMove(e){

                   function getXPixel(val) {
                   return val+10;
                   }
                   function getYPixel(val) {
                   return  val+200;
                   }
               
                   var canvasOffset = $("#tree").offset();
                   var offsetX = canvasOffset.left;
                   var offsetY = canvasOffset.top;
                   var tipCanvas = document.getElementById("treetooltip");
                   var tipCtx = tipCanvas.getContext("2d");
                   
                   mouseX=parseInt(e.clientX-offsetX);
                   mouseY=parseInt(e.clientY-offsetY);
                   
                   // Put your mousemove stuff here
                   var hit = false;
                   for (var i = 0; i < nodes.length; i++) {
                   var dot = nodes[i];
                   var dx = mouseX - getXPixel(dot.x);
                   var dy = mouseY - getYPixel(dot.y);
                   if ((dx * dx + dy * dy) < (dot.r*dot.r)) {
                   tipCanvas.style.left = getXPixel(dot.x+440) + "px";
                   tipCanvas.style.top = (getYPixel(dot.y)+40) + "px";
                   tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);
                   var al = (dot.collapsed == 1)? dot.alarm_col : dot.alarm;
                   tipCtx.fillText(dot.name + " (" + al + ")", 5, 15);
                   hit = true;
                   }
                   }
                   if (!hit) { tipCanvas.style.left = "-200px"; }
               }
               
               
               // Returns a list of all nodes under the root.
               function visibleNodes(nodes) {
               var visibleNodes = [], i = 0;
               
               nodes.forEach(function (d) {
                             
                             if ((d.alert == 1) || (nodes[d.parent].collapsed == 0)) {
                             visibleNodes.push(d);
                             }
                             });
               return visibleNodes;
               }
               
               
               return {
               init: function(selectedNode){
               d3.csv("data/tree_structure.csv",node_structure,function(error, data){
                      if (error) throw error;
                      modelNodes = data;
                      data.forEach(function(d){
                                   d.children=[];
                                   if (d.parent >= 0) {
                                   links.push({source: d.id, target: d.parent});
                                   modelNodes[d.parent].children.push(d);
                                   }
                                   })
                      
                      selectTarget(selectedNode)
                      
                      nodes = visibleNodes(modelNodes);
                      
                      console.log(nodes);
                      
                      var x_depth = 100;
                      
                      function init_pos(n){
                      n[0].fx = 50;
                      n[1].fx = n[0].fx+x_depth;
                      n[1].children[0].fx = n[1].fx+x_depth;
                      n[1].children[1].fx = n[1].fx+x_depth;
                      n[1].children[2].fx = n[1].fx+x_depth;
                      n[1].children[3].fx = n[1].fx+x_depth;
                      n[1].children[4].fx = n[1].fx+x_depth;
                      return n
                      }
                      
                      function sim(n,l){
                          simulation = d3.forceSimulation(init_pos(n))
                          .force("charge", d3.forceManyBody())
                          .force("link", d3.forceLink(l).distance(30).strength(0.2))
                          .force("x", d3.forceX(function(d) {return d.depth*2*x_depth;}))
                          .force("y", d3.forceY())
                          .force("collide",d3.forceCollide().radius(function(d) {return d.r + 0.2;}).iterations(1))
                          .on("tick", ticked);
                          return simulation;}
                      
                      simulation = sim(nodes, links);
                      
                      
                      // .force("x", d3.forceX(function(d) {if(d.children[0]){return d.children[0].x-100;}else{return d.depth*100};}))
                      
                      var canvas = document.querySelector("#tree");
                      context = canvas.getContext("2d");
                      
                      width = canvas.width;
                      height = canvas.height;
                      
                      context.clearRect(0, 0, width, height);
                      
                      d3.select(canvas)
                      .call(d3.drag()
                            .container(canvas)
                            .subject(dragsubject)
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended));
                      
                      d3.select(canvas).on("dblclick", function(){
                                           
                                           var m = d3.mouse(this);
                                           node = simulation.find(m[0] - 10, m[1] - height / 2, 10);
                                           
                                           if (node) {
                                               console.log("dblclick" + node.id);
                                           
                                           if (node.collapsed == 0) {
                                               parent=node.id;
                                               if (node.children.length != 0){
                                                   node.collapsed = 1;
                                               };
                                               hide(node.id)
                                           }
                                           
                                           else {
                                           parent=node.id;
                                           node.collapsed = 0;
                                           modelNodes.forEach(function(d){
                                                              if (d.parent == parent)
                                                              d.hidden = 0;
                                                              })}
                                           
                                           
                                           nodes = visibleNodes(modelNodes);
                                           
                                           simulation = sim(nodes, links);
                                           
                                           ticked();
                                           
                                           }
                                           
                                           });
                      
                      d3.select(canvas).on("click", function(){
                                           
                                           var m = d3.mouse(this);
                                           node = simulation.find(m[0] - 10, m[1] - height / 2, 10);
                                           
                                           if (node) {
                                           console.log("click" + node.id);
                                           updateNode(node.id);
                                           selectTarget(node.id);
                                           nodes = visibleNodes(modelNodes);
                                           simulation = sim(nodes, links);
                                           }
                                           
                                           if (!node) {
                                           updateNode(-1);
                                           selectTarget(-1);
                                           nodes = visibleNodes(modelNodes);
                                           simulation = sim(nodes, links);
                                           }
                                           
                                           
                                           });
                      
                      /// Tooltips
                      
                      $("#tree").mousemove(function(e){handleMouseMove(e);});
                      
                      
                      });
               
               
               },
               
               };
               })();

AgITree.init(-1);
//AgITree.init(-1);
