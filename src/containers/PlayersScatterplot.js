import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import d3 from '../d3';
import Scatterplot from '../components/Scatterplot';
import { metricsById } from '../constants/metrics';

const mapStateToProps = state => ({
  players: state.players.payload,
});

class PlayersScatterplot extends Component {
  static propTypes = {
    players: PropTypes.object,
    yMetric: PropTypes.object,
  }

  render() {
    const { players, yMetric } = this.props;
    const data = d3.values(players).slice(0, 60)
      .filter(d => d.pts != null);

    const xMetric = metricsById.draftPick;

    return (
      <div className="PlayersScatterplot">
        <Scatterplot
          data={data}
          width={400}
          height={400}
          xDomainPadding={0}
          yKey={yMetric.id}
          xKey={xMetric.id}
          xDataDef={xMetric}
          yDataDef={yMetric}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(PlayersScatterplot);
