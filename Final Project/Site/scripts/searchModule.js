function extract_select2_data(node,leaves,index){
                      console.log(node);
                      if (node.children!= 0){
                      console.log(node.children);
                      for(var i = 0;i<node.children.length;i++){
                      index = extract_select2_data(node.children[i],leaves,index)[0];
                      }
                      }
                      leaves.push({id:++index,text:node.name});
                      return [index,leaves];
                      }
                      
                      select2_data = extract_select2_data(nodes[1],[],0)[1];
                         $("#search").select2({
                                              data: select2_data,
                                              containerCssClass: "search"
                                              });
                      