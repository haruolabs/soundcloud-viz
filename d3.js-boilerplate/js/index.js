var graphic;

graphic = new Object;


graphic.create = function() {


  var g, height, i, size, width, _i, _len, _ref, _results;
  width = $(document).width();
  height = $(document).height();
  size = d3.min([width, height]);
  //graphic.svg = d3.select("#graphic").append("svg").attr("width", size).attr("height", size);
  
  d3.json("./graph.json", function(data) {

    //console.log(data);

    graphic.nodes = []
    graphic.edges = []
    
    var N = data.length;

    ids = [];
    _.each(data, function(user) { 
      if (user.followers_count > 100000) {
        ids.push(user.id)
      } 
    });
    console.log(ids);
    
    
    _.each(data, function(user) {
      //if (user.followers_count > 100000) {
        graphic.nodes.push({'id': user.id, 'name': user.username, 'genres': user.genres, 'followers_count': user.followers_count});
        _.each(user.followings_index, function(fid) {
          //if ($.inArray(fid, ids) != -1) {
            graphic.edges.push({'source': user.index, 'target': fid});
          //}        
        });
      //}
    });

    //graphic.nodes = [ {'name': "a", 'followers_count': 20000, 'genre': 2}, {'name': 'b', 'followers_count': 50000, 'genre': 1},
    //  {'name': 'c', 'followers_count': 500000, 'genre': 3} ];
    //graphic.edges = [ {'source': 0, 'target': 1, 'weight': 0.1}, {'source': 1, 'target': 2, 'weight': 0.2}, {'source': 0, 'target': 2, 'weight': 0.3} ];

    graphic.nodes.forEach(function(d, i) {
      //d.x = width/N*i;
      //d.y = height/N*i;
      //d.x = width/2;
      //d.y = height/2;
    });

    graphic.svg = d3.select("#graphic").append("svg")
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'main-canvas');

    var k = Math.sqrt(graphic.nodes.length / (width*height));

    var force = d3.layout.force()
      .nodes(graphic.nodes)
      .links(graphic.edges)
      .charge(-10/k)
      .gravity(100*k)
      //.linkDistance(5)
      .linkDistance(function(d) { return d.target.followers_count/500}) //default: 20
      .size([width, height])
      .start();

    var color = d3.scale.category20();

    var link = graphic.svg.selectAll(".link")
        .data(graphic.edges)
      .enter().append("line")
        .attr("class", "link");
        //.style("stroke-width", function(d) { return 1; });

    var gnodes = graphic.svg.selectAll('g.gnode')
        .data(graphic.nodes)
        .enter()
        .append('g')
        .classed('gnode', true);

    var node = gnodes.append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return Math.sqrt(d.followers_count/10000); })
        .style("fill", function(d) { return color(d.id%20); })
        .style("opacity", 0.9);
        //.call(force.drag);

    var labels = gnodes.append("text")
       .text(function(d) { return d.followers_count > 50000 ? d.name : ''; })
       //.style("fill", "#555")
       .style("font-family", "Arial").style("font-size", 6);
       //.style("text-anchor", "middle");

    var png_index = 1;

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
/*
      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });*/
      gnodes.attr("transform", function(d) {
          return 'translate(' + [d.x, d.y] + ')';
      })

      console.log(force.alpha());
      //if (force.alpha() < 0.005) {
       // force.stop();
        //alert("force stopped");
      //}
    });

/*
    var width = 960,
        height = 500;

    var fill = d3.scale.category20();

    graphic.svg = d3.select("#graphic").append("svg")
        .attr('width', size)
        .attr('height', size);
*/
  });

};

graphic.update = function() {};

graphic.destroy = function() {
  graphic.svg.remove();
  return delete graphic.svg;
};

$(document).ready(function() {
  graphic.create();
  /*return $(window).resize(function() {
    graphic.destroy();
    return graphic.create();
  });*/
});
