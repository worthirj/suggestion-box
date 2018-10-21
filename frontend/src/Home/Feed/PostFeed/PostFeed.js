import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../Post/Post';
import AddPost from '../AddPost/AddPost';
import { loadPostListByTeam, loadTeamMembers, loadUserVotes } from './postFeedActions';
import { getPostById } from '../Post/postSelectors';
import './PostFeed.css'

const mapDispatchToProps = dispatch => {
  return {
    loadPostListByTeam: teamId => dispatch(loadPostListByTeam(teamId)),
    loadTeamMembers: teamId => dispatch(loadTeamMembers(teamId)),
    loadUserVotes: userId => dispatch(loadUserVotes(userId)),
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    loadPostListPending: state.feed.loadPostListPending,
    loadTeamMembersPending: state.feed.loadTeamMembersPending,
    postList: state.feed.postList.map(id => getPostById(state, id)),
    getUserTeamsPending: state.home.getUserTeamsPending,
    userTeams: state.home.userTeams,
    loadUserVotesPending: state.feed.loadUserVotesPending,
  }
}

class PostFeed extends Component {
  componentDidMount() {
    // get posts
    const {
      teamId,
      loadPostListByTeam,
      loadTeamMembers,
      loadUserVotes,
      currentUser,
    } = this.props;

    if (teamId !== undefined) {
      loadPostListByTeam(teamId);
      loadTeamMembers(teamId);
    }
    loadUserVotes(currentUser.user_id);
  }

  render() {
    const {
      currentUser,
      loadPostListPending,
      loadTeamMembersPending,
      postList,
      teamId,
      getUserTeamsPending,
      userTeams,
      loadUserVotesPending,
    } = this.props;

    return (loadPostListPending || loadTeamMembersPending || getUserTeamsPending || loadUserVotesPending || userTeams === null) ? (
      <div>
        Loading...
      </div>
    ) : (
      <div className='post-feed'>
        <AddPost currentUser={currentUser} currentTeam={teamId} />
        { postList.map((post, i) =>
          <Post
            key={post.post_id}
            postObj={post}
          /> ) }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostFeed);
