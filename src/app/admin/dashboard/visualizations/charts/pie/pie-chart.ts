import { Component, Input } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
	series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'pie-chart',
  imports: [NgApexchartsModule],
  templateUrl: './pie-chart.html'
})

export class PieChart {
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
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}