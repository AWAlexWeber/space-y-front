import React from 'react';
import ModuleDefault from '../../ModuleDefault';
import ReactorDisplay from './ReactorDisplay';

import '../../../css/reactor.css';

export default class ReactorMain extends ModuleDefault {
    
    constructor(props) {
        super(props);
    }

    render() {
        if (this.isFailRender()) {
            return this.failRender();
        }

        return (
            <div>
                {this.renderMenuTitle()}

                <div className = 'innerBodyMain'>
                    <div className = 'reactorDisplayList'>
                        <ReactorDisplay id = {1}/>
                        <ReactorDisplay id = {2}/>
                        <ReactorDisplay id = {3}/>
                        <ReactorDisplay id = {4}/>
                        <ReactorDisplay id = {5}/>
                    </div>

                    {this.renderLogOutButton()}
                </div>

                {this.renderBottomOptions()}
            </div>
        )
    }
}