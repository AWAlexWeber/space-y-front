import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


// Importing the components
import DefaultMain from './Modules/DefaultMain';
import AdminMain from './Modules/Admin/AdminMain/AdminMain';
import CommandMain from './Modules/Command/CommandMain/CommandMain';
import CoolantMain from './Modules/Coolant/CoolantMain/CoolantMain';
import OxyScrubMain from './Modules/OxyScrub/OxyScrubMain/OxyScrubMain';
import ReactorMain from './Modules/Reactor/ReactorMain/ReactorMain';
import ThrustersMain from './Modules/Thrusters/ThrustersMain/ThrustersMain';

import PopUp from './Modules/PopUp';

import Logo from './assets/img/spacex-logo-white.png';
import './css/main.css';

const FULL_URL = "http://localhost:5000"

export default class App extends React.Component {

    constructor(props) {
        super(props);

        let stateValues = {'time': '00:00:00', 'systemStatus': []};

        this.state = {
            'stateValues': stateValues,
            'fadeIn': false,
            'fadeOut': false,
            'popupOpen': false,
            'popupContent': null,

            'initializedState': false,
            'initializedStatus': 'Starting...'
        };

        this.getState = this.getState.bind(this);
        this.modifyState = this.modifyState.bind(this);
        this.attemptLogin = this.attemptLogin.bind(this);
        this.loadPopup = this.loadPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.validateLoginCredential= this.validateLoginCredential.bind(this);
        this.validateCallback = this.validateCallback.bind(this);
        this.performReboot = this.performReboot.bind(this);
        this.getRebootStatus = this.getRebootStatus.bind(this);
        this.getServerStatus = this.getServerStatus.bind(this);
        this.getServerStatusCallback = this.getServerStatusCallback.bind(this);
        this.rebootCallback = this.rebootCallback.bind(this);
        this.startIntervalUpdate = this.startIntervalUpdate.bind(this);
        this.stopIntervalUpdate = this.stopIntervalUpdate.bind(this);
        this.setPopupContent = this.setPopupContent.bind(this);
        this.attemptHack = this.attemptHack.bind(this);
        this.completeHack = this.completeHack.bind(this);
        this.handleStatusAdvancedAllCallback = this.handleStatusAdvancedAllCallback.bind(this);
        this.performManualOverrideFunction = this.performManualOverrideFunction.bind(this);

        this.performManualOverrideAPICall = this.performManualOverrideAPICall.bind(this);
        this.performManualOverrideCallback = this.performManualOverrideCallback.bind(this);
        this.performManualOverrideFunction = this.performManualOverrideFunction.bind(this);
    }

    /* * * * Startup Sequencing * * * */
    componentDidMount() {
        var refMe = this;
        setTimeout(function() {
            refMe.getServerStatus();
            refMe.startIntervalUpdate();
        }, 5000);
    }

    getServerStatus() {
        this.performAPICall(FULL_URL + "/engine/statusAdvancedAll", this.getServerStatusCallback, "GET", null)
    }

    getServerStatusCallback(result) {
        if (result['data'] == undefined) {
            this.setState({initializedStatus: "Offline"});
            return;
        }

        if (result['data']['status']['engineStatus'] == "Online") {
            this.setState({initializedStatus: "Connection Established"});

            var refMe = this;
            
            // Getting additional information...
            this.modifyState('rebootInfo', result['data']['reboot'])
            this.modifyState('systemStatus', result['data'])

            setTimeout(function() {
                refMe.setState({initializedState: true})
            }, 500);
        }
    }

    /* * * * * Interval-based system update * * * * */
    startIntervalUpdate() {
        // Don't do anything if we are already updating at interval
        console.log("Starting interval update");
        var refMe = this;
        this.stopIntervalUpdate();
        this.intervalUpdate = setInterval(function() {
            refMe.performAPICall(FULL_URL + "/engine/statusAdvancedAll", refMe.handleStatusAdvancedAllCallback, "GET", null);
        }, 500);
    }

    handleStatusAdvancedAllCallback(result) {
        // We will skip invalid results
        if (result == null || result == undefined)
            return;
        else {
            this.modifyState("systemStatus", result['data']);
        }
    }

    stopIntervalUpdate() {
        clearInterval(this.intervalUpdate);
    }

    /* * * * * * State Management * * * * * */
    // Tools for directly accessing the state of the game
    getState(keyList) {

        // Checking if it exists
        var currentData = this.state.stateValues;
        var i = 0
        var key = keyList[i];
        while (i < keyList.length && key != null) {
            key = keyList[i];
            if (key in currentData) {
                currentData = currentData[key];
            }
            else {
                return null;
            }
            i = i + 1;
        }
        return currentData;
    }

    modifyState(key, value) {
        let tempState = JSON.parse(JSON.stringify(this.state.stateValues));
        tempState[key] = value;

        this.setState({stateValues: tempState});
    }

    // Working in tandem with modify state to ensure that we do not re-render everything if we're just loading the exact same state in
    // This is most relevant when continuously making the same api calls
    shouldComponentUpdate(nextProps, nextState) {
        // Do not render anything if states are equal
        var isNextStateSame = _.isEqual(this.state, nextState);
        var isNextPropsSame = _.isEqual(nextProps, this.props);
        var shouldRender = !isNextStateSame || !isNextPropsSame;
        return shouldRender;
    }

    attemptLogin(username, password, module) {
        if(username.length <= 0 || password.length <= 0)
            this.failLogin();

        // Allow game master login
        else {
            this.validateLoginCredential(username, password, module)
        }
    }

    attemptHack(username, module) {
        var refMe = this;
        this.performAPICall(FULL_URL + "/cred/hack", refMe.completeHack, "POST", JSON.stringify({username, module}));
    }

    completeHack(result) {
        if (result['code'] == 200) {
            this.modifyState('accountToken', result['data']);
        }
    }

    randomString() {
        var len = 16;
        var arr='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        var ans = ''; 
        for (var i = len; i > 0; i--) { 
            ans += arr[Math.floor(Math.random() * arr.length)]; 
        } 
        return ans; 
    }

    failLogin() {
        let content = 
        <div>
            <div className = "popupTitle">Error</div>
            <div className = "popupInfo">Invalid login credentials!</div>
        </div>;

        this.setState({popupContent: content});
        this.loadPopup();
    }

    validateLoginCredential(username, password, module) {
        
        // Making a get check against our credentials server
        var refMe = this;
        this.performAPICall(FULL_URL + "/cred/validate", refMe.validateCallback, "POST", JSON.stringify({username, password, module}));
        return false;
    }

    validateCallback(result) {
        if (result['data']['valid']) {
            var accountToken = result['data']['username'];
            console.log(accountToken);
            this.modifyState('accountToken', accountToken)
        }
        else {
            this.failLogin();
        }
    }

    performAPICall(url, callback, type, parameters) {
        fetch(url, {method: type, body: parameters})
        .then(res => res.json())
        .then((result) => {
            callback(result)
        },
        (error) => {
            console.log(error);
            callback(error)
        });
    }

    handleAPICall(result) {
    }

    /* * * * * * End States * * * * * */

    /* * * * * Pop-up loader * * * * */
    loadPopup() {
        this.setState({popupOpen: true})
    }

    
    closePopup() {
        this.setState({popupOpen: false});
    }

    setPopupContent(content) {
        this.setState({popupContent: content});
    }

    /* * * * Reboot * * * */
    performReboot(module, rebootTime) {

        // Setting timeout to finish reboot
        var refMe = this;
        this.performAPICall(FULL_URL + "/" + module + "/reboot", refMe.rebootCallback, "POST", JSON.stringify({rebootTime: rebootTime}));
    }

    rebootCallback(result) {
        // Getting additional information...
        var rebootInfo = result['data'];
        this.modifyState('rebootInfo', rebootInfo)
    }

    getRebootStatus(module) {
        // Checking for the module within our state data
        var rebootInfo = this.getState(['rebootInfo']);
        var rebootModuleStatus = rebootInfo[module]['rebootStatus'];
        return rebootModuleStatus;
    }

    performManualOverrideAPICall(url) {
        this.performAPICall(url, this.performManualOverrideCallback, "GET", null);
        this.closePopup();
    }

    performManualOverrideCallback(result) {
        console.log(result);
    }

    performManualOverrideFunction(module, subModule, subModuleTitle) {
        this.stopIntervalUpdate();

        var fullURL = FULL_URL + "/" + module + "/" + subModule + "/override";

        // Showing manual override popup
        var subModuleRender = null;
        if (subModule != undefined && subModule.length > 0)
            subModuleRender = <div className = "overrideTitleSubmodule">Submodule {subModuleTitle}</div>;

        this.setPopupContent(
        <div className = "overrideContainer">
            <div className = "overrideTitle">Manual Override Command for {module}</div>
            {subModuleRender}
            <div className = "overrideInputField">
                <TextField className = "overrideInput"></TextField>
            </div>
            <Button onClick = {() => {this.performManualOverrideAPICall(fullURL)}}className = "overrideButton" variant="contained" color="primary">Override</Button>
        </div>
        );

        // Loading popup
        this.loadPopup()
    }
    

    render() {

        // Returning an empty initialization screen if there is not been a system connection established yet
        if (!this.state.initializedState) {
            return (
                <Initializing status = {this.state.initializedStatus} />
            )
        }
        
        const functionSet = {
            'getState': this.getState,
            'modifyState': this.modifyState,
            'loadPopup': this.loadPopup,
            'attemptLogin': this.attemptLogin,
            'performAPICall': this.performAPICall,
            'failLogin': this.failLogin,
            'performReboot': this.performReboot,
            'getRebootStatus': this.getRebootStatus,
            'getServerStatus': this.getServerStatus,
            'stopIntervalUpdate': this.stopIntervalUpdate,
            'startIntervalUpdate': this.startIntervalUpdate,
            'setPopupContent': this.setPopupContent,
            'attemptHack': this.attemptHack,
            'performManualOverrideFunction': this.performManualOverrideFunction
        }

        // Time
        var timeVar = '';
        if (this.state.stateValues.systemStatus != undefined) {
            var timeVar = new Date(this.state.stateValues.systemStatus.time.replaceAll('"', ''));
        }

        let routerViews = [
            <DefaultMain time = {timeVar} title = {"Systems Overview"} functionSet = {functionSet} stateValues = {this.state.stateValues}/>,
            <AdminMain internTitle = {'admin'} title = {"Administration Portal"} functionSet = {functionSet} stateValues = {this.state.stateValues}/>,
            <CommandMain internTitle = {'command'} title = {"Command Module"} functionSet = {functionSet} stateValues = {this.state.stateValues}/>,
            <CoolantMain internTitle = {'coolant'} title = {"Primary Coolant Plant"} functionSet = {functionSet} stateValues = {this.state.stateValues}/>,
            <OxyScrubMain internTitle = {'oxyscrub'} title = {"AFS Oxygenic Scrubber Module"} functionSet = {functionSet} stateValues = {this.state.stateValues}/>,
            <ReactorMain internTitle = {'reactor'} title = {"Main Reactor Control"} functionSet = {functionSet} stateValues = {this.state.stateValues}/>,
            <ThrustersMain internTitle = {'thrusters'} title = {"Thruster Control"} functionSet = {functionSet} stateValues = {this.state.stateValues}/>
        ];

        return (
            <div>
                <BrowserRouter>
                    <Route exact path = "/" render = {() => routerViews[0]}></Route>
                    <Route path = "/admin" render = {() => routerViews[1]}></Route>
                    <Route path = "/command" render = {() => routerViews[2]}></Route>
                    <Route path = "/coolant" render = {() => routerViews[3]}></Route>
                    <Route path = "/oxyscrub" render = {() => routerViews[4]}></Route>
                    <Route path = "/reactor" render = {() => routerViews[5]}></Route>
                    <Route path = "/thrusters" render = {() => routerViews[6]} ></Route>
                </BrowserRouter>
                <PopUp popupContent = {this.state.popupContent} closePopup = {this.closePopup} isOpen = {this.state.popupOpen}/>
            </div>
        )
    }
}

class Initializing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "initContainer"><img src={Logo} className = "loginlogo" alt="Logo" /><div className = "initTitle">Initializing...</div><div className = "initStatus">{this.props.status}</div></div>
        )
    }
}