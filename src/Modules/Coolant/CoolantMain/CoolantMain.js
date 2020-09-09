import React from 'react';
import ModuleDefault from '../../ModuleDefault';

import '../../../css/coolant.css';

import VerticalTank from '../../Tools/VerticalTank';
import CoolantOutputControl from './CoolantOutputControl';

import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const FULL_URL = "http://localhost:5000"

export default class CoolantMain extends ModuleDefault {
    
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
                    <div className = "coolantInnerContainer">
                        <div className = "coolantLeftContainer">
                            <div className = "coolantTopRow">
                                <CoolantController functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {1}/>
                                <CoolantController functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {2}/>
                            </div>
                            <div className = "coolantBottomRow">
                                <CoolantController functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {3}/>
                                <CoolantController functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {4}/>
                            </div>
                        </div>
                        <Paper className = "coolantRightContainer" elevation={20}>
                            <CoolantOutputControl functionSet = {this.props.functionSet} stateValues = {this.props.stateValues}/>
                            <VerticalTank displayColor = {"#ecffff"} incrementAmount = {10} incrementMax = {100} percentFull={55} title = {'Oxygen'}/>
                            <VerticalTank displayColor = {"#5559b9"} incrementAmount = {10} incrementMax = {100} percentFull={15} title = {'Coolant'}/>
                            <VerticalTank displayColor = {"lightblue"} incrementAmount = {10} incrementMax = {100} percentFull={35} title = {'Power'}/>
                        </Paper>
                    </div>
                    {this.renderLogOutButton()}
                </div>

                {this.renderBottomOptions()}
            </div>
        )
    }
}

class CoolantController extends ModuleDefault {
    constructor(props) {
        super(props);

        this.state = {
            coolantSliderValue: 10
        }

        this.handleSliderChange = this.handleSliderChange.bind(this);
    }

    handleSliderChange(event, value) {
        this.setState({coolantSliderValue: value});
    }

    onlineCoolant() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/coolant/" + id + "/online", function() {console.log("Success")}, "GET", null);
    }

    offlineCoolant() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/coolant/" + id + "/offline", function() {console.log("Success")}, "GET", null);
    }

    refillCoolant() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/coolant/" + id + "/refill", function() {console.log("Success")}, "GET", null);
    }

    getResourceLevel(resourceName) {
        var moduleInfo = this.props.functionSet['getState'](['systemStatus', 'modules', 'coolant']);
        console.log(moduleInfo, this.props.id);
        var resource = moduleInfo[this.props.id]['resource']['resourceLevels'][resourceName];
        var cap = moduleInfo[this.props.id]['resource']['resourceCaps'][resourceName];
        var percent = Math.round(resource / cap * 100);
        console.log(resource,cap,percent);
        return percent
    }

    render() {
        var spinAmount = "spin_" + this.state.coolantSliderValue;

        var oxyFull = this.getResourceLevel('oxygen');
        var powerFull = this.getResourceLevel('power');
        var deutLevel = this.getResourceLevel('deuterium');

        return (
            <Paper className = "coolantControllerContainer" elevation={20}>
                <div className = "coolantControlLeftSide">
                    <div className = "coolantCurrentSpeed">{this.state.coolantSliderValue}</div>
                    <div className = {spinAmount +" coolantSpinnerContainer"}>
                        <div className = "coolantSpinner"></div>
                    </div>
                    <Typography id="discrete-slider" gutterBottom>
                        New Speed: {this.state.coolantSliderValue}
                    </Typography>
                    <Slider value = {this.state.coolantSliderValue} onChange={this.handleSliderChange} className = "coolantLevelSlider" defaultValue={this.state.coolantSliderValue} aria-labelledby="discrete-slider" valueLabelDisplay="auto" step={10} marks min={10} max={50}/>
                    <Button className = "setCoolantSpeedButton">Set New Speed</Button>
                </div>
                <div className = "coolantControlCenter">
                    <div className = "coolantCentralTitle">
                        Coolant Reactor #00{this.props.id}
                    </div>
                    <Button className = 'coolantButton' variant="contained" color="primary" onClick = {() => {this.onlineCoolant()}}>
                        Online
                    </Button>
                    <Button className = 'coolantButton' variant="contained" color="primary" onClick = {() => {this.offlineCoolant()}}>
                        Offline
                    </Button>
                    <Button className = 'coolantButton' variant="contained" color="primary" onClick = {() => {this.refillCoolant()}}>
                        Refill
                    </Button>
                    <Button className = 'coolantButton' variant="contained" color="primary">
                        Fix
                    </Button>
                    <Button className = 'coolantOverrideButton' variant="contained" color="primary" onClick = {() => {this.props.functionSet['performManualOverrideFunction']('coolant', this.props.id, 'coolant-' + this.props.id)}}>
                        Override
                    </Button>
                </div>

                <div className = "coolantControlRight">
                    <VerticalTank displayColor = {"#ecffff"} incrementAmount = {10} incrementMax = {100} percentFull={oxyFull} title = {'Oxygen'}/>
                    <VerticalTank displayColor = {"lightblue"} incrementAmount = {10} incrementMax = {100} percentFull={powerFull} title = {'Power'}/>
                    <VerticalTank displayClass = "reactorDeuterium" displayColor = {"purple"} incrementAmount = {10} incrementMax = {100} percentFull={deutLevel} title = {'Deuterium'}/>
                </div>
            </Paper>
        )
    }
}