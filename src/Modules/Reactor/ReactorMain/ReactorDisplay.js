import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import _ from 'lodash';

const FULL_URL = "http://localhost:5000"

export default class ReactorDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Do not render anything if states are equal
        var isNextStateSame = _.isEqual(this.state, nextState);
        var isNextPropsSame = _.isEqual(nextProps, this.props);
        return !isNextStateSame || !isNextPropsSame;
    }
    
    onlineReactor() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/reactor/" + id + "/online", function() {console.log("Success")}, "GET", null);
    }

    offlineReactor() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/reactor/" + id + "/offline", function() {console.log("Success")}, "GET", null);
    }

    refillReactor() {
        var id = this.props.id;
        this.props.functionSet['performAPICall'](FULL_URL + "/reactor/" + id + "/refill", function() {console.log("Success")}, "GET", null);
    }

    render() {
        var data = this.props.reactorData;

        var status = "Offline";
        var tritLevel = "0";
        var deutLevel = "0";
        var heatResourceLevel = "0%";
        var coolantResourceLevel = "0%";

        if (data != undefined) {
            var rData = data[this.props.id];

            status = rData["status"]
            var trit = rData["resource"]["resourceLevels"]["tritium"]
            var deut = rData["resource"]["resourceLevels"]["deuterium"]

            var tritCap = rData["resource"]["resourceCaps"]["tritium"]
            var deutCap = rData["resource"]["resourceCaps"]["deuterium"]

            tritLevel = Math.round(trit / tritCap * 100)
            deutLevel = Math.round(deut / deutCap * 100)

            var inHeatLevel = rData["resource"]["resourceLevels"]["heat"]
            heatResourceLevel = Math.round(inHeatLevel) + "%";

            var inCoolantLevel = rData["resource"]["resourceLevels"]["coolant"]
            var inCoolantCap = rData["resource"]["resourceCaps"]["coolant"]
            coolantResourceLevel = Math.round(inCoolantLevel / inCoolantCap * 100) + "%";
        }

        if (status == "Destroyed") {
            return (
                <Paper className = "reactorDisplayContainer" elevation={20}>
                    <div className = "reactorDisplayContainerTitle">Fusion Reactor</div>
                    <div className = "reactorDisplayInnerTitle">#00{this.props.id}</div>

                    <div className = "destroyedTitle">Destroyed</div>
                </Paper>
            )
        }

        return (
            <Paper className = "reactorDisplayContainer" elevation={20}>
                <div className = "reactorDisplayContainerTitle">Fusion Reactor</div>
                <div className = "reactorDisplayInnerTitle">#00{this.props.id}</div>

                <div className = "reactorTankHolder">
                    <ReactorTank type = {"Tritium"} percentFull = {tritLevel + '%'}/>
                    <ReactorTank type = {"Deuterium"} percentFull = {deutLevel + '%'}/>
                </div>

                <div className = "reactorStatusHolder">
                    Reactor: {status}
                </div>

                <div className = "coolantLevelContainer">
                    <div className = "coolantLevelTitle">Heat</div>
                    <div className = "levelContainerValue">{heatResourceLevel}</div>
                    <div className = "coolantLevelTitle">Coolant</div>
                    <div className = "levelContainerValue">{coolantResourceLevel}%</div>
                </div>

                <Button className = 'reactorButton' variant="contained" color="primary" onClick = {() => {this.onlineReactor()}}>
                    Online
                </Button>
                <Button className = 'reactorButton' variant="contained" color="primary" onClick = {() => {this.offlineReactor()}}>
                    Offline
                </Button>
                <Button className = 'reactorButton' variant="contained" color="primary" onClick = {() => {this.refillReactor()}}>
                    Refill Tanks
                </Button>
                <Button className = 'reactorButton' variant="contained" color="primary">
                    Fix
                </Button>
                <Button className = 'reactorOverrideButton' variant="contained" color="primary" onClick = {() => {this.props.functionSet['performManualOverrideFunction']('reactor', this.props.id, 'reactor-' + this.props.id)}}>
                    Override
                </Button>
            </Paper>
        )
    }
}

class ReactorTank extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var additionalClass = "reactorDeuterium";
        if (this.props.type == "Tritium")
            additionalClass = "reactorTritium"

        return (
            <div className = "reactorTankContainer">
                <div className = "reactorContainerTitle">{this.props.type}</div>
                <div className = "reactorContainerFillLevel">{this.props.percentFull}</div>
                <div className = "reactorTankGlass">
                    <div style = {{height: this.props.percentFull}} className = {additionalClass +" reactorTankFill"}></div>
                </div>
            </div>
        )
    }
}