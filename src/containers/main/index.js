// Styles
import './index.css';
// React & Redux
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Components
import Navigation from '../../components/navigation';

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
            <section>
                <Navigation headerTitle = { navHeaderTitle } navItems = { navItems } hasLogo = { hasLogo }/> 
                <main>
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
