import ReactApexChart from "react-apexcharts";

export const MyPieChart = ({ data }) => {
  const options = {
    series: [data.pnlPercentage, data.pnl, data.totalValue],
    chart: {
      toolbar: {
        autoSelected: "pan",
        show: false
      }
    },
    legend: {
        show: false
      },
    labels: ["P&L", "Total Value", ""],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            show:false
          },
        },
      },
    ],
  }

  return (
    <ReactApexChart series={options.series} options={options} type="pie" height={350} />
  )
}
