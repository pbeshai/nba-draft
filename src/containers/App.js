import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Match from 'react-router/Match';
import { addUrlProps } from 'react-url-query';

import { fetchDataIfNeeded } from '../state/reducer';

import OverviewPage from './OverviewPage';
import MetricSelector from '../components/MetricSelector';
import * as CustomUrlTypes from '../url/customUrlTypes';
import { metricsById } from '../constants/metrics';

const urlPropsQueryConfig = {
  metric: { type: CustomUrlTypes.metric },
};

const mapStateToProps = () => ({
});

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    metric: PropTypes.object,
    onChangeMetric: PropTypes.func,
  }

  static defaultProps = {
    metric: metricsById.bpm,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchDataIfNeeded());
  }

  renderMetricSelector() {
    const { metric, onChangeMetric } = this.props;

    return (
      <MetricSelector metric={metric} onChangeMetric={onChangeMetric} />
    );
  }

  render() {
    return (
      <div className="App">
        {this.renderMetricSelector()}
        <div className="container">
          <Match exactly pattern="/" component={OverviewPage} />
        </div>
      </div>
    );
  }
}

export default addUrlProps({ urlPropsQueryConfig })(connect(mapStateToProps)(App));
