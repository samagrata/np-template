import { Component, Input } from '@angular/core';
import {
	ApexAxisChartSeries,
	ApexChart,
	ApexDataLabels,
	ApexPlotOptions,
	ApexYAxis,
	ApexAnnotations,
	ApexFill,
	ApexStroke,
	ApexGrid,
	NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	plotOptions: ApexPlotOptions;
	yaxis: ApexYAxis;
	xaxis: any; //ApexXAxis;
	annotations: ApexAnnotations;
	fill: ApexFill;
	stroke: ApexStroke;
	grid: ApexGrid;
};

@Component({
  selector: 'bar-chart',
  imports: [NgApexchartsModule],
  templateUrl: './bar-chart.html'
})

export class BarChart {
  @Input() chart!: ApexChart;
  @Input() annotations!: ApexAnnotations;
  @Input() colors!: string[];
  @Input() dataLabels!: ApexDataLabels;
  @Input() series!: ApexAxisChartSeries | ApexNonAxisChartSeries;
  @Input() stroke!: ApexStroke;
  @Input() labels!: string[];
  @Input() legend!: ApexLegend;
  @Input() fill!: ApexFill;
  @Input() tooltip!: ApexTooltip;
  @Input() plotOptions!: ApexPlotOptions;
  @Input() responsive!: ApexResponsive[];
  @Input() xaxis!: ApexXAxis;
  @Input() yaxis!: ApexYAxis | ApexYAxis[];
  @Input() grid!: ApexGrid;
  @Input() states!: ApexStates;
  @Input() title!: ApexTitleSubtitle;
  @Input() subtitle!: ApexTitleSubtitle;
  @Input() theme!: ApexTheme;
  @Input() markers!: ApexMarkers;

  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Servings",
          data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65, 35]
        }
      ],
      annotations: {
        points: [
          // {
          //   x: "Bananas",
          //   seriesIndex: 0,
          //   label: {
          //     borderColor: "#775DD0",
          //     offsetY: 0,
          //     style: {
          //       color: "#fff",
          //       background: "#775DD0"
          //     },
          //     text: "Bananas are good"
          //   }
          // }
        ]
      },
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2
      },

      grid: {
        row: {
          colors: ["#fff", "#f2f2f2"]
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: [
          "Apples",
          "Oranges",
          "Strawberries",
          "Pineapples",
          "Mangoes",
          "Bananas",
          "Blackberries",
          "Pears",
          "Watermelons",
          "Cherries",
          "Pomegranates",
          "Tangerines",
          "Papayas"
        ],
        tickPlacement: "on"
      },
      yaxis: {
        title: {
          text: "Servings"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      }
    };
  }
}