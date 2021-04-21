import React, {useEffect} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import * as d3 from "d3";
import {useResizeDetector} from "react-resize-detector";
import {MathUtils} from "../../../helper/MathUtils";
import abbreviateNumber = MathUtils.abbreviateNumber;
import {ChartPageLineChartData} from "./types";

export type ChartPageLineChartProps = ChartPageLineChartDataProps & ChartPageLineChartStyleProps & ChartPageLineChartEventProps;

export interface ChartPageLineChartDataProps {
  minValue: number;
  maxValue: number;
  startDate: Date,
  endDate: Date,
  data: Array<ChartPageLineChartData>;
}

export interface ChartPageLineChartStyleProps {
}

export interface ChartPageLineChartEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
    },
    svg: {
      height: "100%",
      width: "100%",
    }
  }),
);



const ChartPageLineChart: React.FC<ChartPageLineChartProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();
  const chartId: string = "line-chart";

  const {
    minValue,
    maxValue,
    startDate,
    endDate,
    data,
  } = props;

  const { width, height, ref } = useResizeDetector();

  const detectedWidth: number = width || 0;
  const detectedHeight: number = height || 0;

  const renderChart = (): void => {
    try {
      const breakpoint: number = 960;
      const isMd: boolean = detectedWidth >= breakpoint;
      const marginTop: number = isMd ? 20 : 15;
      const marginBottom: number = isMd ? 40 : 30;
      const marginRight: number = isMd ? 40 : 30;
      const marginLeft: number = isMd ? 60 : 55

      //Get svg element
      const svg = d3.select(`#${chartId}`);

      //Remove all elements
      svg.selectAll("*").remove();

      //Generate X Axis
      const xScale = d3.scaleTime().domain([startDate, endDate]).range([marginLeft, detectedWidth - marginRight]);
      const xAxisSteps: number = isMd ? 1 : 3;
      const xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth.every(xAxisSteps));
      svg.append("g").attr("transform", `translate(0, ${detectedHeight - marginBottom})`).style("font-size", isMd ? "12px" : "10px").call(xAxis);

      //Generate Y Axis
      const yScale = d3.scaleLinear().domain([maxValue, minValue]).range([marginTop, detectedHeight - marginBottom]);
      const yAxis = d3.axisLeft(yScale).tickFormat(d => abbreviateNumber(d as number, true));
      svg.append("g").attr("transform", `translate(${marginLeft}, 0)`).style("font-size", isMd ? "12px" : "10px").call(yAxis);

      //Generate line
      const dataLine: any = d3.line()
        .x((d) => {
          const data: ChartPageLineChartData = d as unknown as ChartPageLineChartData;
          return xScale(data.date)
        })
        .y((d) => {
          const data: ChartPageLineChartData = d as unknown as ChartPageLineChartData;
          return yScale(data.value)
        });
      svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", dataLine)
        .attr("stroke", theme.palette.primary.main)
        .attr("stroke-width", 3)
        .style("fill", "none");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    renderChart();
  });

  return (
    <div className={classes.root} ref={ref}>
      <svg className={classes.svg} id={chartId}/>
    </div>
  );
};

export default ChartPageLineChart;

