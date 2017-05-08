// Styles
import './index.scss';
// Libraries
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
// Components
import { MAIN_URL } from '../../constants/app';

// Stateless functional components
let HeaderLogo = () => {
    return ( 
        <Link to = { MAIN_URL } >
            <span className = "navigation__header-logo"> </span>
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
        const { hasLogo } = this.props;
        let headerLogoHtml = hasLogo ? <HeaderLogo / > : null;
        // let navItemsHtml = navItems.map((item, index) => {
        //     return (
        //         <Link to = { item.link }
        //         onlyActiveOnIndex = { item.link === '/main' }
        //         activeClassName = "navigation__link--active"
        //         key = { `navItem${index}` }
        //         name = { `${item.displayText}-${index}` }
        //         onClick = { this._onNavItemsClick.bind(this) } > { item.displayText } </Link>
        //     );
        // });

        return (
            <header className = "layout__header" >
                <div className = "layout__header-row">
                    <span> { headerLogoHtml } </span>
                    {
                    // <nav> { navItemsHtml } </nav> 
                    }
                </div>
            </header>
        );
    }
}

Navigation.propTypes = {
    navItems: PropTypes.array.isRequired,
    headerTitle: PropTypes.string,
    hasLogo: PropTypes.bool,
    onNavItemsClick: PropTypes.func,
    onLogoutHandler: PropTypes.func
};

Navigation.defaultProps = {
    headerTitle: '',
    hasLogo: false,
    onNavItemsClick: () => {},
    onLogoutHandler: () => {}
};

export default Navigation;
