import React from 'react';
import ModuleDefault from '../../ModuleDefault';

export default class OxyScrubMain extends ModuleDefault {
    
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

                    {this.renderLogOutButton()}
                </div>

                {this.renderBottomOptions()}
            </div>
        )
    }
}