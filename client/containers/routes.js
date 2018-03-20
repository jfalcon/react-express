import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import HomePage from 'containers/pages/home';

/*/
/ / React Lifecycle Methods (in order)
/ /
/ / componentWilMount        - runs before the component renders, use for initialization
/ / componentDidMount        - runs immediately after the render, DOM exists, set timers, remote calls, etc.
/ / componentWilReceiveProps - set state before the next render, not called on initial render
/ / shouldComponentUpdate    - runs before render after prop update (not on initial, return false stops re-render)
/ / componentWillUpdate      - prepare for an new render with new props, not called on initial, don't setState here
/ / componentDidUpdate       - updates have been flushed to the DOM, work with DOM after update, not initial render
/ / componentWillUnMount     - component is unmounting from the DOM, use it for clean up
/*/

class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/*<Route path="/about" exact component={AboutPage} />*/}
          <Route path="/" component={HomePage} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    );
  }
}

// since components aren't meant to know about Redux we connect this component
// to Redux right here and thus make it a container component, as such these
// routines below allow us to take Redux logic and map it over to React logic

// as such, this is the only part of this file that pertains to Redux,
// everything else presented above is strictly specific to React
export default connect()(Routes);
