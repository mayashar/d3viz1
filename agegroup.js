var margin = {top: 50, right: 30, bottom: 50, left: 50},
    width = 350 - margin.left - margin.right,
    height = 310 - margin.top - margin.bottom;

var ageGrp = [
    {group: "0-10", value: 25.04},
    {group: "11-20", value: 8.41},
    {group: "21-40", value: 10.16 },
    {group: "41-60", value: 9.98},
    {group: "61-80", value: 15.94},
    {group: ">80", value: 30.47,}
];     
// bar tip
var tooltip;
// append the svg object to the body of the page
var svg = d3.select("#agechart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

// X axis
var x = d3.scaleBand()
    .range([0, width])
    .domain(ageGrp.map(function (d) {
        return d.group;
    }))
    .padding(0.2);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 30])
    .range([height, 0]);
svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));
// text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("% Number of deaths"); 

// Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
// text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/3) + " ," + 
                           (height + margin.bottom + 0.1) + ")")
      .style("text-anchor", "middle")
      .text("age group");

// A function that create / update the plot for a given variable:
function update(data) {
    tooltip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-20, 0])
        .html(function (d) {
            return "<strong>death percentage:</strong> <span style='color:orangered'>" + d.value + " %</span>";
        })
    var u = svg.selectAll("rect")
        .data(data)
    u.enter()
        .append("rect")
        .call(tooltip)
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide)
        .merge(u)
        .transition()
        .duration(1000)
        .attr("x", function (d) {
            return x(d.group);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d.value);
        })
        
        .attr("fill", function (d) {
                return colors1[d.group];
            });
}

// Initialize the plot with the first dataset
update(ageGrp)

   