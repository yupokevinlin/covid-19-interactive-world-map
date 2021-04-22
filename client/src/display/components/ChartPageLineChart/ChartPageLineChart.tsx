import React, {useEffect} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import * as d3 from "d3";
import {useResizeDetector} from "react-resize-detector";
import {MathUtils} from "../../../helper/MathUtils";
import abbreviateNumber = MathUtils.abbreviateNumber;
import {ChartPageLineChartData} from "./types";
import {DateUtils} from "../../../helper/DateUtils";
import getDateStringFromDate = DateUtils.getDateStringFromDate;

export type ChartPageLineChartProps = ChartPageLineChartDataProps & ChartPageLineChartStyleProps & ChartPageLineChartEventProps;

export interface ChartPageLineChartDataProps {
  minValue: number;
  maxValue: number;
  startDate: Date,
  endDate: Date,
  data: Array<ChartPageLineChartData>;
  title: string;
  yAxisLabel: string;
  xAxisLabel: string;
  yAxisTooltip: string;
  xAxisTooltip: string;
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
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
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

  const divId: string = "line-chart-div"

  const {
    minValue,
    maxValue,
    startDate,
    endDate,
    data,
    title,
    yAxisLabel,
    xAxisLabel,
    yAxisTooltip,
    xAxisTooltip,
  } = props;

  const { width, height, ref } = useResizeDetector();

  const detectedWidth: number = width || 0;
  const detectedHeight: number = height || 0;

  const renderChart = (): void => {
    try {
      const breakpoint: number = 960;
      const isMd: boolean = detectedWidth >= breakpoint;
      const marginTop: number = isMd ? 100 : 80;
      const marginBottom: number = isMd ? 70 : 50;
      const marginRight: number = isMd ? 100 : 70;
      const marginLeft: number = isMd ? 100 : 70;

      //Get svg element
      const div = d3.select(`#${divId}`);

      //Remove all elements
      div.selectAll("*").remove();

      const svg = div.append("svg");
      svg.style("height", "100%")
        .style("width", "100%");

      //Generate X Axis
      const xScale = d3.scaleTime().domain([startDate, endDate]).range([marginLeft, detectedWidth - marginRight]);
      const xAxisSteps: number = isMd ? 1 : 3;
      const xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth.every(xAxisSteps));
      const xAxisElement = svg.append("g")
        .attr("transform", `translate(0, ${detectedHeight - marginBottom})`)
        .style("font-size", isMd ? "12px" : "10px")
        .style("line-height", isMd ? "12px" : "10px")
        .style("font-family", theme.typography.fontFamily)
        .call(xAxis);
        //X Axis Title
        xAxisElement
          .append("text")
          .text(xAxisLabel)
          .style("fill", theme.palette.text.primary)
          .style("text-anchor", "middle")
          .style("font-size", isMd ? "16px" : "12px")
          .style("line-height", isMd ? "16px" : "12px")
          .style("font-family", theme.typography.fontFamily)
          .attr("x", marginLeft + (detectedWidth - marginLeft - marginRight) / 2)
          .attr("y", isMd ? 50 : 35);
        //Title
        xAxisElement
          .append("text")
          .text(title)
          .style("fill", theme.palette.text.primary)
          .style("text-anchor", "middle")
          .style("font-size", isMd ? "20px" : "16px")
          .style("line-height", isMd ? "20x" : "16px")
          .style("font-family", theme.typography.fontFamily)
          .attr("x", marginLeft + (detectedWidth - marginLeft - marginRight) / 2)
          .attr("y", -(detectedHeight - marginBottom - marginTop) - (isMd ? 50 : 35));

      //Generate Y Axis
      const yScale = d3.scaleLinear().domain([maxValue, minValue]).range([marginTop, detectedHeight - marginBottom]);
      const yAxis = d3.axisLeft(yScale).tickFormat(d => abbreviateNumber(d as number, true));
      svg.append("g")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .style("font-size", isMd ? "12px" : "10px")
        .style("line-height", isMd ? "12px" : "10px")
        .style("font-family", theme.typography.fontFamily)
        .call(yAxis)
        //Y Axis Title
        .append("text")
        .text(yAxisLabel)
        .attr('transform', 'rotate(-90)')
        .style("fill", theme.palette.text.primary)
        .style("text-anchor", "middle")
        .style("font-size", isMd ? "16px" : "12px")
        .style("line-height", isMd ? "16px" : "12px")
        .style("font-family", theme.typography.fontFamily)
        .attr("x", -(marginTop + (detectedHeight - marginTop - marginBottom) / 2))
        .attr("y", isMd ? -60 : -45);

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
        .attr("stroke-width", isMd ? 3 : 2)
        .style("fill", "none");

      const lineX = svg.append("line")
        .style("stroke", theme.palette.text.primary)
        .style("stroke-opacity", 0.75)
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "6 6")
        .style("pointer-events", "none");
      const lineY = svg.append("line")
        .style("stroke", theme.palette.text.primary)
        .style("stroke-opacity", 0.75)
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "6 6")
        .style("pointer-events", "none");
      const circle = svg.append("circle")
        .attr("r", isMd ? "7px" : "5px")
        .attr("fill", theme.palette.background.paper)
        .attr("stroke", theme.palette.primary.main)
        .attr("stroke-width", isMd ? "2px" : "2px")
        .style("display", "none")
        .style("pointer-events", "none");
      const tooltip = div.append("div")
        .style("display", "none")
        .style("pointer-events", "none");

      const dateToolTip = tooltip.append("div");

      const valueToolTip = tooltip.append("div");

      const callout = (d, date, value) => {
        if (!!date && (value !== undefined && value !== null)) {
          circle.style("transform", `translate(${xScale(date)}px, ${yScale(value)}px)`)
            .style("display", null);
          lineX.attr("x1", marginLeft)
            .attr("y1", yScale(value))
            .attr("x2", xScale(date))
            .attr("y2", yScale(value))
            .style("display", null);
          lineY.attr("x1", xScale(date))
            .attr("y1", detectedHeight - marginBottom)
            .attr("x2", xScale(date))
            .attr("y2", yScale(value))
            .style("display", null);

          const toolTipHeight: number = isMd ? 30 : 26;
          const toolTipWidth: number = isMd ? 100 : 80;
          const paddingTopBottom: number = isMd ? 5 : 3;
          const paddingLeftRight: number = isMd ? 5 : 3;
          const tooltipElementHeight: number = isMd ? 12 : 10;

          tooltip
            .style("position", "absolute")
            .style("top", `${-toolTipHeight / 2}px`)
            .style("left", `${-toolTipWidth / 2}px`)
            .style("transform", `translate(${xScale(date)}px, ${yScale(value)}px)`)
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("align-items", "center")
            .style("justify-content", "space-evenly")
            .style("height", `${toolTipHeight}px`)
            .style("width", `${toolTipWidth}px`)
            .style("padding", `${paddingTopBottom}px ${paddingLeftRight}px`)
            .style("font-size", isMd ? "12px" : "10px")
            .style("line-height", isMd ? "12px" : "10px")
            .style("font-family", theme.typography.fontFamily)
            .style("color", theme.palette.text.primary)
            .style("background-color", theme.palette.background.paper)
            .style("box-shadow", "rgb(0 0 0 / 25%) 0px 1px 2px")
            .style("border-radius", "2px");

          dateToolTip.style("height", `${tooltipElementHeight}px`)
            .text(`${xAxisTooltip}: ${getDateStringFromDate(date)}`);

          valueToolTip.style("height", `${tooltipElementHeight}px`)
            .text(`${yAxisTooltip}: ${abbreviateNumber(value, true)}`);
        } else {
          tooltip.style("display", "none");
          circle.style("display", "none");
          lineX.style("display", "none");
          lineY.style("display", "none");
          return;
        }
      }

      const bisect = (d) => {
        const d3bisector = d3.bisector(d => {
          const data: ChartPageLineChartData = d as unknown as ChartPageLineChartData;
          return data.date;
        }).left;
        const date: any = xScale.invert(d);
        const index = d3bisector(data, date, 1);
        const a: any = data[index - 1];
        const b: any = data[index];
        return b && (date - a.date > b.date - date) ? b : a;
      }
      svg.on("touchmove mousemove", (event) => {
        const {date, value} = bisect(d3.pointer(event, this)[0]);
        tooltip.call(callout, date, value);
      });
      svg.on("touchend mouseleave", () => tooltip.call(callout, null, null));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    renderChart();
  });

  return (
    <div className={classes.root} id={divId} ref={ref}/>
  );
};

export default ChartPageLineChart;

