import React, { PropTypes } from 'react';
import metrics from '../constants/metrics';

const MetricSelector = ({ metric, onChangeMetric }) => (
  <div className="metric-selector">
    <div className="container">
      <h5>Score By</h5>
      <select value={metric.value} onChange={evt => onChangeMetric(evt.target.value)}>
        {metrics.map(m => <option value={m.value} key={m.value}>{m.label}</option>)}
      </select>
    </div>
  </div>
);

MetricSelector.propTypes = {
  metric: PropTypes.object,
  onChangeMetric: PropTypes.func,
};

export default MetricSelector;
