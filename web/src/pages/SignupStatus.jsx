import _ from 'lodash';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {createProfileInit} from '../redux/actions/ProfileActions';
import {connect} from 'react-redux';

class SignupStatus extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    var {profile} = this.props;

    if (!profile) {
      this.context.router.replace('/signup');
    }
  }

  componentWillUnmount() {
    this.props.dispatch(createProfileInit());
  }

  render() {
    var {profile} = this.props;

    return (
      <div className="ba-signup-status">
        {profile ?
          <div className="row">
            <div className="small-12 medium-10 medium-offset-1 columns">
              <div className="row">
                <h3>Congratulations!</h3>
              </div>
              <div className="row">
                {profile.name ?
                  <div>
                    <span className="ba-signup-status-name">{profile.name}</span>,
                  </div>
                  : null }
                <p>You have successfully created an account.</p>
                <div>
                  <Link to="/" className="button ba-default-btn">Homepage</Link>
                </div>
              </div>
            </div>
          </div> : null }
        <div className="push"/>
      </div>
    );
  }
}

SignupStatus.displayName = 'SignupStatus';
SignupStatus.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    profile: _.get(state.signup, 'savedProfile')
  };
}

export default connect(mapStateToProps)(SignupStatus);
