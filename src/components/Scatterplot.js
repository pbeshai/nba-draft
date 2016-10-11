import React, { PureComponent, PropTypes } from 'react';
import d3 from '../d3';
import addComputedProps from '../hoc/addComputedProps';
import AxisTooltip from './AxisTooltip';

import './Scatterplot.scss';

// TODO: move this to its own place
const dataDefPropType = PropTypes.shape({
  label: PropTypes.string,
  unit: PropTypes.string,
  formatter: PropTypes.func,
  shortFormatter: PropTypes.func,
});

/**
 * Figure out what is needed to render the chart
 * based on the props of the component
 */
function visProps(props) {
  const {
    data,
    xKey,
    yKey,
    width,
    height,
    clampToZero,
    xDomainPadding = 1.15,
    yDomainPadding = 1.15,
  } = props;
  let {
    xDomain,
    yDomain,
  } = props;

  const color = () => 'rgb(150, 200, 250)';
  const padding = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 50,
  };

  const plotAreaWidth = width - padding.left - padding.right;
  const plotAreaHeight = height - padding.top - padding.bottom;

  if (!xDomain && data) {
    xDomain = d3.extent(data, d => d[xKey]);
  }

  if (!yDomain && data) {
    yDomain = d3.extent(data, d => d[yKey]);
  }

  if (clampToZero) {
    yDomain = [0, yDomain[1]];
    xDomain = [0, xDomain[1]];
  }

  const xScale = d3.scaleLinear().range([0, plotAreaWidth]).clamp(true);
  if (xDomain) {
    xScale.domain([xDomain[0], xDomain[1] * xDomainPadding]);
  }

  const yScale = d3.scaleLinear().range([plotAreaHeight, 0]).clamp(true);
  if (yDomain) {
    yScale.domain([yDomain[0], yDomain[1] * yDomainPadding]);
  }

  const voronoiDiagram = d3.voronoi()
    .x(d => xScale(d[xKey]))
    .y(d => yScale(d[yKey]))
    .size([plotAreaWidth, plotAreaHeight])(data);

  return {
    color,
    padding,
    plotAreaWidth,
    plotAreaHeight,
    xScale,
    yScale,
    voronoiDiagram,
  };
}

/**
 * Chart for showing dots
 *
 * @prop {Array} data array of objects with various metrics inside
 * @prop {Number} height The height of the chart
 * @prop {String} highlightPointId The ID of the point to highlight
 * @prop {Function} onHighlightPoint Callback for when a point is hovered on
 * @prop {Number} width The width of the chart
 * @prop {String} yKey="y" The key in the data points to read the y value from
 * @prop {String} xKey="x" The key in the data points to read the x value from
 */
class Scatterplot extends PureComponent {
  static propTypes = {
    color: PropTypes.func,
    data: PropTypes.array,
    height: PropTypes.number,
    highlightPointId: PropTypes.string,
    id: PropTypes.string,
    onHighlightPoint: PropTypes.func,
    padding: PropTypes.object,
    plotAreaHeight: PropTypes.number,
    plotAreaWidth: PropTypes.number,
    pointRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    recomputedProps: PropTypes.bool,
    width: PropTypes.number,
    voronoiDiagram: PropTypes.object,
    xDataDef: dataDefPropType,
    xKey: PropTypes.string,
    xScale: PropTypes.func,
    yDataDef: dataDefPropType,
    yKey: PropTypes.string,
    yScale: PropTypes.func,
  }

  static defaultProps = {
    data: [],
    yKey: 'y',
    xKey: 'x',
    width: 200,
    height: 200,
    pointRadius: 3,
  }

  /**
   * When the react component mounts, setup the d3 vis
   */
  componentDidMount() {
    this.setup();
  }

  /**
   * When the react component updates, update the d3 vis
   */
  componentDidUpdate() {
    this.update();
  }

  onHoverPoint(d) {
    const { onHighlightPoint } = this.props;

    if (onHighlightPoint) {
      onHighlightPoint(d);
    }
  }

  /**
   * Helper to find the highlight point based off the ID
   */
  getHighlightPoint() {
    const { data, highlightPointId } = this.props;
    if (!data || !data.length || highlightPointId == null) {
      return null;
    }

    const highlightPoint = data.find(d => d.id === highlightPointId);
    return highlightPoint;
  }

  getXAxisLabel() {
    const { xDataDef } = this.props;
    const { label, unit } = xDataDef;
    return `${label}${unit ? ` (${unit})` : ''}`;
  }

  getYAxisLabel() {
    const { yDataDef } = this.props;
    const { label, unit } = yDataDef;
    return `${label}${unit ? ` (${unit})` : ''}`;
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    this.g = d3.select(this.root)
      .append('g'); // transformed to have margin in update()

    // add in axis groups
    this.xAxis = this.g.append('g').classed('x-axis', true);
    this.xAxisLabel = this.g.append('text')
      .attr('dy', -4)
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    this.yAxis = this.g.append('g').classed('y-axis', true);
    this.yAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    this.circles = this.g.append('g').attr('class', 'circles');

    this.voronoi = this.g.append('g')
      .attr('class', 'voronoi')
      .on('mouseleave', () => this.onHoverPoint(null));

    this.update();
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    const { recomputedProps } = this.props;
    // only update if we recomputed props that these rely on
    if (recomputedProps) {
      this.updateAxes();
      this.updateChart();
      this.updateVoronoi();
    }
  }

  updateVoronoi() {
    const { voronoiDiagram } = this.props;

    const binding = this.voronoi.selectAll('path')
      .data(voronoiDiagram.polygons());

    binding.exit().remove();

    const entering = binding.enter().append('path');


    binding.merge(entering)
      .attr('d', d => (d ? `M${d.join('L')}Z` : null))
      .on('mouseenter', d => this.onHoverPoint(d.data));
  }

  /**
   * Iterates through data, using line generators to update charts.
   */
  updateChart() {
    const {
      data,
      padding,
      color,
      pointRadius,
      xKey,
      xScale,
      yKey,
      yScale,
    } = this.props;

    this.g.attr('transform', `translate(${padding.left} ${padding.top})`);

    const binding = this.circles.selectAll('.data-point').data(data, d => d.id);
    binding.exit().remove();
    const entering = binding.enter().append('circle')
      .classed('data-point', true);

    binding.merge(entering)
      .transition()
      .attr('cx', d => xScale(d[xKey]))
      .attr('cy', d => yScale(d[yKey]))
      .attr('r', pointRadius)
      .attr('fill', d => color(d.id));
  }

  /**
   * Render the x and y axis components
   */
  updateAxes() {
    const { xDataDef, yDataDef, xScale, yScale, plotAreaHeight, plotAreaWidth, padding } = this.props;

    const xTicks = Math.round(plotAreaWidth / 50);
    const yTicks = Math.round(plotAreaHeight / 50);
    const xAxis = d3.axisBottom(xScale)
      .ticks(xTicks)
      .tickSizeOuter(0)
      .tickFormat(xDataDef.shortFormatter);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(yTicks)
      .tickSizeOuter(0)
      .tickFormat(yDataDef.shortFormatter);

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left + 12})`)
      .text(this.getYAxisLabel());

    this.xAxis
      .attr('transform', `translate(0 ${plotAreaHeight + 3})`)
      .call(xAxis);
    this.xAxisLabel
      .attr('transform', `translate(${plotAreaWidth / 2} ${plotAreaHeight + (padding.bottom)})`)
      .text(this.getXAxisLabel());
  }

  render() {
    const { width, height, id, plotAreaWidth, plotAreaHeight, padding, xScale, yScale,
      xDataDef, yDataDef, xKey, yKey, color } = this.props;

    const highlightPoint = this.getHighlightPoint();
    const highlightColor = highlightPoint ? color(highlightPoint.id) : undefined;

    return (
      <div className="Scatterplot-container chart-container">
        <svg
          id={id}
          className="Scatterplot chart"
          height={height}
          ref={(node) => { this.root = node; }}
          width={width}
        />
        <AxisTooltip
          color={highlightColor}
          plotAreaWidth={plotAreaWidth}
          plotAreaHeight={plotAreaHeight}
          padding={padding}
          width={width}
          height={height}
          highlightPoint={highlightPoint}
          xScale={xScale}
          yScale={yScale}
          xDataDef={xDataDef}
          yDataDef={yDataDef}
          xKey={xKey}
          yKey={yKey}
        />
      </div>
    );
  }
}

export default addComputedProps(visProps, { debug: true, changeExclude: ['highlightPointId'] })(Scatterplot);
