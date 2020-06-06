var width = 300;          //Width of each plot
var height = 300;         //Height of each plot
var buffer = 50;          //Buffer space to ensure points are adequately
                          // far from the edge of the plot

var numSamples = 10;      //Number of points to use
var radius = buffer;      //epsilon ball radius

//background grid information
var cellSize = 50;
var gridWidth = Math.ceil(width / cellSize);
var gridHeight = Math.ceil(height / cellSize);
var grid = new Array(gridWidth * gridHeight);

//The sample point set used by all of the examples
var points = new Array(2*numSamples);

//Randomly sample the input points
// for (var i = 0; i < numSamples; i++)
// {
//   points[2*i] = Math.random() * (width-2*buffer) + buffer;
//   points[2*i+1] = Math.random() * (height-2*buffer) + buffer;
// }

//Fixed points ensure a good test case
points[0] = 96; points[1] = 172;
points[2] = 170; points[3] = 250;
points[4] = 174; points[5] = 166;
points[6] = 188; points[7] = 215;
points[8] = 245; points[9] = 180;
points[10] = 219; points[11] = 119;
points[12] = 160; points[13] = 65;
points[14] = 166; points[15] = 53;
points[16] = 117; points[17] = 66;
points[18] = 90; points[19] = 249;

function minimumEnclosingBallRadius(x1,y1,x2,y2,x3,y3)
{
  var a = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
  var b = Math.sqrt((x1-x3)*(x1-x3)+(y1-y3)*(y1-y3));
  var c = Math.sqrt((x2-x3)*(x2-x3)+(y2-y3)*(y2-y3));

  var testRadius = Math.max(a,b,c)/2.;
  //Guaranteed to be set below in the if-conditional
  var xc;
  var yc;
  var dist;

  if (a >= b && a >= c)
  {
    xc = (x1+x2)/2.
    yc = (y1+y2)/2.
    dist = Math.sqrt((x3-xc)*(x3-xc)+(y3-yc)*(y3-yc));
  }
  else if (b >= a && b >= c)
  {
    xc = (x1+x3)/2.
    yc = (y1+y3)/2.
    dist = Math.sqrt((x2-xc)*(x2-xc)+(y2-yc)*(y2-yc));
  }
  else
  {
    xc = (x2+x3)/2.;
    yc = (y2+y3)/2.;
    dist = Math.sqrt((x1-xc)*(x1-xc)+(y1-yc)*(y1-yc));
  }

  //Test if the circumcircle around the largest edge
  // contains the third point, if not, then compute the
  // radius of the triangle's circumcircle
  if (testRadius < dist)
  {
    testRadius = (a*b*c)/Math.sqrt((a+b+c)*(b+c-a)*(a+c-b)*(a+b-c));
  }
  return testRadius;
}

function resetAll()
{
  d3.selectAll(".point")
    .transition()
      .style("fill", "#000");
  d3.selectAll(".edge")
    .transition()
      .style("stroke", "#000");
  d3.selectAll(".face")
    .transition()
      .style("fill", "#000");
  d3.selectAll(".circle")
    .transition()
      .style("fill", "#fff")
      .style("fill-opacity", "0")
      .style("stroke", "#000")
      .style("stroke-opacity", ".15");
}

function mapMouseOut(d)
{
  document.getElementById("cechDemo").innerHTML = "Number";
  resetAll();
}
</script>
<style>
.grid
{
  stroke: #000;
  stroke-opacity: .15;
  shape-rendering: crispEdges;
}

.circle
{
  fill: #f00;
  fill-opacity: 0;
  stroke: #000;
  stroke-opacity: 0.15;
}

.point
{
  fill: #000;
  stroke-width: 0px;
}

.edge
{
  fill: #000;
  stroke: #000;
  stroke-width: 4px;
  stroke-opacity: 1;
}

.face
{
  fill: #000;
  stroke-width: 0px;
  fill-opacity: .25;
}