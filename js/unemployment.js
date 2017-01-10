(function(){
var margin = {top: 30, right: 60, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;
      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);
      var y = d3.scale.linear()
          .rangeRound([height+50,50]);
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");
      var line = d3.svg.line()
          .interpolate("cardinal")
          .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
          .y(function (d) { return y(d.value); });
      var color = d3.scale.ordinal()
          .range(["#f75000","#0072e3 ","#548c00 "]);
      var svg = d3.select("#chart4").append("svg")
          .attr("width",  width  + margin.left + margin.right)
          .attr("height", height + margin.top  + margin.bottom+150)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      d3.csv("resources/data_unemp.csv", function (error, data) {
        var labelVar = 'quarter';
        var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
        color.domain(varNames);
        var seriesData = varNames.map(function (name) {
          return {
            name: name,
            values: data.map(function (d) {
              return {name: name, label: d[labelVar], value: +d[name]};
            })
          };
        });
        x.domain(data.map(function (d) { return d.quarter; }));
        y.domain([
          d3.min(seriesData, function (c) { 
            return d3.min(c.values, function (d) { return d.value; });
          }),
          d3.max(seriesData, function (c) { 
            return d3.max(c.values, function (d) { return d.value; });
          })
        ]);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height+50)+ ")")
            .call(xAxis)
            .selectAll("text") 
            .attr("font-size", 10)
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" });

            svg.append("text")
      .attr("class", "retailSaleTitle")
      .attr("font-size", 20)
      .attr("font-family", "arial")
      .attr("x", width/2)
      .attr("y", 0 - (margin.top /2) )
      .attr("text-anchor", "middle")
      .text("UK unemployment rates (aged 16 and over), seasonally adjusted");

      svg.append("text")
      .attr("class", "retailSaleTitle")
      .attr("font-size", 8)
      .attr("font-family", "arial")
      .attr("x", width/2)
      .attr("y", height +140   )
      .attr("text-anchor", "middle")
      .text("Office of National Statistics (ONS). (2016). UK Labour Market (Nov 2016)");


      svg.append("text")
      .attr("class", "retailSaleTitle")
      .attr("font-size", 8)
      .attr("font-family", "arial")
      .attr("x", width/2)
      .attr("y", height +150   )
      .attr("text-anchor", "middle")
      .text("Retrieved from https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/uklabourmarket/previousReleases");

        
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)


          .append("text")
            .attr("font-size", 10)
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("x", -40)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("％ of All economically active");
        var series = svg.selectAll(".series")
            .data(seriesData)
          .enter().append("g")
            .attr("class", "series");
        series.append("path")
          .attr("class", "line")
          .attr("d", function (d) { return line(d.values); })
          .style("stroke", function (d) { return color(d.name); })
          .style("stroke-width", "4px")
          .style("fill", "none")
        series.selectAll(".point")
          .data(function (d) { return d.values; })
          .enter().append("circle")
           .attr("class", "point")
           .attr("cx", function (d) { return x(d.label) + x.rangeBand()/2; })
           .attr("cy", function (d) { return y(d.value); })
           .attr("r", "2.5px")
           .style("fill", function (d) { return color(d.name); })
           .style("stroke", "black")
           .style("stroke-width", "1.5px")
           .on("mouseover", function (d) { showPopover.call(this, d); })
           .on("mouseout",  function (d) { removePopovers(); })
        var legend = svg.selectAll(".legend")
            .data(varNames.slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });
        legend.append("rect")
            .attr("x", width - 10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color)
            .style("stroke", "grey");
        legend.append("text")
            .attr("font-size", 10)
            .attr("x", width - 12)
            .attr("y", 6)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; });
        function removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }
        function showPopover (d) {
          $(this).popover({
            title: d.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html : true,
            content: function() { 
              return "Period: " + d.label + 
                     "<br/>Unemployment Rate: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
          });
          $(this).popover('show')
        }
      });
})();