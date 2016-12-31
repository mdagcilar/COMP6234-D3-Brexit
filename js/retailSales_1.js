/**
 * storyline.js
 *
 * 
 */



var margin = {top: 30, right: 60, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var parseDate = d3.time.format("%b-%y").parse;

var x = d3.time.scale().range([0, width]);
var y0 = d3.scale.linear().range([height, 0]);
var y1 = d3.scale.linear().range([height, 0]);

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
  
var svg1 = d3.select("#chart2")
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


  svg1.append("path")    // Add the valueline path.
    .attr("class", "line")
    .attr("d", valueline(data));

  svg1.append("path")    // Add the valueline2 path.
    .attr("class", "line")
    .style("stroke", "red")
    .attr("d", valueline2(data));

  svg1.append("g")     // Add the X Axis
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg1.append("g")     // Add the Y Axis
    .attr("class", "y axis")
    .call(yAxisLeft);

  svg1.append("g")     // Add the Y Axis
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + ", 0)")
    .style("fill", "red")
    .call(yAxisRight);


  svg1.append("text")
    .attr("transform", "translate(" + (width/2 -60) + "," + height/1.24 + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Average Weekly Total Retailing");

  svg1.append("text")
    .attr("transform", "translate(" + (width/2 -60) + "," + height/1.1 + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Average Weekly Internet Retailing");

  svg1.append("svg:line")
    .attr("x1", width*0.95)
    .attr("x2", width*0.95)
    .attr("y1", height)
    .attr("y2", 0)
    .style("stroke", "black")
    .style("stroke-width", 0.6)
});

