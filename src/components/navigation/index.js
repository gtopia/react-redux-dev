// Styles
import './index.scss';
// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
// Components
import { MAIN_URL } from '../../constants/app';

// Stateless functional components
let MoreTopic = () => {
    return ( 
        <Link to={MAIN_URL}>
            <div className="nav__more-topic"></div>
        </Link>
    );
};

class Navigation extends Component {
    constructor(props) {
        super(props);
        this._onNavItemsClick = ::this._onNavItemsClick;
    }

    _onNavItemsClick(e) {
        const { onNavItemsClick } = this.props;
        let nameIndexCombo = e.target.name.split('-'),
            name = nameIndexCombo[0],
            index = nameIndexCombo[1];

        onNavItemsClick(name, index);
    }

    render() {
        const { hasMoreTopic } = this.props;
        let moreTopicHtml = hasMoreTopic ? <MoreTopic/> : null;

        return (
            <header className="layout__header">
                <div className="nav__portrait-bg"></div>
                <div className="nav__portrait"></div>
                <div className="nav__logo"></div>
                { moreTopicHtml }
            </header>
        );
    }
}

Navigation.propTypes = {
    navItems: PropTypes.array.isRequired,
    hasMoreTopic: PropTypes.bool,
    onNavItemsClick: PropTypes.func,
    onLogoutHandler: PropTypes.func
};

Navigation.defaultProps = {
    hasMoreTopic: false,
    onNavItemsClick: () => {},
    onLogoutHandler: () => {}
};

export default Navigation;
