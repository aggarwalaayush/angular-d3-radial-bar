import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
export interface Data{
  Country: string,
  Value:number
}

@Component({
  selector: 'app-radialbar',
  templateUrl: './radialbar.component.html',
  styleUrls: ['./radialbar.component.scss']
})
export class RadialbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.createGraph();
  }

  createGraph() {
    const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 80,
    outerRadius = Math.min(width, height) / 2;

    var svg = d3.select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + width / 2 + "," + ( height/2+100 )+ ")");
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv").then( (data) => {

      // X scale
      const x = d3.scaleBand()
          .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
          .align(0)                  // This does nothing ?
          .domain(data.map((d:any) => d.Country)); // The domain of the X axis is the list of states.

      // Y scale
      const y = d3.scaleRadial()
          .range([innerRadius, outerRadius])   // Domain will be define later.
          .domain([0, 10000]); // Domain of Y is from 0 to the max seen in the data

      // Add bars
      svg.append("g")
        .selectAll("path")
        .data(data)
        .join("path")
          .attr("fill", "#69b3a2")
          .attr("d", <any>d3.arc().innerRadius(innerRadius).outerRadius((d:any) => y(d['Value'])).startAngle((d:any) => x(d.Country)as number)
          .endAngle((d:any) => (x(d.Country) as number)+ x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))

      // Add the labels
        svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
              .attr("text-anchor", function(d:any) { return (x(d.Country) as number + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
              .attr("transform", function(d:any) { return "rotate(" + ((x(d.Country) as number + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Value'])+10) + ",0)"; })
              .append("text")
              .text(function(d:any){return(d.Country)})
              .attr("transform", function(d:any) { return (x(d.Country) as number + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
              .style("font-size", "11px")
              .attr("alignment-baseline", "middle")
    });
  }
}
