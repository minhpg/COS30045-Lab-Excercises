import "../js/d3.min.js";

/** Graph configs */
const width = document.getElementById("bar-chart").offsetWidth;
const height = 500;
const margin = 0;
const maxValue = 25;
const maxLength = 25;
const padding = (width / maxLength) * 0.05;
const ticks = 5;

/** Default transition settings */
let transitionDuration = 3000;
let transitionEase = "easeElastic";

/** Add dataset settings */
let addDataMax = 5;

/** Generate random dataset*/
const generateDataset = (generateMaxLength = maxLength) => {
  /** Create array with length */
  return (
    Array(generateMaxLength)
      /** Temporary fill with 0s */
      .fill(0)
      /** Map to random function */
      .map(
        () => Math.ceil(Math.random() * maxValue) // Math.random*value => creates value between 0-maxValue
      )
  );
};

/** Declare D3 ease values */
const d3Eases = [
  {
    name: "easeLinear",
    d3Ease: d3.easeLinear,
  },
  {
    name: "easeQuad",
    d3Ease: d3.easeQuad,
  },
  {
    name: "easeCubic",
    d3Ease: d3.easeCubic,
  },
  {
    name: "easePoly",
    d3Ease: d3.easePoly,
  },
  {
    name: "easeSin",
    d3Ease: d3.easeSin,
  },
  {
    name: "easeExp",
    d3Ease: d3.easeExp,
  },
  {
    name: "easeCircle",
    d3Ease: d3.easeCircle,
  },
  {
    name: "easeBounce",
    d3Ease: d3.easeBounce,
  },
  {
    name: "easeBack",
    d3Ease: d3.easeBack,
  },
  {
    name: "easeElastic",
    d3Ease: d3.easeElastic,
  },
];

/** Initialize dataset */
let currentDataset = generateDataset();

/** Calculate width & height with margin */

const innerWidth = width - margin * 2;
const innerHeight = height - margin * 2;

/** Initialize x/y scales */
let xScale = d3
  .scaleBand()
  .domain(d3.range(currentDataset.length))
  .range([0, innerWidth]);

let yScale = d3
  .scaleLinear()
  .domain([0, d3.max(currentDataset)])
  .range([0, innerHeight]);

/** Create SVG DOM object */
const svg = d3
  .select("#bar-chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

/** Create caption */
d3.select("#bar-chart")
  .append("figcaption")
  .text("Figure 1. Test bar chart data binding with SVG");

/** Create ease select options from ease array */
d3.select("#select-transition-animation")
  .selectAll("option")
  .data(d3Eases)
  .enter()
  .append("option")
  .attr("value", (d) => d.name)
  .attr("selected", (d) => d.name === transitionEase)
  .text((d) => d.name);

/** Assign default input values */
d3.select("#input-transition-duration").attr("value", transitionDuration);
d3.select("#input-num-add").attr("value", addDataMax);

/** Create Tooltip */
const tooltip = d3
  .select("#tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

/** Build transition function */
const buildTransition = () => {
  return d3
    .transition()
    .delay((_, index) => (index / currentDataset.length) * transitionDuration) // Staggered delay
    .duration(transitionDuration)
    .ease(
      d3Eases.find(
        (d) => d.name === transitionEase // Find ease by name
      ).d3Ease
    );
};

/** Draw graph function
 *
 *  Why?
 *  I want to reuse this function instead of having to manage graph behaviours in multiple places
 *
 */
const drawGraph = () => {
  /** Reinitialize x scale */
  xScale = d3
    .scaleBand()
    .domain(d3.range(currentDataset.length))
    .range([0, innerWidth]);
  /** Draw bars */
  const bars = svg.selectAll("rect").data(currentDataset);

  /** Exit bars */
  bars.exit().transition(buildTransition()).attr("x", innerWidth).remove();

  /** Transition existing bars */
  bars
    .transition(buildTransition())
    .attr("x", (_, index) => index * xScale.bandwidth() + padding)
    .attr("y", (data) => innerHeight - yScale(data))
    .attr("width", xScale.bandwidth() - padding)
    .attr("height", (data) => yScale(data));

  /** Bring in new bars */
  bars
    .enter()
    .append("rect")
    .attr("x", innerWidth)
    .attr("y", (data) => innerHeight - yScale(data))
    .attr("height", (data) => yScale(data))
    .merge(bars)
    .on("mouseover", (event, d) => {
      /**
       * Select rect element. Seems that the Canvas tutorial is outdated, using `this`.
       * Use `event.target` instead
       */
      const el = d3.select(event.target);
      el.attr("fill", "rgb(59, 130, 246)");
      tooltip.style("visibility", "visible");
      tooltip
        .style("top", event.pageY + "px")
        .style("left", event.pageX + "px");
      tooltip.select("#tooltip-content").text("Value: " + d);
    })
    .on("mouseleave", (event) => {
      const el = d3.select(event.target);
      el.attr("fill", "black");
      tooltip.style("visibility", "hidden");
    })
    .on("mousemove", (event) => {
      tooltip
        .style("top", event.pageY + "px")
        .style("left", event.pageX + "px");
    })
    .transition(buildTransition())
    .attr("x", (_, index) => index * xScale.bandwidth() + padding)
    .attr("y", (data) => innerHeight - yScale(data))
    .attr("width", xScale.bandwidth() - padding)
    .attr("height", (data) => yScale(data));
};

drawGraph();

/** Add new data to graph */
const mergeGraph = ({ dataset }) => {
  /** Merge dataset with spread */
  currentDataset = [...currentDataset, ...dataset];
  drawGraph();
};

/** Pop bar to right */
const popGraph = () => {
  currentDataset.pop();
  drawGraph();
};

/** Shift bar to left
 *  WIP: make so that update graph runs after bar shift left transition
 */
const shiftGraph = () => {
  currentDataset.shift();
  drawGraph();
};

/** Renew graph */
const renewGraph = () => {
  if (currentDataset.length == maxLength) return;
  /** Generate new dataset */
  currentDataset = generateDataset(maxLength);
  drawGraph();
};

/** Update data button event listener */
d3.select("#btn-update-graph").on("click", () => {
  /** Generate new dataset */
  currentDataset = generateDataset(currentDataset.length);
  drawGraph();
});

/** Transition ease select event listeners */
d3.select("#select-transition-animation").on("change", (event) => {
  /** Assign new ease */
  transitionEase = event.target.value;
});

/** Transition duration input event listeners */
d3.select("#input-transition-duration").on("input", (event) => {
  /** Assign new duration */
  transitionDuration = event.target.value;
});

/** Max data add input event listeners */
d3.select("#input-num-add").on("input", (event) => {
  /** Assign new duration */
  addDataMax = parseInt(event.target.value);
});

/** Update data button event listener */
d3.select("#btn-add-data").on("click", () => {
  /** Generate new dataset */
  const dataset = generateDataset(addDataMax);
  mergeGraph({ dataset });
});

/** Shift data button event listener */
d3.select("#btn-update-shift").on("click", shiftGraph);

/** Pop data button event listener */
d3.select("#btn-update-pop").on("click", popGraph);

/** Renew data button event listener */
d3.select("#btn-renew-graph").on("click", renewGraph);
