import { Component } from '@angular/core';
import { BarChart } from './charts/bar/bar-chart';
import { PieChart } from './charts/pie/pie-chart';
import { TimeChart } from "./charts/time/time-chart";

@Component({
	selector: 'visualizations',
	imports: [BarChart, PieChart, TimeChart],
	templateUrl: './visualizations.html'
})

export class Visualizations {
	
}
