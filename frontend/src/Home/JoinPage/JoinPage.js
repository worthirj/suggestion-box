import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllTeams, addTeamMember } from './joinPageActions';
import Loader from '../Loader/Loader';
import './JoinPage.css';

const mapDispatchToProps = dispatch => {
  return {
    getAllTeams: () => dispatch(getAllTeams()),
    addTeamMember: (userId, teamId) => dispatch(addTeamMember(userId, teamId)),
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    teams: state.join.teams,
    userTeams: state.home.userTeams,
  }
}

class JoinPage extends Component {
  componentDidMount() {
    const { getAllTeams } = this.props;
    getAllTeams();
  }

  // returns teams in otherTeams that are not in userTeams
  getTeamsNotIn(userTeams, otherTeams) {
    if (userTeams && otherTeams) {
      return otherTeams.filter(team => !(team.team_id in userTeams));
    }
    return undefined;
  }

  render() {
    const { teams, addTeamMember, currentUser, userTeams } = this.props;

    return (
      <div className='join-page'>
        {(teams && userTeams) ?
          <div>
            <h1>Join a team</h1>
            {teams.length > 0 ?
              teams.map(team =>
                <div
                  key={team.team_id}
                  className={'add-team-container' + ((team.team_id in userTeams) ? ' joined' : '')}>
                  <button
                    disabled={team.team_id in userTeams}
                    className='join-button'
                    key={team.team_id}
                    onClick={() => addTeamMember(currentUser.user_id, team.team_id)}>join</button>
                  <p className='join-team-name'>{team.name}</p>
                </div>
              )
              :
              <div>
                <p>
                  No teams to join
                </p>
                <button className='create-team-button'>
                  Create a team
                </button>
              </div>
            }
          </div>
          :
          <Loader />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinPage);
