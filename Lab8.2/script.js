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
    .attr("fill", "gray");

  /** Create caption */
  d3.select("#chart")
    .append("figcaption")
    .text("Figure 1. Victorian Number of Unemployed by LGA");

  const projection = d3
    .geoMercator()
    .center([145, -36.5])
    .translate([width / 2, height / 2])
    .scale(4000);

  const path = d3.geoPath().projection(projection);
  const { features, ...fields } = await d3.json("../assets/LGA_VIC.json");
  const vicLGAUnemploymentData = await d3.csv(
    "../assets/VIC_LGA_unemployment.csv"
  );

  const vicStateData = await d3.csv("../assets/VIC_city.csv");

  const mergedData = features.map(
    ({ properties: { LGA_name, ...propertyFields }, ...fields }) => {
      const unemployment = vicLGAUnemploymentData.find(
        (d) => d.LGA === LGA_name
      );
      return {
        ...fields,
        properties: {
          ...propertyFields,
          LGA_name,
          value: unemployment ? parseFloat(unemployment.unemployed) : null,
        },
      };
    }
  );

  const color = d3
    .scaleQuantize()
    .range(d3.schemeBlues[9])
    .domain([
      0,
      d3.max(vicLGAUnemploymentData, (d) => parseFloat(d.unemployed)),
    ]);

  const tooltip = d3.select("#tooltip").style("visibility", "hidden");

  svg
    .selectAll("path")
    .data(mergedData)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", (d) =>
      d.properties.value ? color(d.properties.value) : "gray"
    )
    .on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible");
      tooltip.select("#tooltip-title").text(d.properties.LGA_name);
      tooltip
        .select("#tooltip-content")
        .text("Unemployment: " + d.properties.value);
    })
    .on("mouseleave", (event) => {
      const el = d3.select(event.target);
      el.attr("fill", "black");
      tooltip.style("visibility", "hidden");
    })
    .on("mousemove", (event) => {
      tooltip
        .style("top", (event.clientY - 10).toString() + "px")
        .style("left", (event.clientX + 10).toString() + "px");
    });

  /** Add cities spots */
  svg
    .selectAll("circle")
    .data(vicStateData)
    .enter()
    .append("circle")
    .attr("cx", (d) => projection([d.lon, d.lat])[0])
    .attr("cy", (d) => projection([d.lon, d.lat])[1])
    .attr("r", 2)
    .attr("fill", "red");
  svg
    .selectAll("text")
    .data(vicStateData)
    .enter()
    .append("text")
    .attr("x", (d) => projection([d.lon, d.lat])[0] + 2)
    .attr("y", (d) => projection([d.lon, d.lat])[1] - 2)
    .text((d) => d.place)
    .attr("class", "text-[10px] fill-gray-700 font-light");
};

init();
