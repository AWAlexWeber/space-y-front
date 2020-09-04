import React from 'react';
import ModuleDefault from './ModuleDefault';
import Paper from '@material-ui/core/Paper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

import '../css/overview.css';
const FULL_URL = "http://165.22.83.88:5000"

export default class DefaultMain extends ModuleDefault {
    
    constructor(props) {
        super(props);

        this.getResourceLevel = this.getResourceLevel.bind(this);
    }
    
    renderFlightTime() {
        return (
            <div className = "flightTime">
                <div>T+ {this.props.time}</div>
            </div>
        )
    }

    getModuleState(module) {
        var status = this.props.functionSet.getState(['systemStatus', 'status', 'moduleStatus', module])
        if (status == null) {
            return "Offline";
        }
        return status;
    }

    /* Performing our constant engine API calls */
    componentDidMount() {
        this.props.functionSet['startIntervalUpdate']();
    }

    componentWillUnmount() {
        this.props.functionSet['stopIntervalUpdate']();
    }

    getLogs(module) {
        var logs = this.props.functionSet['getState'](['systemStatus', 'logs', module]);
        return logs;
    }

    getResourceLevel(resourceName) {
        var resource = this.props.functionSet['getState'](['systemStatus', 'resource', 'resourceLevels', resourceName]);
        var cap = this.props.functionSet['getState'](['systemStatus', 'resource', 'resourceCaps', resourceName]);
        var percent = Math.round(resource / cap * 100);
        return percent
    }

    render() {
        return (            
        <div>
            {this.renderMenuTitle()}

            <div className = "moduleOverviewContainer">
                <ModuleOverview logs = {this.getLogs("reactor")} module = "Reactor" powerLevel = {this.getResourceLevel('power')} coolantLevel = {0} moduleStatus = {this.getModuleState('reactor')}/>
                <ModuleOverview logs = {this.getLogs("coolant")} module = "Coolant" powerLevel = {0} moduleStatus = {this.getModuleState('coolant')}/>
                <ModuleOverview logs = {this.getLogs("thrusters")} module = "Thrusters" powerLevel = {0} coolantLevel = {0} heatLevel = {0} moduleStatus = {this.getModuleState('thrusters')}/>
                <ModuleOverview logs = {this.getLogs("oxyscrub")} module = "OxyScrub" powerLevel = {0} moduleStatus = {this.getModuleState('oxyscrub')} oxygenLevel = {0}/>
                <ModuleOverview logs = {this.getLogs("command")} module = "Command" powerLevel = {0} moduleStatus = {this.getModuleState('command')}/>
            </div>

            {this.renderFlightTime()}
        </div>
        )
    }
}

class ModuleOverview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let coolantPower = null;
        let oxygenLevel = null;
        let powerTitle = "Power";
        let thrusterheat = null;
        if (this.props.module == "Reactor" || this.props.module == "Thrusters") {
            coolantPower = <PowerLevel title = "Coolant" powerLevel = {this.props.coolantLevel}/>;
        }
        if (this.props.module == "OxyScrub")
            oxygenLevel = <PowerLevel title = "Ship Oxygen" powerLevel = {this.props.oxygenLevel} />;


        if (this.props.module == "Thrusters")
            thrusterheat = <ThrusterHeatLevel heatLevel = {0}/>;

        if (this.props.module == "Reactor")
            powerTitle = "Power Production"

        return (
            <Paper className = "moduleOverviewInnerContainer" elevation = {20}>
                    <div className = "moduleTitle">{this.props.module}</div>
                    <StatusIndicator status = {this.props.moduleStatus}/>
                    {thrusterheat}
                    <PowerLevel title = {powerTitle} powerLevel = {this.props.powerLevel}/>
                    {coolantPower}

                    <ActiveUser />
                    
                    {oxygenLevel}

                    <SystemLogs module = {this.props.module} logs = {this.props.logs}/>
            </Paper>
        )
    }
}

class StatusIndicator extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var statusColor = '#20ff20';
        if (this.props.status == "Warning")
            statusColor = "yellow";
        else if (this.props.status == "Error")
            statusColor = "#ff2020";
        else if (this.props.status == "Offline")
            statusColor = "#202020";

        var statusIndicatorLight = <div style = {{backgroundColor: statusColor}} className = "indicatorLight"></div>

        return (
            <div className = "statusIndicatorContainer">
                <div className = "statusIndicator" style = {{color: statusColor}}>
                    {this.props.status}
                </div>
                {statusIndicatorLight}
            </div>
        )
    }
}

class PowerLevel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var powerBarWidth = this.props.powerLevel + "%";
        var powerBar = <div style = {{width: powerBarWidth}} className = "powerLevelBarInternal"></div>;

        return (
            <div className = "powerLevelContainer">
                <div className = "powerLevelTitle">
                    {this.props.title} Level ({powerBarWidth})
                </div>
                <div className = "powerLevelBar">
                    {powerBar}
                </div>
                <div className = "powerLevelInfoContainer">
                    <div className = "powerAmount leftText">0%</div>
                    <div className = "powerAmount leftText">25%</div>
                    <div className = "powerAmount">50%</div>
                    <div className = "powerAmount rightText">75%</div>
                    <div className = "powerAmount rightText">100%</div>
                </div>
            </div>
        )
    }
}

class ActiveUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "activeUserContainer">
                <div className = "activeUserTitle">
                <FontAwesomeIcon icon={faUsers} /> Active User(s)

                    <div className = "activeUserListContainer">
                        <ActiveUserSlot />
                        <ActiveUserSlot />
                        <ActiveUserSlot />
                    </div>
                </div>
            </div>
        )
    }
}

class ActiveUserSlot extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var name = "Empty";
        var textColor = "#3f3f3f"
        if (this.props.activeUser != null) {
            textColor = "white";
            name = this.props.activeUser;
        }

        return (
            <div className = "userSlot" style = {{color: textColor}}>{name}</div>
        )
    }
}

class SystemLogs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var systemLogList = [];
        if (this.props.logs != undefined) {
            for (let i = this.props.logs.length - 1; i >= 0; i--) {
                var log = this.props.logs[i];
                systemLogList.push(<SystemLogLine type = {log[1]} module = {this.props.module} info = {log[0]} />);
            }
        }

        return (
            <div className = "syslogContainer">
                {systemLogList}
            </div>
        )
    }
}

class SystemLogLine extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var textColor = "white";
        if (this.props.type == -1)
            textColor = "#39ff14";
        else if (this.props.type == 1)
            textColor = "#ffff00";
        else if (this.props.type == 2)
            textColor = "#ff4040";

        return (
            <div style = {{color: textColor}} className = "syslogline">log@{this.props.module}: {this.props.info}</div>
        )
    }
}

class ThrusterHeatLevel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "thrusterHeatLevelContainer">
                <div className = "heatTitle">Heat Level</div>
                <div className = "heatAmount">{this.props.heatLevel}%</div>
            </div>
        )
    }
}