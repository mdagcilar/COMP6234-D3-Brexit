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

  var parseDate = d3.time.format("%b-%y").parse;

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

    svg.append("svg:line")
      .attr("x1", width*0.85)
      .attr("x2", width*0.85)
      .attr("y1", height - padding)
      .attr("y2", padding)
      .style("stroke", "black")
      .style("stroke-width", 0.6);

    // axis titles 

    // left y - axis label
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (padding/7) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .style("fill", "steelblue")
        .text("Average Weekly Total Retailing (£ million)");

    // right y - axis label
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width -padding/7) +","+(height/2)+")rotate(90)")  // text is drawn off the screen top left, move down and out and rotate
        .style("fill", "red")
        .text("Average Weekly Internet Retailing (£ million)");

    // x-axis label Date
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")  // centre below axis
        .text("Date");
  });
})();
