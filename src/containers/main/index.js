// Styles
import './index.css';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import Navigation from '../../components/navigation';

import * as DemoActions from '../../actions/demo';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            navHeaderTitle,
            navItems,
            hasLogo
        } = this.props.mainState;

        return ( 
            <section className = "mdl-layout mdl-js-layout" >
                <Navigation headerTitle = { navHeaderTitle }
                    navItems = { navItems }
                    hasLogo = { hasLogo }/> 
                <main className = "mdl-layout__content" >
                    <div className = "page-content" > { this.props.children } </div> 
                </main>
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
        mainActions: bindActionCreators({}, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);
