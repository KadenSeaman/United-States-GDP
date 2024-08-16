import { useEffect, useState, useRef } from 'react'
import './App.css'
import * as d3 from "d3";

function BarChart({dataset}){

  const barChartRef = useRef(null);

  useEffect(() => {

    if (!dataset) return;

    const width = 800;
    const height = 400;

    const marginTop = 30;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

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
    
    const heightLinearScale = d3.scaleLinear()
    .domain([0,d3.max(dataset, d => d[1])])
    .range([marginBottom, height - marginTop]);

    const xLinearScale = d3.scaleUtc()
    .domain([startDate,endDate])
    .range([marginLeft, width - marginRight]);

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
    .attr('y', d => height - heightLinearScale(d[1]));

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
    <div className="main-card">
      <h1 id="title">United States GDP</h1>
      <BarChart dataset = {dataSet} />
    </div>
  )
}

export default App
