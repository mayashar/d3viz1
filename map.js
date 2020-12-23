var mapWidth, mapHeight, pumps, deaths, streets, mapChart, tipChart;
var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']



// function to draw pumps

function initPumps(data) {
    var xScale = d3.scaleLinear();
    var yScale = d3.scaleLinear();
    xScale.domain([0, 15]).range([0, mapWidth]);

    yScale.domain([15, 0]).range([0, mapHeight]);

    var pumps = d3.select('#main').select('g').selectAll(".pumpcircle").data(data);

    pumps.enter().append("circle")
        .attr("r", 8)
        .style("fill", "black")
        .attr("class", "pumpcircle")
        .attr("cx", function (d) {
            return xScale(d.x);
        })
        .attr("cy", function (d) {
            return yScale(d.y);
        });
}

function drawDeathChart(data) {
    const main = d3.select('#main');
    main.selectAll("circle").remove();
    var xScale = d3.scaleLinear();
    var yScale = d3.scaleLinear();
    xScale.domain([0, 15]).range([0, mapWidth]);

    yScale.domain([15, 0]).range([0, mapHeight]);

    var circles = d3.select('#main').select('g').selectAll(".gendercircle").data(data);

    circles.enter().append("circle")
        .attr("r", 5)
        .style("fill", function (d) {
            if (d.gender == 1) return colors2[0]; else return colors2[1]
        })
        .attr("cx", function (d) {
            return xScale(d.x);
        })
        .attr("cy", function (d) {
            return yScale(d.y);
        })
}

// function to draw timeline chart
function initTimeChart() {
    var g = d3.select("#map")
        .append("svg")
        .attr("id", "timeline")
        .attr("fill", "#69b3a2")
        
    var data = deathdays;
    const parseTime = d3.timeParse("%d-%b");
    data.forEach(function (d) {
        d.date = parseTime(d.date);
        d.deaths = +d.deaths;
    });
    var x2 = d3.scaleTime().range([0, width]);
    var y2 = d3.scaleLinear().range([height, 0]);  
    var myline = d3.line()
        .x(function (d) {
            return x2(d.date);
        })
        .y(function (d) {
            return y2(d.deaths);
        });
    var lineSvg = g
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x2.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y2.domain([0, d3.max(data, function (d) {
        return d.deaths;
    })]);

    // Add the myline path.
    lineSvg.append("path")
        .data([data])
        .attr("class", "line")

        .attr("d", myline);

    // Add the X Axis
    lineSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x2)
            .tickFormat(d3.timeFormat("%d %b")));

    // Add the Y Axis
    lineSvg.append("g")
        .call(d3.axisLeft(y2));

 // text label for the x axis
    lineSvg.append("text")
        .attr("x", (width / 2))
        .attr("text-anchor", "top")
        .style("font-size", "14px")
        .style("fill", "black")
        .text("Hover over to see deaths");
// text label for the y axis
  lineSvg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("fill", "black")
      .style("text-anchor", "top")
      .text("Number of Deaths");  
    
  lineSvg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 0.2) + ")")
      .style("text-anchor", "middle")
      .style("fill", "black")
      .text("Date");
// Add the scatterplot
    lineSvg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x2(d.date)
        })
        .attr("cy", function (d) {
            return y2(d.deaths)
        })
        .attr("r", 5)
        .call(tipChart)
        .on('mouseover', (data) => {
            const d = deaths.slice(0, data.deaths);
            drawDeathChart(d);
            initPumps(pumps);
            tipChart.show(data);
            // timeTip.show(data);
        })
        .on('mouseout', tipChart.hide)
        .attr("fill", "orangered");
}


function initVariables() {
    mapWidth = mapHeight = 450;
    d3.csv("pumps.csv", function (data) {
        pumps = data;
        // get deaths by age and sex data
        d3.csv("deaths_age_sex.csv", function (data) {
            deaths = data;
            // get streets data
            d3.json("streets.json", function (data) {
                streets = data;
                // draw the map
                drawDeathChart(deaths);
                d3.csv("deathdays.csv", function (data) {
                    deathdays = data;
                    initMapChart();
                    initTimeChart();

                });
            });
        });
    });
}

function initToolTips() {
    tipChart = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<br><strong> Date:</strong> <span style='color:red'>" + getDate(d.date) + "</span></br>" + "<strong>Deaths:</strong> <span style='color:red'>" + d.deaths + "</span>";
        })
}

function initMapChart() {
    // create svg and upload it to div that have id map
    var g = mapChart = d3.select("#map")
        .append("svg")
        .attr("id", "main")
        .attr("width", "550")
        .attr("height", "500")

        .call(d3.zoom().on("zoom", function () {
            g.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
        }))
        .append("g")

        .attr("transform", "translate(-50,150) ");

    // create d3 scale
    var xScale = d3.scaleLinear();
    var yScale = d3.scaleLinear();

    xScale.domain([0, 15]).range([0, mapWidth]);

    yScale.domain([15, 0]).range([0, mapHeight]);

    // defining path generator
    var pathGenerator = d3.line()
        .x(function (d) {
            return xScale(d.x);
        })
        .y(function (d) {
            return yScale(d.y);
        });

   
// filling street informations inside map with stylying text

    g.selectAll(".line")
        .data(streets)
        .enter().append("path")
        .style('fill', '#e2d1bb')
        .style('stroke', 'black')
        .style('stroke-width', '3px')
        .attr("class", "map")
        .attr("d", pathGenerator)

    g.append("text")
        .style("fill", "balck")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(370,90) rotate(-28)")
        .text("BROAD STREET");

    g.append("text")
        .style("fill", "black")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
                .attr("transform", "translate(220,120) rotate(60)")
        .text("REGENT STREET");

    g.append("text")
        .style("fill", "black")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(300,-55) rotate(-10)")
        .text("OXFORD STREET");

    g.append("text")
        .style("fill", "black")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(503,-20) rotate(67)")
        .text("DEAN STREET")
    // calling funtions to draw structures
    deathsGender();
    whmap();
    brewmap();
}

// update circles on map to be by age
function deathsAge() {
    const main = d3.select('#main');
    main.selectAll("circle").remove();
    initPumps(pumps);
    d3.csv("deaths_age_sex.csv", (data) => {

        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
        xScale.domain([0, 15]).range([0, mapWidth]);

        yScale.domain([15, 0]).range([0, mapHeight]);

        var circles = d3.select('#main').select('g').selectAll(".gendercircle").data(data);
        circles.enter().append("circle")
            .attr("r", 4)
            .style("fill", function (d) {
                return colors1[d.age_range]
            })
            .attr("cx", function (d) {
                return xScale(d.x);
            })
            .attr("cy", function (d) {
                return yScale(d.y);
            });

        mapChart.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return 450 - d.y;
            })
            .attr("r", 5)
            .style("fill", function (d) {
                return colors1[d.age_range];
            });
    });

}

// update circles on map to be by gender
function deathsGender() {
    const main = d3.select('#main');
    main.selectAll("circle").remove();
    initPumps(pumps);
    d3.csv("deaths_age_sex.csv", (data) => {
        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
        xScale.domain([0, 15]).range([0, mapWidth]);

        yScale.domain([15, 0]).range([0, mapHeight]);

        var circles = d3.select('#main').select('g').selectAll(".gendercircle").data(data);
        circles.enter().append("circle")
            .attr("r", 3)
            .style("fill", function (d) {
                if (d.gender == 1) return colors2[0]; else return colors2[1]
            })
            .attr("cx", function (d) {
                return xScale(d.x);
            })
            .attr("cy", function (d) {
                return yScale(d.y);
            });
    });
}

// function to draw workhouse using csv file
function whmap()
        {
           const main = d3.select('#main');
    main.selectAll("rect").remove();
    initPumps(pumps);
    d3.csv("workhouse.csv", (data) => {
        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
        xScale.domain([0, 15]).range([0, mapWidth]);

        yScale.domain([15, 0]).range([0, mapHeight]);

        var Rect1 = d3.select('#main').select('g').selectAll(".whouserect").data(data);
         Rect1.enter().append("rect")
            .attr("width", 30)
            .attr("height",20)
            .style("fill",'#8FBC8F')
       
       
        
            .attr("x", function (d) {
                return xScale(d.x);
            })
            .attr("y", function (d) {
                return yScale(d.y);
            });
    });
        }


// function to draw brewery using csv file

function brewmap()
        {
           const main = d3.select('#main');
    main.selectAll("rect").remove();
    initPumps(pumps);
    d3.csv("brewery.csv", (data) => {
        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
        xScale.domain([0, 15]).range([0, mapWidth]);

        yScale.domain([15, 0]).range([0, mapHeight]);

        var Rect1 = d3.select('#main').select('g').selectAll(".brewrect").data(data);
         Rect1.enter().append("rect")
            .attr("width", 30)
            .attr("height",20)
            .style("fill",'#808080')
       
       
        
            .attr("x", function (d) {
                return xScale(d.x);
            })
            .attr("y", function (d) {
                return yScale(d.y);
            });
    });
        }
// tool tips compoenets call functions  

function initComponent() {
    initToolTips();
    initVariables();
}

function getDate(date) {
    var dateObj = new Date(date);
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    return months[month] + '-' + day;
}
initComponent();
