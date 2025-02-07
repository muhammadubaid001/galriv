import ReactApexChart from "react-apexcharts";

export const MyPieChart = () => {
  const options = {
    series: [44, 55, 13, 43, 22],
    chart: {
      toolbar: {
        autoSelected: "pan",
        show: false
      }
    },
    legend: {
        show: false
      },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
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
