import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  drafts: state.drafts.payload,
  draftYears: state.draftYears.payload,
  executives: state.executives.payload,
  players: state.players.payload,
  teams: state.teams.payload,
});


class OverviewPage extends Component {
  static propTypes = {
    drafts: PropTypes.object,
    draftYears: PropTypes.array,
    executives: PropTypes.object,
    players: PropTypes.object,
    teams: PropTypes.object,
  }

  renderPlayers() {
    const { players } = this.props;

    if (!players) {
      return null;
    }

    return (
      <div>
        <h3>Players</h3>
        {Object.keys(players).slice(0, 10).map(playerId => <div key={playerId}>{playerId}</div>)}
      </div>
    );
  }

  render() {
    return (
      <div className="OverviewPage">
        {this.renderPlayers()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(OverviewPage);
