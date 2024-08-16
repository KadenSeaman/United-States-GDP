import { useEffect, useState, useRef } from 'react'
import './App.css'
import * as d3 from "d3";

function BarChart({dataset}){

  const barChartRef = useRef(null);
  const [barChartExists, setBarChartExists] = useState('false');

  useEffect(() => {

    if (!dataset) return;

    if(barChartExists){
      d3.select(barChartRef.current).selectAll("*").remove()
    }

    setBarChartExists(true);

    const width = 800;
    const height = 400;

    const marginTop = 50;
    const marginRight = 20;
    const marginBottom = 50;
    const marginLeft = 40;


    // x and y axis scale information
    const startDate = new Date(d3.min(dataset, d => d[0]));
    const endDate = new Date(d3.max(dataset, d => d[0]));

    const xAxisScale = d3.scaleUtc()
    .domain([startDate, endDate])
    .range([marginLeft, width - marginRight]);

    const yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([height - marginTop, marginBottom]);

    const xAxis = d3.axisBottom(xAxisScale);
    const yAxis = d3.axisLeft(yAxisScale);

    const svg = d3.select(barChartRef.current)
    .append('svg')
    .attr('width', width)
    .attr('height',height);
    
    //xAxis
    svg.append('g')
    .attr('transform',`translate(0, ${height - marginBottom})`)
    .attr('id','x-axis')
    .call(xAxis);

    //yAxis
    svg.append('g')
    .attr('transform',`translate(${marginLeft},0)`)
    .attr('id','y-axis')
    .call(yAxis);

    //yAxis label
    svg.append('text')
    .attr('x', -275)
    .attr('y', marginLeft * 1.5)
    .attr('transform','rotate(-90)')
    .text('United States GDP (in billions)')

    //xAxis more info label
    svg.append('text')
    .attr('x', width - 435)
    .attr('y', height - 5)
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")

    //bar sizing scale information
    const heightLinearScale = d3.scaleLinear()
    .domain([0,d3.max(dataset, d => d[1])])
    .range([marginBottom, height - marginTop]);

    const xLinearScale = d3.scaleUtc()
    .domain([startDate,endDate])
    .range([marginLeft, width - marginRight]);

    

    //individual bars
    svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', d => d[0])
    .attr('data-gdp', d => d[1])
    .attr('height', d => heightLinearScale(d[1]) - marginBottom)
    .attr('width', (width - marginLeft - marginRight) / 275 + 0.03)
    .attr('x', d => xLinearScale(new Date(d[0]))) 
    .attr('y', d => height - heightLinearScale(d[1]))
    .on('mouseover', (event, d) => {
      // tooltip.selectAll("*").remove();

      const year = d[0].slice(0,4)
      let quarter = d[0].slice(5,7);
      let amount = d[1];

      switch(quarter){
        case "01":
          quarter = "Q1";
          break;
        case "04":
          quarter = "Q2";
          break;
        case "07":
          quarter = "Q3";
          break;
        case "10":
          quarter = "Q4";
          break;
        default:
          quarter = "ERROR"
          break;
      }


      const xPosition = xLinearScale(new Date(d[0]));
      if(xPosition < width / 2){
        tooltip.style('left',  xPosition + 10 + "px");
      }
      else{
        tooltip.style('left',xPosition - 150 + "px")
      }
      tooltip.style('bottom', height / 3 + "px")
      
      tooltip.attr('data-date',d[0]);
      tooltip.html(year + " " + quarter + "<br>" + "$" + amount + " billion");
      tooltip.style('opacity',1);
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0)
    })

    //overlay
    const tooltip = d3.select(".main-card")
    .append('div')
    .attr('x',200)
    .attr('y', 300)
    .attr('id','tooltip')

  },[dataset])

  return <div ref={barChartRef}></div>
}

function App() {
  const [dataSet, setDataSet] = useState("");

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(response => response.json())
    .then(responseData => setDataSet(responseData.data))
  },[])

  return (
    <div className="wrapper">
      <div className="main-card">
      <h1 id="title">United States GDP</h1>
      <BarChart dataset = {dataSet} />
      </div>
    </div>

  )
}

export default App
