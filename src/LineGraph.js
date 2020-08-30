import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import "./linegraph.css";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartdata = (data, casesType) => {
  const chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType }) {
  const [data, setData] = useState({});
  const [bg, setBg] = useState("rgba(204, 16, 52, 0.5)");
  const [borderColor, setBorder] = useState("#CC1034");

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          const chartData = buildChartdata(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
    let bg =
      casesType === "recovered"
        ? "	rgba(0, 255, 0, 0.5)"
        : "rgba(204, 16, 52, 0.5)";
    let border = bg === "rgba(204, 16, 52, 0.5)" ? "#CC1034" : "#228B22";
    setBg(bg);
    setBorder(border);
  }, [casesType]);

  return (
    <div>
      {" "}
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: bg,
                borderColor: borderColor,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;