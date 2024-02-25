const init = async () => {
  const width = 500;
  const height = 500;
  const padding = 5;
  const defaultFill = "slategrey";

  const drawBarChart = ({
    dataset,
    labelKey,
    columnKey,
    description,
    selector,
    fill,
  }) => {
    let svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    let labelPadding = 0;
    if (labelKey) {
      labelPadding = 30;
    }

    const heightStep =
      (height - labelPadding) /
      Math.max.apply(
        null,
        dataset.map((col) => col[columnKey])
      );

    let data = svg.selectAll("rect").data(dataset).enter();

    data
      .append("rect")
      .attr("x", (_, index) => index * (width / dataset.length))
      .attr("y", (data) => height - labelPadding - data[columnKey] * heightStep)
      .attr("width", width / dataset.length - padding)
      .attr("height", (data) => data[columnKey] * heightStep)
      .attr("fill", fill || defaultFill);

    if (labelKey) {
      data
        .append("text")
        .text((data) => data[labelKey])
        .attr("x", (_, index) => index * (width / dataset.length))
        .attr("y", height - 10)
        .attr("class", "text-sm font-thin");
    }

    d3.select(selector).append("figcaption").text(description);
  };

  await d3.csv("data.csv").then((data) =>
    drawBarChart({
      dataset: data,
      columnKey: "wombats",
      description: "Figure 1. Wombats bar chart data binding with SVG",
      selector: "#bar-chart-wombats",
    })
  );

  await d3.csv("pet_ownership.csv").then((data) => {
    drawBarChart({
      dataset: data,
      columnKey: "pets2019",
      description: "Figure 2. Pets ownership in 2019",
      selector: "#bar-chart-pets-2019",
      labelKey: "animal",
      fill: "rgb(132 204 22)",
    });
    drawBarChart({
      dataset: data,
      columnKey: "pets2021",
      description: "Figure 3. Pets ownership in 2021",
      selector: "#bar-chart-pets-2021",
      labelKey: "animal",
      fill: "rgb(249 115 22)",
    });
  });
};

window.onload = init;
