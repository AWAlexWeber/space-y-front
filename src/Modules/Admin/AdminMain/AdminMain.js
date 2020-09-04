import React from 'react';
import ModuleDefault from '../../ModuleDefault';

// Components
import AdminTabs from './AdminTabs';

export default class AdminMain extends ModuleDefault {
    
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

                    <AdminTabs functionSet = {this.props.functionSet}/>
                    {this.renderLogOutButton()}
                </div>

                {this.renderBottomOptions()}
            </div>
        )
    }
}