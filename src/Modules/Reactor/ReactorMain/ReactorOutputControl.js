import React from 'react';
import '../../../css/reactor.css';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const FULL_URL = "http://165.22.83.88:5000"

export default class ReactorOutputControl extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Paper className = "reactorOutputContorlContainer" elevation={20}>
                <div className = "reactorOutputControlSwitchContainer">

                </div>
                <div className = "reactorOutputControlSwitchContainer">
                    
                </div>
            </Paper>
        )
    }
}