/**
 * retailSales.js
 *
 * 
 */


(function(){
  var margin = {top: 30, right: 60, bottom: 30, left: 60},
      width = 810 - margin.left - margin.right,   //width of svg
      height = 440 - margin.top - margin.bottom;  //height of svg
      padding = 70;                               //padding around the chart, not including the labels

  //format the date to 2012-06
  var format = d3.time.format('%Y-%B');
  
  var parseDate = d3.time.format("%b-%y").parse,
      bisectDateLeft = d3.bisector(function(d) { return d.date; }).left;

  var x = d3.time.scale().range([padding, width-padding]);
  var y0 = d3.scale.linear().range([height - padding, padding]);
  var y1 = d3.scale.linear().range([height - padding, padding]);

  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

  var yAxisLeft = d3.svg.axis().scale(y0)
    .orient("left").ticks(5);

  var yAxisRight = d3.svg.axis().scale(y1)
    .orient("right").ticks(5); 

  var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y0(d.average_weekly_retailing); });
    
  var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y1(d.average_weekly_internet_retailing); });
    
  var svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // Get the data
  d3.csv("resources/retail_sales_2011.csv", function(error, data) {
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.average_weekly_retailing = +d.average_weekly_retailing;
      d.average_weekly_internet_retailing = +d.average_weekly_internet_retailing;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { 
      return d.date; }));
    y0.domain([0, d3.max(data, function(d) {
      return Math.max(d.average_weekly_retailing); })]); 
    y1.domain([0, d3.max(data, function(d) { 
      return Math.max(d.average_weekly_internet_retailing); })]);


    svg.append("path")    // Add the valueline path.
      .attr("class", "line")
      .attr("d", valueline(data));

    svg.append("path")    // Add the valueline2 path.
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2(data));

    svg.append("g")     // Add the X Axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height -padding) + ")")
      .call(xAxis);

    svg.append("g")     // Add the right Y Axis
      .attr("class", "y axis")
      .style("fill", "steelblue")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxisLeft);

    svg.append("g")     // Add the right Y Axis
      .attr("class", "y axis")
      .attr("transform", "translate(" + (width - padding) + ", 0)")
      .style("fill", "red")
      .call(yAxisRight);

    /*
    svg.append("text")
      .attr("transform", "translate(" + (width/2 -15) + "," + (height/1.18-padding) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "steelblue")
      .text("Average Weekly Total Retailing");

    svg.append("text")
      .attr("transform", "translate(" + (width/2 - 15) + "," + (height/1.1 - padding) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "red")
      .text("Average Weekly Internet Retailing");
    */

    //brexit line
    svg.append("svg:line")
      .attr("x1", width*0.844)
      .attr("x2", width*0.844)
      .attr("y1", height - padding)
      .attr("y2", padding)
      .style("stroke", "black")
      .style("stroke-width", 0.6);

    //brexit text
    svg.append("text")
      .attr("x", width*0.819)
      .attr("y", padding - 25)
      .text("Brexit");
/*
    //x axis date end (Marking November 2016 on the bottom axis)
    svg.append("text")
      .attr("x", width*0.844)
      .attr("y", height-padding*0.7)
      .text("2016 Nov");
*/

    //graph title
    svg.append("text")
      .attr("class", "retailSaleTitle")
      .attr("font-size", 20)
      .attr("font-family", "arial")
      .attr("x", width/2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .text("Retail Sales");

    //referencing the data set - 
    //Author/Rightsholder. (Year). Title of data set (Version number) [Description of form]. Retrieved from http:// 

    svg.append("text")
      .attr("font-size", 10)
      .attr("x", (padding*3.55))
      .attr("y", (height+9))  
      .attr("text-anchor", "middle")
      .text("Office of National Statistics (ONS). (2016). Retail sales in Great Britain (Nov 2016)");

    svg.append("text")
      .attr("font-size", 10)
      .attr("x", (padding*4.69))
      .attr("y", (height+20))  
      .attr("text-anchor", "middle")
      .text("Retrieved from https://www.ons.gov.uk/businessindustryandtrade/retailindustry/bulletins/retailsales/previousReleases");


    // axis titles 
    // left y - axis label
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (padding/7) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .style("fill", "steelblue")
        .text("Total Retailing (£ million)");

    // right y - axis label
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width -padding/7) +","+(height/2)+")rotate(90)")  // text is drawn off the screen top left, move down and out and rotate
        .style("fill", "red")
        .text("Internet Retailing (£ million)");

    // x-axis label Date
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")  // centre below axis
        .text("Year");

    //Interactivity on retail sales chart
    var focus = svg.append("g")
      .style("display", "none");

    focus.append("circle")
      .style("fill", "none")
      .style("stroke", "steelblue")
      .attr("r", 4.5);

    focus.append("text")
      .attr("font-size", 16)
      .style("fill", "steelblue")
      .attr("x", -18)
      .attr("dy", -50);


    var focus1 = svg.append("g")
      .style("display", "none");

    focus1.append("circle")
      .style("fill", "none")
      .style("stroke", "red")
      .attr("r", 4.5);

    focus1.append("text")
      .attr("font-size", 16)
      .style("fill", "red")
      .attr("x", -18)
      .attr("dy", 65);

    var focusDate = svg.append("g")
      .style("display", "none");

    focusDate.append("text")
      .attr("font-size", 14);

    svg.append("rect")
      .attr("class", "overlay")
      .style("opacity", 0)
      .attr("width", width - padding)
      .attr("height", height - padding)
      .on("mouseover", setDisplaysNull)
      .on("mouseleave", setDisplaysNone)
      .on("mousemove", mousemove);

    function setDisplaysNull(){
      focus.style("display", null);
      focus1.style("display", null);
      focusDate.style("display", null);
    }

    function setDisplaysNone(){
      focus.style("display", "none");
      focus1.style("display", "none");
      focusDate.style("display", "none");
    }

    function mousemove(){
      //store the x position in a local variable.
      mousePositionX = d3.mouse(this)[0];

      var x0 = x.invert(mousePositionX);
      var i = bisectDateLeft(data, x0, 1);
      var d0 = data[i-1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      
      /*
      * if the mouse pointer is very far on the right side of the graph
      * must right the pointers text to the left hand side.
      */
      if(mousePositionX > width - padding*1.06){
        focus1.select("text")
          .attr("x", -18)
          .attr("dy", -50);
      }else{
        focus1.select("text")
          .attr("x", -18)
          .attr("dy", 65);
      }

      //display steelblue circle on rect element
      focus.attr("transform", "translate(" + x(d.date) + "," + y0(d.average_weekly_retailing) + ")");
      focus.select("text").text(d.average_weekly_retailing);

      //display red circle on rect element
      focus1.attr("transform", "translate(" + x(d.date) + "," + y1(d.average_weekly_internet_retailing) + ")");
      focus1.select("text").text(d.average_weekly_internet_retailing);

      //display date on rect element
      focusDate.attr("transform", "translate(" + (width/2 + 20) + "," + (height-(padding/3)) + ")");
      focusDate.select("text").text("- (" + format(d.date) + ")");
    }

  });
})();
