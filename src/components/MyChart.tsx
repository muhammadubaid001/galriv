import { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export const MyChart = ({ loading, data }) => {
  const [chartData, setChartData] = useState<any>([]);

  // Process data to group by month
  const processData = useCallback(() => {
    const monthlyData = data.reduce((acc, trade) => {
      const date = new Date(trade.date);
      const monthYear = date.toLocaleString("default", { month: "short" });

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          totalPL: 0,
          trades: 0,
        };
      }

      acc[monthYear].totalPL += Number(trade.pl);
      acc[monthYear].trades += 1;

      return acc;
    }, {});

    setChartData(Object.values(monthlyData));
  }, [data]);

  useEffect(() => {
    processData();
  }, [processData]);

  if (loading) return <p>Loading...</p>;

  return (
    <ReactApexChart
      options={{
        chart: {
          id: "chart2",
          type: "area",
          height: 20,
          foreColor: "#ffffff",
          toolbar: {
            autoSelected: "pan",
            show: false,
          },
        },
        colors: ["#1967FF", "#A8B2D3"],
        stroke: {
          width: 3,
          curve: "smooth",
        },

        grid: {
          borderColor: "#555",
          clipMarkers: false,
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        fill: {
          colors: "#ffffff",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        markers: {
          size: 5,
          colors: ["#1967FF"],
          strokeColor: "#ffffff",
          strokeWidth: 2,
        },
        tooltip: {
          theme: "dark",
        },
        xaxis: {
          type: "string",
          categories: chartData.map((item) => item.month),
        },
        yaxis: {
          min: 0,
          tickAmount: 4,
        },
      }}
      series={[
        {
          data: chartData.map((item) => item.totalPL),
          color: "#1967FF",
          name: "Performance",
        },
      ]}
      type="area"
      height={350}
    />
  )
}
