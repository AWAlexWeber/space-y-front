import React from 'react';
import '../../../css/reactor.css';

import Paper from '@material-ui/core/Paper';
import VerticalTank from '../../Tools/VerticalTank';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'

const FULL_URL = "http://localhost:5000"

export default class ReactorOutputControl extends React.Component {
    
    constructor(props) {
        super(props);

        this.isBanned = this.isBanned.bind(this);
    }

    isBanned(module) {
        // Getting if a specific resource is currently banned
        var resourceData = this.props.functionSet['getState'](['systemStatus'])
        if (resourceData == undefined || resourceData == null)
            return false;
        else {
            resourceData = resourceData['resource'];
            var resourceBans = resourceData['resourceBans'][module];
            if (resourceBans == undefined || resourceBans["power"] == undefined) {
                return false;
            }
            else {
                var resourceStatus = resourceBans['power'];
                if (resourceStatus == undefined || resourceStatus == null || resourceStatus == false) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    }

    setBanned(resource, banStatus) {
        // Setting a resource to ban
        var refMe = this;
        if (banStatus)
            this.props.functionSet['performAPICall'](FULL_URL + "/engine/resource/ban", refMe.completeBanCallback, "POST", JSON.stringify({module: resource, resource: 'power'}));
        else 
            this.props.functionSet['performAPICall'](FULL_URL + "/engine/resource/unban", refMe.completeBanCallback, "POST", JSON.stringify({module: resource, resource: 'power'}));
    }

    completeBanCallback(result) {
        console.log("Success");
    }

    renderBan(resource, resourceTitle) {
        var getIsBanned = this.isBanned(resource);
        var renderBan = "Disabled";
        if (!getIsBanned) {
            renderBan = "Enabled";
        }

        var renderClass = "switch" + renderBan;

        return (
            <div className = {"switchContainerReactor " + renderClass} onClick = {() => {this.setBanned(resource, !getIsBanned)}}>
                <div className = "switchReactorTitle">{resourceTitle} Systems</div>
                <FontAwesomeIcon icon={faPowerOff} />
                <div className = "switchStatusTitle">{renderBan}</div>
            </div>
        )
    }

    render() {

        var internalCoolantLevel = this.props.functionSet['getState'](['systemStatus', 'modules', 'reactor', 'moduleCoolant'])
        var internalHeatLevel = this.props.functionSet['getState'](['systemStatus', 'modules', 'reactor', 'moduleHeat'])
        var globalPower = this.props.functionSet['getState'](['systemStatus', 'resource', 'resourceLevels', 'power'])
        globalPower = Math.round(globalPower / this.props.functionSet['getState'](['systemStatus', 'resource', 'resourceCaps', 'power']) * 100)

        return (
            <Paper className = "reactorOutputContorlContainer" elevation={20}>
                <div className = "reactorOutputControlSwitchContainer">
                    <div className = "switchContainerReactorMainTitle">Power Output Control</div>
                    
                    {this.renderBan("coolant", "Coolant")}
                    {this.renderBan("oxyscrub", "OxyScrub")}
                    {this.renderBan("thrusters", "Thrusters")}
                    {this.renderBan("command", "Command")}
                </div>
                <div className = "reactorOutputBarContainer">
                    <VerticalTank displayColor = {"lightblue"} incrementAmount = {10} incrementMax = {100} percentFull={globalPower} title = {'Battery'}/>
                    <VerticalTank displayColor = {"#e9b251"} incrementAmount = {20} incrementMax = {200} percentFull={internalHeatLevel} title = {'Heat'}/>
                    <VerticalTank displayColor = {"#5559b9"} incrementAmount = {10} incrementMax = {100} percentFull={internalCoolantLevel} title = {'Coolant'}/>
                </div>
            </Paper>
        )
    }
}