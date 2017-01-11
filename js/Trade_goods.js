var margin = {top: 30, right: 60, bottom: 30, left: 60},
      width = 810 - margin.left - margin.right,   //width of svg
      height = 440 - margin.top - margin.bottom;  //height of svg
      padding = 70;                               //padding around the chart, not including the labels
var	parseDate = d3.time.format("%d-%b-%y").parse;

var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(5);

var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);

var	valueline = d3.svg.line()
	.x(function(d) { return x(d.Month); })
	.y(function(d) { return y(d.Exports); });

var	valueline2 = d3.svg.line()
	.x(function(d) { return x(d.Month); })
	.y(function(d) { return y(d.Imports); });

var	svg = d3.select("#chart6")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("https://raw.githubusercontent.com/shortdistance/cloud-team-d/master/data2b-new.csv", function(error, data) {
	data.forEach(function(d) {
		d.Month = parseDate(d.Month);
		d.Exports = +d.Exports;
		d.Imports = +d.Imports;
	});

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.Month; }));
	y.domain([80, d3.max(data, function(d) { return Math.max(d.Exports, d.Imports); })]);

	svg.append("path")		// Add the valueline path.
		.attr("class", "line")
		.attr("d", valueline(data));

	svg.append("path")		// Add the valueline2 path.
		.attr("class", "line")
		.style("stroke", "red")
		.attr("d", valueline2(data));

	svg.append("g")			// Add the X Axis
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")			// Add the Y Axis
		.attr("class", "y axis")
		.call(yAxis);

	svg.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[0].Imports) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "red")
		.text("Imports");

	svg.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[0].Exports) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "steelblue")
		.text("Exports");

	//graph title
    svg.append("text")
      .attr("class", "retailSaleTitle")
      .attr("font-size", 20)
      .attr("font-family", "arial")
      .attr("x", width/2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .text("Trade in goods export and import prices, September 2014 to September 2016");


console.log(data.length-1);
console.log(data[data.length-1].Imports);
console.log(data[0].Imports);
console.log(y(data[0].Imports));
console.log(y(data[0].Exports));

});
/**
 * Created by Grqiiiirachel on 2017/1/11.
 */
