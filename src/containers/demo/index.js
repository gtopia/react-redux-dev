// Styles
import './index.css';
// Libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as DemoActions from '../../actions/demo';

class DemoPage extends Component {
    constructor(props) {
        super(props);
    }

    _onNodeClick() {
        console.log('<<< click');
    }

    render() {
        const {demoState, demoActions} = this.props;

        return (
          <section>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                disabled={demoState.isLoading} onClick={demoActions.decreaseCounter}>
                <i className="material-icons">remove</i>
            </button>

            <span>{demoState.counter}</span>

            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                disabled={demoState.isLoading} onClick={demoActions.increaseCounter}>
                <i className="material-icons">add</i>
            </button>
          </section>
        );
    }
}

DemoPage.propTypes = {
  demoState  : PropTypes.object.isRequired,
  demoActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    demoState: state.demo.toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return {
    demoActions: bindActionCreators(DemoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DemoPage);
