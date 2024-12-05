import React from "react";
import Plot from "react-plotly.js";

const AgeSexPyramid = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No demographic data available</p>;
  }

  // Parse the data into a suitable format for the pyramid
  const maleData = data
    .filter(item => item.SEXE === 1)
    .map(item => ({ age: item.AGED100, value: -item.NB }));
  const femaleData = data
    .filter(item => item.SEXE === 2)
    .map(item => ({ age: item.AGED100, value: item.NB }));

  const ages = [...new Set([...maleData, ...femaleData].map(d => d.age))].sort(
    (a, b) => a - b
  );
  const maleValues = ages.map(age => maleData.find(d => d.age === age)?.value || 0);
  const femaleValues = ages.map(age => femaleData.find(d => d.age === age)?.value || 0);

  return (
    <Plot
      data={[
        {
          x: maleValues,
          y: ages,
          name: "Male",
          type: "bar",
          orientation: "h",
          marker: { color: "blue" },
        },
        {
          x: femaleValues,
          y: ages,
          name: "Female",
          type: "bar",
          orientation: "h",
          marker: { color: "pink" },
        },
      ]}
      layout={{
        title: "Age/Sex Pyramid",
        barmode: "relative",
        xaxis: { title: "Population", tickformat: "," },
        yaxis: { title: "Age" },
        height: 400,
      }}
    />
  );
};

export default AgeSexPyramid;
