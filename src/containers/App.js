import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './App.css';

import { fetchDataIfNeeded } from '../state/reducer';

const mapStateToProps = (state, props) => ({
  drafts: state.drafts.payload,
  draftYears: state.draftYears.payload,
  executives: state.executives.payload,
  players: state.players.payload,
  teams: state.teams.payload,
});


class App extends Component {
  static propTypes = {
    drafts: PropTypes.object,
    draftYears: PropTypes.array,
    executives: PropTypes.object,
    players: PropTypes.object,
    teams: PropTypes.object,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchDataIfNeeded());
  }

  render() {
    const { draftYears = [] } = this.props;

    return (
      <div className="App">
        <h3>Draft Years</h3>
        {draftYears.map(year => <div key={year}>{year}</div>)}
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
