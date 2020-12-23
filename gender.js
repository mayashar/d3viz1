var data = [
      {name: 'male', count:284,  color: 'blue'},
      {name: 'female', count: 287,  color: 'red'},
      
    ];
    
    
    var width = 490,
    height = 490,
    radius = 20;

        var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(100);

        var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.count;
        });

        var svg = d3.select('#genderchart').append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 4 + "," + height / 4 + ")");

    var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g");    

    g.append("path")
        .attr("d", arc)
      .style("fill", function(d,i) {
        return d.data.color;
      });

    g.append("text")
        .attr("transform", function(d) {
        var _d = arc.centroid(d);
        _d[0] *= 1.5;   //multiply by a constant factor
        _d[1] *= 1.5;   //multiply by a constant factor
        return "translate(" + _d + ")";
      })
      .attr("dy", ".50em")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.data.count
      });
       g.append("text")
       .attr("text-anchor", "middle")
         .attr('font-size', '4em')
         .attr('y', 20)
        .text(count);
        
   