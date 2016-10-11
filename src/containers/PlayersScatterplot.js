import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import d3 from '../d3';
import Scatterplot from '../components/Scatterplot';
import { metricsById } from '../constants/metrics';

const mapStateToProps = state => ({
  players: state.players.payload,
});

const PlayersScatterplot = ({ players, yMetric }) => {
  const data = d3.values(players)
    .filter(d => d.hasStats)
    .filter(d => d.min > 400);

  const xMetric = metricsById.draftPick;

  return (
    <div className="PlayersScatterplot">
      <Scatterplot
        data={data}
        width={400}
        height={400}
        xDomainPadding={1}
        yDomainPadding={1}
        yKey={yMetric.id}
        xKey={xMetric.id}
        xDataDef={xMetric}
        yDataDef={yMetric}
      />
    </div>
  );
};

PlayersScatterplot.propTypes = {
  players: PropTypes.object,
  yMetric: PropTypes.object,
};

export default connect(mapStateToProps)(PlayersScatterplot);
