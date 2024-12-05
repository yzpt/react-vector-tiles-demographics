import React, { useState } from "react";
import Plot from "react-plotly.js";

const Pyramid = ({ data }) => {
  const [maxScale, setMaxScale] = useState(1000); // Default max population scale

  if (!data || data.length === 0) {
    return <p>No demographic data available</p>;
  }

  // Parse the data into a suitable format for the pyramid
  const maleData = data.map((item) => ({
    age: item.AGE_GROUP,
    value: -item.MALE,
  }));

  const femaleData = data.map((item) => ({
    age: item.AGE_GROUP,
    value: item.FEMALE,
  }));

  const ages = data.map((item) => item.AGE_GROUP);

  const maleValues = maleData.map((item) => item.value);
  const femaleValues = femaleData.map((item) => item.value);

  // Calculate the max value from male and female data
  const maxValue = Math.max(...maleValues, ...femaleValues);

  // If the maxValue exceeds the current maxScale, temporarily adjust the scale
  const adjustedMaxScale = maxValue > maxScale ? maxValue : maxScale;

  const handleSliderChange = (e) => {
    setMaxScale(e.target.value);
  };

  return (
    <div>
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
          barmode: "relative",
          xaxis: {
            // title: "Population",
            tickformat: ",",
            range: [-adjustedMaxScale, adjustedMaxScale],
          },
          yaxis: { title: "Age" },
          height: 400,
        }}
      />
      {/* <div>
        <label>
          Max Scale: {maxScale}
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={maxScale}
            onChange={handleSliderChange}
            style={{ width: "100%" }}
          />
        </label>
      </div> */}
    </div>
  );
};

export default Pyramid;
