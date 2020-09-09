import React from 'react';
import '../../../css/reactor.css';
import '../../../css/coolant.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'

const FULL_URL = "http://localhost:5000"

export default class CoolantOutputControl extends React.Component {

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
            if (resourceBans == undefined || resourceBans["coolant"] == undefined) {
                return false;
            }
            else {
                var resourceStatus = resourceBans['coolant'];
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
            this.props.functionSet['performAPICall'](FULL_URL + "/engine/resource/ban", refMe.completeBanCallback, "POST", JSON.stringify({module: resource, resource: 'coolant'}));
        else 
            this.props.functionSet['performAPICall'](FULL_URL + "/engine/resource/unban", refMe.completeBanCallback, "POST", JSON.stringify({module: resource, resource: 'coolant'}));
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

        return (
            <div className = "reactorOutputControlSwitchContainer">
                <div className = "switchContainerReactorMainTitle">Power Output Control</div>
                
                {this.renderBan("reactor", "Reactor")}
                {this.renderBan("thrusters", "Thrusters")}
            </div>
        );
    }
}