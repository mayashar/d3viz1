// select the svg area
var svg = d3.select("#mylegend")

// Handmade legend



svg.append("circle").attr("cx",20).attr("cy",7).attr("r", 5).style("fill", "black")
svg.append("text").attr("x", 25).attr("y",7).text("PUMP").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append("circle").attr("cx",20).attr("cy",24).attr("r", 3).style("fill", "red")
svg.append("text").attr("x", 25).attr("y",24).text("female").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append("circle").attr("cx",20).attr("cy",38).attr("r", 3).style("fill", "blue")
svg.append("text").attr("x", 25).attr("y",38).text("male").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append('rect').attr('x', 18).attr('y', 50).attr('width', 8).attr('height', 6).attr('stroke', 'black').attr('fill', '#8FBC8F')
svg.append("text").attr("x", 30).attr("y",50).text("workhouse").style("font-size", "15px").attr("alignment-baseline","middle")

svg.append('rect').attr('x', 18).attr('y',65).attr('width', 8).attr('height', 6).attr('stroke', 'black').attr('fill', '#808080')
svg.append("text").attr("x", 30).attr("y",65).text("brewery house").style("font-size", "15px").attr("alignment-baseline","middle")