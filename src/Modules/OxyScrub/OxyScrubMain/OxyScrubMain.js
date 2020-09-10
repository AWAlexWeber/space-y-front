import React from 'react';
import ModuleDefault from '../../ModuleDefault';

import VerticalTank from '../../Tools/VerticalTank';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFan } from '@fortawesome/free-solid-svg-icons'

import '../../../css/oxyscrub.css';

const FULL_URL = "http://localhost:5000"

export default class OxyScrubMain extends ModuleDefault {
    
    constructor(props) {
        super(props);
    }

    getModuleResource(resource) {
        var moduleInfo = this.props.functionSet['getState'](['systemStatus', 'modules', 'oxyscrub', 'resource']);
        var resourceLevel = moduleInfo['resourceLevels'][resource]
        var resourceCap = moduleInfo['resourceCaps'][resource]
        var percent = Math.round(resourceLevel / resourceCap * 100);
        return percent
    }

    getGlobalResource(resourceTitle) {
        var moduleInfo = this.props.functionSet['getState'](['systemStatus', 'resource']);
        var resource = moduleInfo['resourceLevels'][resourceTitle];
        var cap = moduleInfo['resourceCaps'][resourceTitle];
        var percent = Math.round(resource / cap * 100);
        return percent
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
                        <OxyScrubModule functionSet = {this.props.functionSet} id = {1} />
                        <OxyScrubModule functionSet = {this.props.functionSet} id = {2} />
                        <OxyScrubModule functionSet = {this.props.functionSet} id = {3} />
                        <OxyScrubModule functionSet = {this.props.functionSet} id = {4} />
                    </div>
                    <Paper className = "innerContainerRight" elevation = {20}>
                        <VerticalTank displayColor = {"#ecffff"} incrementAmount = {10} incrementMax = {100} percentFull={this.getGlobalResource('oxygen')} title = {'Oxygen'}/>
                        <VerticalTank displayColor = {"lightblue"} incrementAmount = {10} incrementMax = {100} percentFull={this.getModuleResource('power')} title = {'Power'}/>
                    </Paper>

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
        var spinClassName = "spinAirFilter"

        if (this.props.online == "Destroyed" || this.props.online == "Offline") {
            spinClassName = ""
        }

        return (
            <div className = "filterContainer">
                <div className = "filterContainerTitle">
                    Filter 
                </div>
                <div className = "filterTitle">
                    {this.props.data['title']}
                </div>
                <div className = {spinClassName +" filterIcon"}><FontAwesomeIcon icon={faFan} /></div>
                <div className = "filterDegredationLevel">{Math.round(this.props.data['filtrationLevel'])}%</div>
                <Button className = 'replaceFilterButton' variant="contained" color="primary">
                    Replace
                </Button>
            </div>
        )
    }
}

class OxyScrubModule extends React.Component {
    constructor(props) {
        super(props);
    }

    getThisData() {
        return this.props.functionSet['getState'](['systemStatus', 'modules', 'oxyscrub', this.props.id]);
    }

    onlineOxyScrub() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/oxyscrub/" + id + "/online", function() {console.log("Success")}, "GET", null);
    }

    offlineOxyScrub() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/oxyscrub/" + id + "/offline", function() {console.log("Success")}, "GET", null);
    }

    getResourceLevel(resourceName) {
        var moduleInfo = this.props.functionSet['getState'](['systemStatus', 'modules', 'oxyscrub']);
        var resource = moduleInfo[this.props.id]['resource']['resourceLevels'][resourceName];
        var cap = moduleInfo[this.props.id]['resource']['resourceCaps'][resourceName];
        var percent = Math.round(resource / cap * 100);
        return percent
    }

    getScrubData(id) {
        var filterID = 'filter-'+id;
        var sdata = this.props.functionSet['getState'](['systemStatus', 'modules', 'oxyscrub', this.props.id, filterID]);
        return sdata;
    }

    getOnlineState() {
        return this.props.functionSet['getState'](['systemStatus', 'modules', 'oxyscrub', this.props.id, 'status']);
    }

    render() {
        return (
            <Paper className = "oxyScrubContainer" elevation={20}>

                <div className = "oxyScrubTitle">Oxygen Scrubber #00{this.props.id}</div>
                <div className = "oxyScrubStatus">{this.getOnlineState()}</div>

                <div className = "oxyScrubFilterContainer">
                    <div className = "oxyScrubFilterContainerRow">
                        <OxyScrubFilter data = {this.getScrubData(0)} online = {this.getOnlineState()}/>
                        <OxyScrubFilter data = {this.getScrubData(1)} online = {this.getOnlineState()}/>
                    </div>
                </div>

                <div className = "oxyScrubEffTitle">Current Efficiency Level</div>
                <div className = "oxyScrubEfficiency">{this.getThisData()['filterLevel']}%</div>

                <div className = "oxyScrubEffTitle">Power Level</div>
                <div className = "oxyScrubEfficiency">{this.getResourceLevel('power')}%</div>

                <div className = "bottomButtonFinalHolder">
                    <Button className = 'oxyButton' variant="contained" color="primary" onClick = {() => {this.onlineOxyScrub()}}>
                        Online
                    </Button>
                    <Button className = 'oxyButton' variant="contained" color="primary" onClick = {() => {this.offlineOxyScrub()}}>
                        Offline
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