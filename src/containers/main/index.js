import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Counter from '../../components/counter';
import * as MainActions from '../../actions/main';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps.mainState) !== JSON.stringify(this.props.mainState);
    }

    render() {
        return ( 
            <section className="layout__main" >
                <h1 className="main__title">Welcome!</h1>
                <h2 className="main__desc">Let's build an awesome React APP!</h2>
                <Counter
                {...this.props.mainState}
                {...this.props.mainActions}
                />
            </section>
        );
    }
}

Main.propTypes = {
    mainState: PropTypes.object.isRequired,
    mainActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        mainState: state.main.toJS()
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mainActions: bindActionCreators(MainActions, dispatch)
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Main));
