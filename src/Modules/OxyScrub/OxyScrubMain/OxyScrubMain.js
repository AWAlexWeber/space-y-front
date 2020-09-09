import React from 'react';
import ModuleDefault from '../../ModuleDefault';

import VerticalTank from '../../Tools/VerticalTank';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFan } from '@fortawesome/free-solid-svg-icons'

import '../../../css/oxyscrub.css';

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

                    <div className = "innerContainerLeft">
                        <OxyScrubModule id = {1} />
                        <OxyScrubModule id = {2} />
                        <OxyScrubModule id = {3} />
                        <OxyScrubModule id = {4} />
                    </div>
                    <div className = "innerContainerRight">

                    </div>

                    {this.renderLogOutButton()}
                </div>

                {this.renderBottomOptions()}
            </div>
        )
    }
}

class OxyScrubFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "filterContainer">
                <div className = "filterContainerTitle">
                    Filter AF03
                </div>
                <div className = "filterIcon"><FontAwesomeIcon icon={faFan} /></div>
            </div>
        )
    }
}

class OxyScrubModule extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Paper className = "oxyScrubContainer" elevation={20}>

                <div className = "oxyScrubTitle">Oxygen Scrubber #00{this.props.id}</div>
                <div className = "oxyScrubStatus">Online</div>

                <div className = "oxyScrubFilterContainer">
                    <div className = "oxyScrubFilterContainerRow">
                        <OxyScrubFilter />
                        <OxyScrubFilter />
                    </div>
                    <div className = "oxyScrubFilterContainerRow">
                        <OxyScrubFilter />
                        <OxyScrubFilter />
                    </div>
                </div>

                <div className = "oxyScrubEffTitle">Current Efficiency Level</div>
                <div className = "oxyScrubEfficiency">100%</div>

                <div className = "bottomButtonFinalHolder">
                    <Button className = 'oxyButton' variant="contained" color="primary" onClick = {() => {this.onlineCoolant()}}>
                        Online
                    </Button>
                    <Button className = 'oxyButton' variant="contained" color="primary" onClick = {() => {this.offlineCoolant()}}>
                        Offline
                    </Button>
                    <Button className = 'oxyButton' variant="contained" color="primary" onClick = {() => {this.refillCoolant()}}>
                        Refill
                    </Button>
                    <Button className = 'oxyButton' variant="contained" color="primary">
                        Fix
                    </Button>
                    <Button className = 'oxyOverrideButton' variant="contained" color="primary" onClick = {() => {this.props.functionSet['performManualOverrideFunction']('coolant', this.props.id, 'coolant-' + this.props.id)}}>
                        Override
                    </Button>
                </div>
            </Paper>
        )
    }
}