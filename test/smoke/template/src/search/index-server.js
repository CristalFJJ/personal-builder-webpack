'use strict';

// import React from 'react';
// import ReactDom from 'react-dom';
// import largeNumber from 'add-big-number';
// import '../../common';
// import './search.less';
// import { a } from './tree-shaking';
// import logo from './images/favicon.png';

const React = require('react');
const largeNumber = require('add-big-number').default;
const logo = require('./images/favicon.png');
require('./search.less');

class Search extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            Text: null
        }
    }

    loadComponent() {
        import ('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            })
        });
    }

    render() {
        const { Text } = this.state;
        const addResult = largeNumber('999', '1');

        return <div className="search-text">
            {
                Text ? <Text /> : null
            }
            { addResult }
            搜索文字内 <img src={logo} onClick={this.loadComponent.bind(this)}/>
        </div>
    }
}

module.exports = <Search />;