import React, {useEffect} from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import * as d3 from "d3";
import {useResizeDetector} from "react-resize-detector";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import {MathUtils} from "../../../helper/MathUtils";
import abbreviateNumber = MathUtils.abbreviateNumber;

export type LineChartProps = LineChartDataProps & LineChartStyleProps & LineChartEventProps;

export interface LineChartDataProps {
  minY: number;
  maxY: number;
}

export interface LineChartStyleProps {
}

export interface LineChartEventProps {

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



const LineChart: React.FC<LineChartProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();
  const chartId: string = "line-chart";

  const {
    minY,
    maxY,
  } = props;

  const { width, height, ref } = useResizeDetector();

  const detectedWidth: number = width || 0;
  const detectedHeight: number = height || 0;

  useEffect(() => {
    const breakpoint: number = 960;
    const isMd: boolean = detectedWidth >= breakpoint;
    const marginTop: number = 30;
    const marginBottom: number = 30;
    const marginRight: number = 30;
    const marginLeft: number = 55;

    //Get svg element
    const svg = d3.select(`#${chartId}`);

    //Remove all elements
    svg.selectAll("*").remove();

    //Generate X Axis
    const xScale = d3.scaleTime().domain([new Date(2020, 0, 1), new Date(2021, 4, 19)]).range([marginLeft, detectedWidth - marginRight]);
    const xAxisSteps: number = isMd ? 1 : 3;
    const xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth.every(xAxisSteps));
    svg.append("g").attr("transform", `translate(0, ${detectedHeight - marginBottom})`).call(xAxis);

    //Generate Y Axis
    const yScale = d3.scaleLinear().domain([maxY, minY]).range([marginTop, detectedHeight - marginBottom]);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => abbreviateNumber(d as number, 1));
    svg.append("g").attr("transform", `translate(${marginLeft}, 0)`).call(yAxis);
  });

  return (
    <div className={classes.root} ref={ref}>
      <svg className={classes.svg} id={chartId}/>
    </div>
  );
};

export default LineChart;

