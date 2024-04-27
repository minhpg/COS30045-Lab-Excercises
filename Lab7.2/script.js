import "../js/d3.min.js";

/** Graph configs */
const width = document.getElementById("chart").offsetWidth;
const height = width;
const paddingX = 50;
const paddingY = 50;

const maxLengthDataset = 6;
const maxValueDataset = 10;

const init = async () => {
  const data = Array(maxLengthDataset)
    .fill(0)
    .map((_, i) => {
      const val = Math.floor(Math.random() * maxValueDataset) + 1;
      return {
        value: val,
        label: val,
      };
    });

  drawPieChart(data);
};

const drawPieChart = (data) => {
  const outerRadius = width / 2;
  const innerRadius = width / 4;

  /** Create SVG DOM object */
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

  /** Create caption */
  d3.select("#chart")
    .append("figcaption")
    .text("Figure 1. Donut chart of random data");

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const pie = d3.pie().value((d) => d.value);

  /** Interpolate color scale */
  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateOranges)
    .domain([0, data.length]);

  const arcs = svg
    .selectAll("g.arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", `translate(${outerRadius}, ${outerRadius})`);

  /** Append sectors */
  arcs
    .append("path")
    .attr("d", arc)
    .style("fill", (_, i) => colorScale(i))
    .style("stroke", "#ffffff")
    .style("stroke-width", 0);

  /** Append text labels */
  arcs
    .append("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text((d) => d.data.label)
    .attr("transform", (d) => {
      const [x, y] = arc.centroid(d);
      return `translate(${x}, ${y})`;
    })
    .attr("class", "text-lg font-bold text-gray-500");
};

init();
