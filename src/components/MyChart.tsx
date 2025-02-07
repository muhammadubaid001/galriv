import ReactApexChart from "react-apexcharts"

export const MyChart = () => {
    const options: any = {
        chart: {
          id: "chart2",
          type: "area",
          height: 20,
          foreColor: "#ffffff",
          toolbar: {
            autoSelected: "pan",
            show: false
          }
        },
        colors: ["#1967FF", '#A8B2D3'],
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        
        grid: {
          borderColor: "#555",
          clipMarkers: false,
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        fill: {
          colors: "#ffffff",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        markers: {
          size: 5,
          colors: ["#1967FF"],
          strokeColor: "#ffffff",
          strokeWidth: 2
        },
        series: [
          {
            data: [91, 70, 28, 61, 88, 109, 100],
             color: "#1967FF"
          }, {
            data: [31, 32, 45, 32, 140, 52, 41],
          color: "#A8B2D3"
          }
        ],
        tooltip: {
          theme: "dark"
        },
        xaxis: {
          type: "string",
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yaxis: {
          min: 0,
          tickAmount: 4
        }
      };
    return (
        <ReactApexChart  options={options} series={options.series} type="area" height={350} />

    )
}