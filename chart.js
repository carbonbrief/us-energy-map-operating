var margin = {top: 80, right: 40, bottom: 140, left: 40},
width = 770 - margin.left - margin.right,
height = 470 - margin.top - margin.bottom;


var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(10);


var svg = d3.select("#viz-wrapper").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");
      
var div = d3.select("#viz-wrapper")
.append("div")  // declare the tooltip div 
.attr("class", "tooltip")              // apply the 'tooltip' class
.style("opacity", 0);                  // set the opacity to nil

d3.csv("us-energy.csv", function(error, data) {

data.forEach(function(d) {
    d.Country = d.Country;
    d.Satellites = +d.Satellites;
});

x.domain(data.map(function(d) { return d.Country; }));
y.domain([0, d3.max(data, function(d) { return d.Satellites * 1.1;})]);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
.selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-60)" );

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Satellites");

svg.selectAll("bar")
  .data(data)
  .enter().append("rect")
  .attr("class","bar")
  .attr("rx", 10)
  .attr("x", function(d) { return x(d.Country); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.Satellites); })
  .attr("height", function(d) { return height - y(d.Satellites); })
  .on("mouseover", function(d) {		
        div.transition()
            .duration(500)	
            .style("opacity", 0);
        div.transition()
            .duration(200)	
            .style("opacity", .95);	
        div	.html("<b>Satellites: </b>" + d.Satellites)	 
            .style("left", (d3.event.pageX) + "px")			 
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
    });

});