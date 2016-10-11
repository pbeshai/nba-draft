import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import d3 from '../d3';
import Scatterplot from '../components/Scatterplot';
import { metricsById } from '../constants/metrics';
import { highlightPlayer } from '../state/reducer';

const mapStateToProps = state => ({
  highlightPlayerId: state.charts.highlightPlayerId,
  players: state.players.payload,
});

const mapDispatchToProps = dispatch => ({
  onHighlightPlayer: d => dispatch(highlightPlayer(d && d.id)),
});

const PlayersScatterplot = ({ highlightPlayerId, onHighlightPlayer, players, yMetric }) => {
  const data = d3.values(players)
    .filter(d => d.hasStats)
    .filter(d => d.min > 400)
    .slice(0, 100);

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
        highlightPointId={highlightPlayerId}
        onHighlightPoint={onHighlightPlayer}
      />
    </div>
  );
};

PlayersScatterplot.propTypes = {
  highlightPlayerId: PropTypes.string,
  onHighlightPlayer: PropTypes.func,
  players: PropTypes.object,
  yMetric: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayersScatterplot);
