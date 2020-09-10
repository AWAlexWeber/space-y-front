import React from 'react';
import ModuleDefault from './ModuleDefault';
import Paper from '@material-ui/core/Paper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

import '../css/overview.css';
const FULL_URL = "http://localhost:5000"

export default class DefaultMain extends ModuleDefault {
    
    constructor(props) {
        super(props);

        this.state = {
            timeNow: new Date()
        }

        this.getResourceLevel = this.getResourceLevel.bind(this);
        this.getReactorInternalResourceLevel = this.getReactorInternalResourceLevel.bind(this);
    }
    
    renderFlightTime() {
        // Calculating the time
        var nowTime = this.state.timeNow;

        // Unless we are in a meeting...
        if (this.props.functionSet['getState'](['systemStatus','meeting','isMeeting'])) {
            nowTime = this.props.functionSet['getState'](['systemStatus','meeting','meetingTime'])
            nowTime = new Date(nowTime.replaceAll('"', ''));
        }

        var meetingMS = this.props.functionSet['getState'](['systemStatus','meeting','meetingMS'])
        var difference_ms = Math.abs(nowTime - this.props.time) - meetingMS;

        var total_seconds = Math.floor(difference_ms / 1000) % 60;
        var total_minutes = Math.floor(difference_ms / 60 / 1000) % 60;
        var total_hours = Math.floor(difference_ms / 60 / 60 / 1000);

        if (total_seconds < 10) {
            total_seconds = '0' + total_seconds;
        }

        if (total_minutes < 10) {
            total_minutes = '0' + total_minutes;
        }

        var timeVar = total_hours + ":" + total_minutes + ":" + total_seconds;

        return (
            <div className = "flightTime">
                <div>T+ {timeVar}</div>
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
        var refMe = this;
        this.renderInterval = setInterval(function() {
            refMe.setState({timeNow: new Date()});
        }, 100);
    }

    componentWillUnmount() {
        this.props.functionSet['stopIntervalUpdate']();
        clearInterval(this.renderInterval);
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

    getInternalResourceLevel(moduleName, resourceName) {
        var resource = this.props.functionSet['getState'](['systemStatus', 'modules', moduleName, 'resource', 'resourceLevels', resourceName]);
        var cap = this.props.functionSet['getState'](['systemStatus', 'modules', moduleName, 'resource', 'resourceCaps', resourceName]);
        var percent = Math.round(resource / cap * 100);
        return percent
    }

    getReactorInternalResourceLevel(resourceName) {
        var resource = this.props.functionSet['getState'](['systemStatus', 'modules', 'reactor', resourceName]);
        return resource
    }

    render() {
        return (            
        <div>
            {this.renderMenuTitle()}

            <div className = "moduleOverviewContainer">
                <ModuleOverview logs = {this.getLogs("reactor")} heatLevel = {this.getReactorInternalResourceLevel('moduleHeat')} module = "Reactor" powerLevel = {this.getResourceLevel('power')} coolantLevel = {this.getReactorInternalResourceLevel('moduleCoolant')} moduleStatus = {this.getModuleState('reactor')}/>
                <ModuleOverview logs = {this.getLogs("coolant")} heatLevel = {0} module = "Coolant" powerLevel = {this.getInternalResourceLevel('coolant','power')} moduleStatus = {this.getModuleState('coolant')}/>
                <ModuleOverview logs = {this.getLogs("thrusters")} module = "Thrusters" powerLevel = {this.getInternalResourceLevel('thrusters','power')} coolantLevel = {this.getInternalResourceLevel('thrusters','coolant')} heatLevel = {this.getInternalResourceLevel('thrusters','heat')} moduleStatus = {this.getModuleState('thrusters')}/>
                <ModuleOverview logs = {this.getLogs("oxyscrub")} module = "OxyScrub" powerLevel = {this.getInternalResourceLevel('oxyscrub','power')} moduleStatus = {this.getModuleState('oxyscrub')} oxygenLevel = {this.getResourceLevel('oxygen')}/>
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


        if (this.props.module == "Thrusters" || this.props.module == "Reactor")
            thrusterheat = <ThrusterHeatLevel heatLevel = {this.props.heatLevel}/>;

        if (this.props.module == "Reactor")
            powerTitle = "Power Production"

        return (
            <Paper className = "moduleOverviewInnerContainer" elevation = {20}>
                    <div className = "moduleTitle">{this.props.module}</div>
                    <StatusIndicator status = {this.props.moduleStatus}/>
                    <PowerLevel title = {powerTitle} powerLevel = {this.props.powerLevel}/>
                    {coolantPower}

                    {oxygenLevel}

                    {thrusterheat}

                    <ActiveUser />

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