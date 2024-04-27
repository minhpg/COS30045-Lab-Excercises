import "../js/d3.min.js";

/** Graph configs */
const margin = { top: 10, right: 30, bottom: 20, left: 50 };
const width =
  document.getElementById("chart").offsetWidth - margin.left - margin.right;
const height = width - margin.top - margin.bottom;

const init = async () => {
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "grey");

  /** Create caption */
  d3.select("#chart").append("figcaption").text("Figure 1. GeoJSON");

  const projection = d3
    .geoMercator()
    .center([145, -36.5])
    .translate([width / 2, height / 2])
    .scale(3000);
  const path = d3.geoPath().projection(projection);
  const data = await d3.json("/assets/LGA_VIC.json");

  console.log(data);

  svg
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "fill-blue-500");
};

init();
