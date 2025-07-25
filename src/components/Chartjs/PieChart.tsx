import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const PieChart = ({ data }: { data: any }) => {
  const options = {
    scales: {},
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
