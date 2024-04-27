import "../js/d3.min.js";

/** Graph configs */
const width = document.getElementById("chart").offsetWidth;
const height = 700;
const paddingX = 50;
const paddingY = 50;
const ticksX = 10;
const ticksY = 7;

const init = async () => {
  /** Load data */
  const data = await d3.csv("Unemployment_78-95.csv", (d) => {
    return {
      date: new Date(+d.year, +d.month - 1),
      number: +d.number,
    };
  });
  drawLineChart(data);
};

const drawLineChart = (dataset) => {
  /** Initialize x/y scales */
  const xScale = d3
    .scaleTime()
    .domain([d3.min(dataset, (d) => d.date), d3.max(dataset, (d) => d.date)])
    .range([paddingX, width - paddingX]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.number)])
    .range([height - paddingY, 0]);

  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.number));

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
    .text("Figure 1. Number of Unemployed in Australia between 1978-1995");

  /** Draw axis */
  const xAxis = d3.axisBottom().ticks(ticksX).scale(xScale);
  const yAxis = d3.axisBottom().ticks(ticksY).scale(yScale);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - paddingY})`)
    .attr("class", "font-light text-xs text-gray-500")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `rotate(90) translate(0, ${-paddingX - 1})`) // -1px adjust for line width
    .attr("class", "font-light text-xs text-gray-500")
    .call(yAxis);

  svg
    .append("path")
    .datum(dataset)
    .attr("stroke", "#1A56DB")
    .attr("stroke-width", "2.5px")
    .attr("fill", "none")
    .attr("d", line);

  //make defs and add the linear gradient
  var lg = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "blue-gradient") //id of the gradient
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "100%%")
    .attr("y2", "100%"); //since its a vertical linear gradient
  lg.append("stop")
    .attr("offset", "0%")
    .style("stop-color", "#1C64F2") //end in red
    .style("stop-opacity", 0.6);

  lg.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "#1C64F2") //end in red
    .style("stop-opacity", 0);

  const area = d3
    .area()
    .x((d) => xScale(d.date))
    .y0(yScale.range()[0])
    .y1((d) => yScale(d.number));

  svg
    .append("path")
    .datum(dataset)
    .style("fill", "url(#blue-gradient)") //id of the gradient for fill
    .attr("shape-rendering", "geometricPrecision")
    .attr("d", area);

  svg
    .append("line")
    .attr("class", "fill-none stroke-1 stroke-red-500")
    .attr("stroke-dasharray", "10")
    .attr("x1", paddingX)
    .attr("y1", yScale(500000))
    .attr("x2", width - paddingX)
    .attr("y2", yScale(500000));
  svg
    .append("text")
    .attr("class", "text-xs font-thin stroke-red-500")
    .attr("x", paddingX + 10)
    .attr("y", yScale(500000) - 7)
    .text("Half a million unemployed");
};

init();
