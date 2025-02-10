import ReactApexChart from "react-apexcharts";

export const MyPieChart = () => {

  const options = {
    series: [70, 20, 10],
    chart: {
      toolbar: {
        autoSelected: "pan",
        show: false
      }
    },
    legend: {
        show: false
      },
    labels: ["Day Trading Margin", "Futures swing margin", "Futures Hedging Account"],
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
