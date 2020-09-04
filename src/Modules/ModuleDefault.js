import React from 'react';

// Importing the login component
import LoginMain from './LoginMain';

import Logo from '../assets/img/spacex-logo-white.png';

import Button from '@material-ui/core/Button';

export default class ModuleDefault extends React.Component {
    
    constructor(props) {
        super(props);

        this.renderLogOutButton = this.renderLogOutButton.bind(this);
        this.performReboot = this.performReboot.bind(this);
    }

    /* * * * Fail render * * * */
    isFailRender() {
        if (this.isReboot()) {
            return true;
        }

        if (this.isModuleOffline()) {
            return true;
        }

        if (!this.isAccount()) {
            return true;
        }

        else {
            return false;
        }
    }

    failRender() {
        if (this.isReboot()) {
            return this.renderReboot();
        }

        if (this.isModuleOffline()) {
            return <Offline performReboot = {this.performReboot} functionSet = {this.props.functionSet} title = {this.props.title}/>;
        }

        if (!this.isAccount()) {
            return this.renderLogin();
        }
    }

    /* * * * * * * * * * */

    isModuleOffline() {
        var systemStatus = this.props.functionSet['getState'](['systemStatus'])
        var moduleStatus = systemStatus['status']['moduleStatus'][this.props.internTitle];
        if (moduleStatus == "Offline")
            return true;
        return false;
    }

    // Function that defines login
    isAccount() {
        if (this.props.functionSet['getState'](["accountToken"]) != null) {
            return true;
        }
        else {
            return false
        }
    }

    isReboot() {
        return (this.props.functionSet['getRebootStatus'](this.props.internTitle));
    }

    renderReboot() {
        return (
            <Reboot functionSet = {this.props.functionSet} title = {this.props.title}/>
        )
    }

    renderMenuTitle() {
        return (
            <div>
                <img src={Logo} className = "loginlogo" alt="Logo" />
                <div className = "form-title">{this.props.title}</div>
            </div>
        )
    }

    performReboot() {
        var rebootTime = this.props.functionSet['getState'](["rebootInfo"]);
        rebootTime = rebootTime[this.props.internTitle]['rebootTime'];
        this.props.functionSet['performReboot'](this.props.internTitle, rebootTime);
    }

    performLongReboot() {
        var rebootTime = this.props.functionSet['getState'](["rebootInfo"]);
        rebootTime = 3 * rebootTime[this.props.internTitle]['rebootTime'];
        this.props.functionSet['performReboot'](this.props.internTitle, rebootTime);
    }

    renderLogOutButton() {
        return (
            <div className = 'innerLogOutButtonContainer'>
                <Button className = 'bottomOptionsButton' variant="contained" color="primary" onClick ={() => {this.props.functionSet['modifyState']("accountToken", null)}}>
                    Log Out
                </Button>
                <Button className = 'bottomOptionsButton' variant="contained" color="primary" onClick ={() => {this.performReboot()}}>
                    Force Short Reboot
                </Button>
                <Button className = 'bottomOptionsButton' variant="contained" color="primary" onClick ={() => {this.performLongReboot()}}>
                    Force Long Reboot
                </Button>
            </div>
        )
    }

    renderBottomOptions() {
        return (
            <div className = "bottomOptions">
                <div>Current User: {this.props.functionSet['getState'](['accountToken'])}</div>
            </div>
        )
    }

    renderLogin() {
        return (
            <LoginMain module = {this.props.internTitle} title = {this.props.title} functionSet = {this.props.functionSet}/>
        )
    }
}

class Reboot extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Checking to see when the reboot completed
        var refMe = this;

        this.getStatusInterval = setInterval(function() {
            refMe.props.functionSet['getServerStatus']();
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.getStatusInterval);
    }

    render() {
        return (
            <div className = "rebootContainer">
                <img src={Logo} style = {{marginLeft: '10%', width: '50%'}} className = "loginlogo" alt="Logo" />
                <div className = "moduleTitleReboot">
                    {this.props.title}
                </div>
                <div className = "rebootext">
                    Rebooting...
                </div>
            </div>
        )
    }
}

class Offline extends React.Component {
    constructor(props) {
        super(props);

        this.forceReboot = this.forceReboot.bind(this);
    }

    componentDidMount() {
        // Checking to see when the reboot completed
        var refMe = this;

        this.getStatusInterval = setInterval(function() {
            refMe.props.functionSet['getServerStatus']();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.getStatusInterval);
    }

    forceReboot() {
        this.props.performReboot();
        var refMe = this;
        setTimeout(function() {
            refMe.props.functionSet['getServerStatus']();
        }, 500);
    }

    render() {
        return (
            <div className = "rebootContainer">
                <img src={Logo} style = {{marginLeft: '10%', width: '50%'}} className = "loginlogo" alt="Logo" />
                <div className = "moduleTitleReboot">
                    {this.props.title}
                </div>
                <div className = "rebootext">
                    SYSTEM OFFLINE
                </div>

                <Button className = 'forceOnlineButton' variant="contained" color="primary" onClick ={() => {this.forceReboot()}}>
                    Attempt Module Online
                </Button>
            </div>
        )
    }
}