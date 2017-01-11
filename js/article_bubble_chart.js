/**
 * article_bubble_chart.js
 *
 *  This js file is used to display the bubble chart of articles.
 */
(function(){
if(window.innerWidth > 1620){
  var w = window.innerWidth*0.70*0.95;
  var h = Math.ceil(w*0.42);
  var oR = 0;
  var nTop = 1;
      
  var svgContainer = d3.select("#mainBubble")
    .style("height", h+"px");
} else {
    var w = window.innerWidth*0.90*0.95;
    var h = Math.ceil(w*0.42);
    var oR = 0;
    var nTop = 0;
        
    var svgContainer = d3.select("#mainBubble")
        .style("height", h+"px");
}



var svg2 = d3.select("#mainBubble").append("svg")
    .attr("class", "mainBubbleSVG")
    .attr("width", w)
    .attr("height",h)
    .on("mouseleave", function() { return resetBubbles();});
         
  
//Reading in the json data
d3.json("resources/bubble.json", function(error, root) {
    console.log(error);                 //log any errors to console
      
    var bubbleObj = svg2.selectAll(".topBubble")
        .data(root.children)
        .enter().append("g")
        .attr("id", function(d,i) {return "topBubbleAndText_" + i});


    //number of top nodes in the json file
    nTop = root.children.length;

    //radius of the main bubbles dependong on how many root children and width of the screen
    oR = w/(1+3*nTop);  

    h = Math.ceil(w/nTop*1.85);
    svgContainer.style("height",h+"px");
         
    //Constructs a new ordinal scale with a range of ten categorical colors
    var colVals = d3.scale.category10();
         
    bubbleObj.append("circle")
        .attr("class", "topBubble")
        .attr("id", function(d,i) {return "topBubble" + i;})
        .attr("r", function(d) { return oR; })
        .attr("cx", function(d, i) {return oR*(3*(1+i)-1);})
        .attr("cy", (h+oR)/3)
        .style("fill", function(d,i) { return colVals(i); }) //iterates over colVals 
        .style("opacity",0.4)
        .on("mouseover", function(d,i) {return activateBubble(d,i);});        
             
    bubbleObj.append("text")
        .attr("class", "topBubbleText")
        .attr("x", function(d, i) {return oR*(3*(1+i)-1);})
        .attr("y", (h+oR)/3)
        .style("fill", function(d,i) { return colVals(i); }) // #1f77b4
        .attr("font-size", 20)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(d) {return d.name})      
        .on("mouseover", function(d,i) {return activateBubble(d,i);});
 
    for(var iB = 0; iB < nTop; iB++)
    {
        var childBubbles = svg2.selectAll(".childBubble" + iB)
            .data(root.children[iB].children)
            .enter().append("g");
               
         
        childBubbles.append("circle")
            .attr("class", "childBubble" + iB)
            .attr("id", function(d,i) {return "childBubble_" + iB + "sub_" + i;})
            .attr("r",  function(d) {return oR/3.0;})
            .attr("cx", function(d,i) {return (oR*(3*(iB+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
            .attr("cy", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
            .attr("cursor","pointer")
            .style("opacity",0.6)
            .style("fill", "#eee")
            .append("svg:title")
            .text(function(d) { return d.address; });  

        childBubbles.append("text")
            .attr("class", "childBubbleText" + iB)
            .attr("x", function(d,i) {return (oR*(3*(iB+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
            .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
            .style("opacity",0.65)
            .attr("text-anchor", "middle")
            .style("fill", function(d,i) { return colVals(iB); }) // #1f77b4
            .attr("font-size", 10)
            .attr("cursor","pointer")
            .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
            .text(function(d) {return d.name});
    }
}); 


/*resetListeners = function(i){
    //reset all listeners on small bubbles
    d3.selectAll(".childBubbleText")
        .on("click", null);
    d3.selectAll(".childBubble")
        .on("click", null);
}*/
 
resetBubbles = function () {

    var t = svg2.transition()
        .duration(650);
         
        t.selectAll(".topBubble")
            .attr("r", function(d) { return oR; })
            .attr("cx", function(d, i) {return oR*(3*(1+i)-1);})
            .attr("cy", (h+oR)/3);
 
        t.selectAll(".topBubbleText")
        .attr("font-size", 20)
            .attr("x", function(d, i) {return oR*(3*(1+i)-1);})
            .attr("y", (h+oR)/3);
     
    for(var k = 0; k < nTop; k++) 
    {
        t.selectAll(".childBubbleText" + k)
           .attr("x", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
           .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
           .attr("font-size", 10)
           .style("opacity",0.65);
 
        t.selectAll(".childBubble" + k)
           .attr("r",  function(d) {return oR/3.0;})
           .style("opacity",0.6)
           .attr("cx", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
           .attr("cy", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));});            
    }   
}
         
//enlarge a bubble when mousehover event is handled        
function activateBubble(d,i) {
    var thisBubble = i;

// increase this bubble and decrease others
    var t = svg2.transition()
        .duration(650);   

    t.selectAll(".topBubble")
        .attr("cx", function(d,ii){

            if(i == ii) {
            // Nothing to change
            return oR*(3*(1+ii)-1) - 0.6*oR*(ii-1);
            } else {
                // Push away a little bit
                if(ii < i){
                // left side
                return oR*0.6*(3*(1+ii)-1);
                } else {
                    // right side
                    return oR*(nTop*3+1) - oR*0.6*(3*(nTop-ii)-1);
                       }
                   }               
            })
        .attr("r", function(d, ii) { 
            if(i == ii)
                return oR*1.8;
                else
                    return oR*0.8;
            });
                     
    t.selectAll(".topBubbleText")
        .attr("x", function(d,ii){
            if(i == ii) {
            // Nothing to change
            return oR*(3*(1+ii)-1) - 0.6*oR*(ii-1);
            } else {
                // Push away a little bit
                if(ii < i){
                    // left side
                    return oR*0.6*(3*(1+ii)-1);
                    } else {
                        // right side
                        return oR*(nTop*3+1) - oR*0.6*(3*(nTop-ii)-1);
                          }
            }               
        })          
        .attr("font-size", function(d,ii){
            if(i == ii)
                return 24*1.5;
                else
                    return 24*0.6;              
                });
     
        var signSide = -1;
        for(var k = 0; k < nTop; k++) 
        {
            signSide = 1;
            if(k < nTop/2) signSide = 1;

            t.selectAll(".childBubbleText" + k)
                .attr("x", function(d,i) {return (oR*(3*(k+1)-1) - 0.6*oR*(k-1) + signSide*oR*2.5*Math.cos((i-1)*45/180*3.1415926));})
                .attr("y", function(d,i) {return ((h+oR)/3 + signSide*oR*2.5*Math.sin((i-1)*45/180*3.1415926));})
                .attr("font-size", function(){
                    return (k==i)?12:6;
                })
                .style("opacity",function(){
                    return (k==i)?1:0;
                });
                     
            t.selectAll(".childBubble" + k)
                .attr("cx", function(d,i) {return (oR*(3*(k+1)-1) - 0.6*oR*(k-1) + signSide*oR*2.5*Math.cos((i-1)*45/180*3.1415926));})
                .attr("cy", function(d,i) {return ((h+oR)/3 + signSide*oR*2.5*Math.sin((i-1)*45/180*3.1415926));})
                .attr("r", function(){
                   return (k==i)?(oR*0.55):(oR/3.0);               
                })
                .style("opacity", function(){
                    return (k==i)?1:0;                  
                }); 
        }
        d3.selectAll(".childBubbleText" + thisBubble)
            .on("click", function(d, thisBubble){
              window.open(d.address)
        });
        d3.selectAll(".childBubble" + thisBubble)
            .on("click", function(d, thisBubble){
              window.open(d.address)
        });
}
})();



