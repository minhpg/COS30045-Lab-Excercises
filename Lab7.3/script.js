import "../js/d3.min.js";

/** Graph configs */
const margin = { top: 10, right: 30, bottom: 20, left: 50 };
const width =
  document.getElementById("chart").offsetWidth - margin.left - margin.right;
const height = width - margin.top - margin.bottom;

const init = async () => {
  const dataset = [
    { apples: 5, oranges: 10, grapes: 22 },

    { apples: 4, oranges: 12, grapes: 28 },

    { apples: 2, oranges: 19, grapes: 32 },

    { apples: 7, oranges: 23, grapes: 35 },

    { apples: 23, oranges: 17, grapes: 43 },
  ];
  drawStackedBarChart(dataset);
};

const drawStackedBarChart = (data) => {
  /** Create SVG DOM object */
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /** Create caption */
  d3.select("#chart").append("figcaption").text("Figure 1. Stacked bar chart");

  const keys = Object.keys(data[0]);
  const series = d3.stack().keys(keys)(data);

  console.log(series, keys);

  /** Interpolate color scale */
  const colorScale = d3
    .scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSpectral[series.length]);

  /** Initialize x/y scales */
  let xScale = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([0, width])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.apples + d.oranges + d.grapes)])
    .range([height, 0]);

  /** Draw axis */
  const xAxis = d3.axisBottom().ticks(null).scale(xScale);
  const yAxis = d3.axisBottom().ticks(null, "s").scale(yScale);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "font-light text-xs text-gray-500")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `rotate(90) translate(0, -1)`) // -1px adjust for line width
    .attr("class", "font-light text-xs text-gray-500")
    .call(yAxis);

  const groups = svg
    .append("g")
    .selectAll("g")
    .data(series)
    .enter()
    .append("g")
    .style("fill", (d, i) => {
      return colorScale(d.key);
    });

  const rects = groups
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", function (_, i) {
      return xScale(i);
    })
    .attr("y", function (d) {
      return yScale(d[1]);
    })
    .attr("height", function (d) {
      return yScale(d[0]) - yScale(d[1]);
    })
    .attr("width", xScale.bandwidth());
};

init();
