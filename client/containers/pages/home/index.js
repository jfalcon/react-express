import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './actions';
import Header from 'components/common/header';

/*/
/ / React Lifecycle Methods (in order)
/ /
/ / componentWillMount        - runs before the component renders, use for initialization
/ / componentDidMount         - runs immediately after the render, DOM exists, set timers, remote calls, etc.
/ / componentWillReceiveProps - set state before the next render, not called on initial render
/ / shouldComponentUpdate     - runs before render after prop update (not on initial, return false stops re-render)
/ / componentWillUpdate       - prepare for an new render with new props, not called on initial, don't setState here
/ / componentDidUpdate        - updates have been flushed to the DOM, work with DOM after update, not initial render
/ / componentWillUnMount      - component is unmounting from the DOM, use it for clean up
/*/

class HomePage extends React.Component {
  // doing this requires use of the transform-className-properties plug-in for babel
  static propTypes = {
    messageData: PropTypes.object.isRequired
  };

  // defaultProps and getInitialState are for ES5 / React.createClass
  // syntax only, in ES2015+ we use the constructor instead
  constructor(props, context) {
    super(props, context);

    this.transformMessageData = this.transformMessageData.bind(this);
  }

  componentDidMount() {
    // this will fetch data from the web service layer
    this.props.actions.fetchMessageData();
  }

  // do not put this in the render function
  transformMessageData() {
    const data = this.props.messageData.data;
    return Object.keys(data).map((key, index) => <div key={key}>{`${data[key]} (${key})`}</div>);
  }

  render() {
    return (
      <section>
        <Header />
        {this.transformMessageData()}
      </section>
    );
  }
}

// since components aren't meant to know about Redux we connect this component
// to Redux right here and thus make it a container component, as such these
// routines below allow us to take Redux logic and map it over to React logic

// as such, this is the only part of this file that pertains to Redux,
// everything else presented above is strictly specific to React
export default connect (
  // mapStateToProps, this maps the Redux *store* state to React component properties
  // do not confuse this with React local state for the component itself, also this
  // will be called upon component instantiation and after every Redux *store* update
  function(state) {
    return {
      messageData: state.home.messageData
    };
  },

  // mapDispatchToProps, using this avoids a Redux anti-pattern, if we don't use it then
  // the store's dispatch method gets injected into the React props, but React isn't
  // supposed to know Redux exists, as such we create proxies to use in the component
  function(dispatch) {
    return {
      // bindActionCreators is simply a convenience function that stops us form having to
      // type out "someAction: input => dispatch(someAction(input)) " for every action
      // also we namespace the actions rather than put them on the props root directly
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(HomePage);
