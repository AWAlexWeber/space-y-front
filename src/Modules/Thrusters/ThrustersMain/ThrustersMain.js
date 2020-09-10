import React from 'react';
import ModuleDefault from '../../ModuleDefault';

import Thruster from '../../../assets/img/thruster.png';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import VerticalTank from '../../Tools/VerticalTank';

import '../../../css/thrusters.css';

const FULL_URL = "http://localhost:5000"

export default class ThrustersMain extends ModuleDefault {
    
    constructor(props) {
        super(props);
    }

    getModuleResource(resource) {
        var moduleInfo = this.props.functionSet['getState'](['systemStatus', 'modules', 'thrusters', 'resource']);
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

    getGlobalRaw(resourceTitle) {
        var moduleInfo = this.props.functionSet['getState'](['systemStatus', 'resource']);
        var resource = moduleInfo['resourceLevels'][resourceTitle];
        return resource
    }


    render() {
        if (this.isFailRender()) {
            return this.failRender();
        }

        var elevationWidth = this.getGlobalRaw("altitude")/1000/5
        if (elevationWidth > 90) {
            elevationWidth = 90;
        }
        elevationWidth = elevationWidth + "%"

        return (
            <div>
                {this.renderMenuTitle()}

                <div className = 'innerBodyMain'>

                    <div className = "upperContainer">
                        <div className = "thrusterLeftContainer">
                            <ThrusterControl functionSet = {this.props.functionSet} id = {1}/>
                            <ThrusterControl functionSet = {this.props.functionSet} id = {2}/>
                            <ThrusterControl functionSet = {this.props.functionSet} id = {1} type = {"main"} />
                            <ThrusterControl functionSet = {this.props.functionSet} id = {3}/>
                            <ThrusterControl functionSet = {this.props.functionSet} id = {4}/>
                        </div>

                        <Paper className = "thrusterRightContainer" elevation={20}>
                            <VerticalTank displayColor = {"lightblue"} incrementAmount = {10} incrementMax = {100} percentFull={this.getModuleResource('power')} title = {'Power'}/>
                            <VerticalTank displayColor = {"#e9b251"} incrementAmount = {20} incrementMax = {200} percentFull={this.getModuleResource('heat')} title = {'Heat'}/>
                            <VerticalTank displayColor = {"#5559b9"} incrementAmount = {10} incrementMax = {100} percentFull={this.getModuleResource('coolant')} title = {'Coolant'}/>
                        </Paper>
                    </div>

                    <div className = "bottomContainer">
                        <div className = "elevationBar">
                            <div className = "elevationLeft">0km</div>
                            <div className = "elevationBarInner">
                                <div className = "elevationFinal" style = {{width: elevationWidth}}></div>
                                    <div className = "currentElevation">Current Elevation {this.getGlobalRaw("altitude")/1000}km</div>
                                </div>
                            <div className = "elevationLeft">500km</div>
                        </div>
                    </div>

                    {this.renderLogOutButton()}
                </div>

                {this.renderBottomOptions()}
            </div>
        )
    }
}

class ThrusterControl extends React.Component {
    constructor(props) {
        super(props);
    }

    getThisData() {
        return this.props.functionSet['getState'](['systemStatus', 'modules', 'thrusters', this.props.id]);
    }

    getMainData() {
        return this.props.functionSet['getState'](['systemStatus', 'modules', 'thrusters']);
    }

    onlineThruster() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/thrusters/" + id + "/online", function() {console.log("Success")}, "GET", null);
    }

    offlineThruster() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/thrusters/" + id + "/offline", function() {console.log("Success")}, "GET", null);
    }

    getResourceLevel(resourceName) {
        var moduleInfo = this.props.functionSet['getState'](['systemStatus', 'modules', 'thrusters']);
        var resource = moduleInfo[this.props.id]['resource']['resourceLevels'][resourceName];
        var cap = moduleInfo[this.props.id]['resource']['resourceCaps'][resourceName];
        var percent = Math.round(resource / cap * 100);
        return percent
    }

    getOnlineState() {
        return this.props.functionSet['getState'](['systemStatus', 'modules', 'thrusters', this.props.id, 'status']);
    }

    forceNextAngle() {
        this.props.functionSet['performAPICall'](FULL_URL + "/thrusters/skipNextAngle/", function() {console.log("Success")}, "GET", null);
    }

    setThrusterMode(mode) {
        this.props.functionSet['performAPICall'](FULL_URL + "/thrusters/setMode/" + mode, function() {console.log("Success")}, "GET", null);
    }

    render() {

        if (this.props.type == "main")
            return (
                <Paper className = "thrusterControlContainer" elevation={20}>
                    <div className = "thrusterTitle">Control Thruster{this.props.id}</div>
                    <div className = "thrusterStatus">Online</div>
                    <img src={Thruster} className = "thrusterImg" alt="Logo" />
                    <div className = "thrusterAlignment">Current Angle: {Math.round(this.getMainData()['controlAngle'])} Degrees</div>

                    <Button className = 'thrusterOverrideButton' variant="contained" color="primary" onClick = {() => {this.forceNextAngle()}}>
                        Next Angle
                    </Button>

                    <div className = "thrusterModeTitle">Thruster Mode</div>
                    <div className = "thrusterMode">{this.getMainData()[this.props.id]['thrusterMode']}</div>

                    <Button className = 'thrusterPowerButton' variant="contained" color="primary" onClick = {() => {this.setThrusterMode('High')}}>
                        High-Power Mode
                    </Button>
                    <Button className = 'thrusterPowerButton' variant="contained" color="primary" onClick = {() => {this.setThrusterMode('Low')}}>
                        Low-Power Mode
                    </Button>
                </Paper>
            )

        return (
            <Paper className = "thrusterControlContainer" elevation={20}>
                <div className = "thrusterTitle">Thruster #00{this.props.id}</div>
                <div className = "thrusterStatus">{this.getThisData()['status']}</div>
                <img src={Thruster} className = "thrusterImg" alt="Logo" />
                <div className = "thrusterAlignment">Current Angle: {this.getThisData()['thrusterAngle']} Degrees</div>
                <div className = "thrusterEfficiency">Efficiency: 100%</div>

                <Button className = 'thrusterButton' variant="contained" color="primary" onClick = {() => {this.onlineThruster()}}>
                    Online
                </Button>
                <Button className = 'thrusterButton' variant="contained" color="primary" onClick = {() => {this.offlineThruster()}}>
                    Offline
                </Button>
                <Button className = 'thrusterButton' variant="contained" color="primary">
                    Fix
                </Button>
                <Button className = 'thrusterOverrideButton' variant="contained" color="primary" onClick = {() => {this.props.functionSet['performManualOverrideFunction']('reactor', this.props.id, 'reactor-' + this.props.id)}}>
                    Override
                </Button>
            </Paper>
        )
    }
}