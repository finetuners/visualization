
$(function() {
  $("#comparaison").text("different");

  /***************************
    GRAPH container
  ****************************/

  var margin = {top: 20, right: 0, bottom: 70, left: 40},
      width = 800 - margin.left - margin.right,  // width
      height = 300 - margin.top - margin.bottom; // height

  /***************************
    SCALE
  ****************************/

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([10, width-50], .3); // (interval[, padding])  // interval: distance from point 0 // padding distance of categories from each other

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  /***************************
    COLORS
  ****************************/

  var color = d3.scale.ordinal()
      .range(["#81BE40", "#3B8032"]);


  /***************************
    AXIS
  ****************************/

  var xAxis = d3.svg.axis() // set scale + orient
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis() // set scale + orient
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s")); // scale number format

  /***************************
    SVG
  ****************************/

  var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Background Color

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#EBE9E7");


  /***************************
    CSV
  ****************************/

   
  function drawGraph(data, update) {
    var genderNames = d3.keys(data[0]).filter(function(key) { return key !== "Category"; }); // get list of column variables : age ranges

    data.forEach(function(d) {
      d.genders = genderNames.map(function(name) { return {name: name, value: +d[name]}; }); // get the name of each category filter and its value
    });


    x0.domain(data.map(function(d) { return d.Category; })); // state names in X axis
    x1.domain(genderNames).rangeRoundBands([0, x0.rangeBand()]); // set separation settings between x values
    y.domain([0, d3.max(data, function(d) { return d3.max(d.genders, function(d) { return d.value; }); })]); // ages in y axis

    /* X axis */
svg.select(".x.axis").remove();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
          .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(45)") //rotation x-categories
            .style("text-anchor", "start");

    /* Y axis */
    svg.select(".y.axis").remove();
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

      // Y axis title
      .append("text") 
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("font-family", "consolas")
        .attr("fill", "#5A4F4A")
        .style("text-anchor", "end")
        .text("Percentage of Calls");

    /* data */

    var category = svg.selectAll(".category")
        .data(data);

      category
      .enter().append("g")
        .attr("class", "category")
        .attr("transform", function(d) { return "translate(" + x0(d.Category) + ",0)"; });

      
    /* Initialize tooltip */
    tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) { return d.name +" "+ d.value +" "+ "%"; });


    /* Invoke the tip in the context of your visualization */
    category.call(tip);

    /* rectangles */  
    var rects = category.selectAll("rect")
        .data(function(d) { return d.genders; });


     // svg.selectAll("rect").remove();
      rects.enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); })
        /* Show and hide tip on mouse events */
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide); 
        rects.exit().remove();
      rects
      .transition()
      .duration(750)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });

  }


  d3.csv("csv/data.csv", function(error, data) {
    drawGraph(data, false);
  });

  var state = "change";
  d3.select("#similar").on("click", function() {
    if (state == "change") {
      d3.csv("csv/data-column.csv", function(error, data) {
        drawGraph(data, true);
        $("#comparaison").text("similar");
        $(".graph-description p").text('Distribution of call categories per gender in percentages');
      });
      state = "changed"
    } else {
      d3.csv("csv/data.csv", function(error, data) {
        drawGraph(data, true);
         $("#comparaison").text("different");
         $(".graph-description p").text('Distribution of genders per each call category in percentages');
      });
      state = "change";
    }

  });

  var next_move = "expand";
        $(document).ready(function (){
          $("#similar").click(function() {
              var css = {};
            if (next_move == "expand"){
                css = {
                    width: '50px',
                };
                next_move = "shrink";
              } else {
                css = {
                    width: '660px',
                };     
                next_move = "expand";
              }
              $(".figures-container").animate(css, 600);
          });
        });


  //$( "#different" ).toggle(function() {
    //$( ".dark" ).animate({ "margin-left": "+=500px" }, "slow" );
    //$( ".light" ).animate({ "margin-left": "-=500px" }, "slow" );
  //});
 
  //$( "#similar" ).click(function(){
    //$( ".dark" ).animate({ "left": "-=500px" }, "slow" );
    //$( ".light" ).animate({ "left": "+=500px" }, "slow" );
  //});

});


  


