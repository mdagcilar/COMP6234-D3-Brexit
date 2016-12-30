

var width;

var height;

var projection, svg, path, g;
var boundaries, units;

function compute_size() {
    var margin = 50;
    width = parseInt(d3.select("#map").style("width"));
    height = window.innerHeight - 2*margin;
}

compute_size();
// initialise map
init(width, height);


// remove any data when we lose selection of a map unit
function deselect() {
    d3.selectAll(".selected")
        .attr("class", "area"); 
    d3.select("#data_table")
        .html("");      
}


function init(width, height) {

    projection = d3.geo.albers()
        .rotate([0, 0]);

    path = d3.geo.path()
        .projection(projection);

    svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    g = svg.append("g");

    g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#fff")
        .on('click', deselect);
}

//Table for values
function create_table(properties) {
    var keys = Object.keys(properties);

    table_string = "<table>";
    table_string += "<th>Quarter</th><th>Price (£)</th>";
    for (var i = 0; i < keys.length; i++) {
        table_string += "<tr><td>" + keys[i] + "</td><td>" + properties[keys[i]] + "</td></tr>";
    }
    table_string += "</table>";
    return table_string;
}

// select a map area
function select(d) {
    var id = "#" + d.id;

    d3.selectAll(".selected")
        .attr("class", "area");

    d3.select(id)
        .attr("class", "selected area")

    d3.select("#data_table")
        .html(create_table(d.properties));
}

function draw(boundaries) {

    projection
        .scale(1)
        .translate([0,0]);

    var b = path.bounds(topojson.feature(boundaries, boundaries.objects[units]));
    var s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    
    projection
        .scale(s)
        .translate(t);

    g.selectAll(".area")
        .data(topojson.feature(boundaries, boundaries.objects[units]).features)
        .enter().append("path")
        .attr("class", "area")
        .attr("id", function(d) {return d.id})
        .attr("properties_table", function(d) { return create_table(d.properties)})
        .attr("d", path)
        .on("click", function(d){ return select(d)});

    g.append("path")
        .datum(topojson.mesh(boundaries, boundaries.objects[units], function(a, b){ return a !== b }))
        .attr('d', path)
        .attr('class', 'boundary');
}


function redraw() {
    compute_size();
    //width = parseInt(d3.select("#map").style("width"));
    //height = window.innerHeight - margin;

    d3.select("svg").remove();

    init(width, height);
    draw(boundaries);
}

// loads data from file
function load_data(filename, u) {
    // clear any selection
    deselect();

    units = u;
    var f = filename;

    d3.json(f, function(error, b) {
        if (error) return console.error(error);
        boundaries = b;
        redraw();
    });    
}

// when the window is resized, redraw the map
window.addEventListener('resize', redraw);

