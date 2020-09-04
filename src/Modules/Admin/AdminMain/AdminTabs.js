import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faClipboard, faList, faMap, faTools, faTrash } from '@fortawesome/free-solid-svg-icons'

import '../../../css/admin.css';

const FULL_URL = "http://165.22.83.88:5000"

export default class AdminTabs extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            'value': 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, t) {
        this.setState({value: t});
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Tabs value = {this.state.value} onChange={this.handleChange} aria-label="simple tabs example">
                        <Tab label={<div><FontAwesomeIcon icon={faUsers} /> &nbsp; Manage Users</div>} />
                        <Tab label={<div><FontAwesomeIcon icon={faTools} /> &nbsp; Manage Ship</div>} />
                        <Tab label={<div><FontAwesomeIcon icon={faClipboard} /> &nbsp; Event Manager</div>} />
                        <Tab label={<div><FontAwesomeIcon icon={faList} /> &nbsp; Game Logs</div>} />
                        <Tab label={<div><FontAwesomeIcon icon={faMap} /> &nbsp; Game Map</div>} />
                    </Tabs>
                </AppBar>
                {this.state.value == 0 && <ManageUsers functionSet = {this.props.functionSet}/>}
                {this.state.value == 1 && <div></div>}
                {this.state.value == 2 && <div></div>}
                {this.state.value == 3 && <div></div>}
                {this.state.value == 4 && <div></div>}
            </div>
        )
    }
}

class ManageUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'userListObject': [],
            'username': '',
            'password': ''
        }

        this.getUserListCallback = this.getUserListCallback.bind(this);
        this.deleteCredentials = this.deleteCredentials.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }
    
    componentDidMount() {
        // Grabbing all of the users in the system...
        this.getAllCredentials()
    }

    getAllCredentials() {
        var refMe = this;
        this.props.functionSet['performAPICall'](FULL_URL + "/cred/get", refMe.getUserListCallback, "GET", null);
    }

    deleteCredentials(username) {
        var refMe = this;
        this.props.functionSet['performAPICall'](FULL_URL + "/cred/delete", refMe.getUserListCallback, "POST", JSON.stringify({username: username}));
        this.getAllCredentials();
    }

    addCredentials() {
        if(this.state.username.length <= 0 || this.state.password.length <= 0)
            this.failLogin();
        
        var refMe = this;
        this.props.functionSet['performAPICall'](FULL_URL + "/cred/add", refMe.getUserListCallback, "POST", JSON.stringify({username: this.state.username, password: this.state.password}));
        this.setState({username: "", password: ""});
        this.getAllCredentials();
    }

    failLogin() {
        let content = 
        <div>
            <div className = "popupTitle">Error</div>
            <div className = "popupInfo">Invalid login credentials!</div>
        </div>;

        this.props.functionSet['setPopupContent'](content);
        this.props.functionSet['loadPopup']();
    }

    getUserListCallback(result) {
        var userStateList = []
        for (const [key, value] of Object.entries(result['data'])) {
            userStateList.push(<div className = "userListRow">
                <div className = "userListValue">{key}</div>
                <div className = "userListValue">{value}</div>
                <div className = "userListValue"><FontAwesomeIcon icon={faTrash} onClick={() => {this.deleteCredentials(key)}}/></div>
            </div>);
        }
        this.setState({userListObject: userStateList});
    }

    handleChangeUsername(e) {
        this.setState({username: e.target.value});
    }

    handleChangePassword(e) {
        this.setState({password: e.target.value});
    }

    render() {
        return (
            <div className = "userListContainer">
                <div className = "tabContainerTitle">System User List</div>
                <div className = "userList">
                    <div className = "userListRow">
                        <div className = "userListValue" style = {{color: "#8f8f8f", fontSize: 24}}>Username</div>
                        <div className = "userListValue" style = {{color: "#8f8f8f", fontSize: 24}}>Password</div>
                        <div className = "userListValue" style = {{color: "#8f8f8f", fontSize: 24}}>Delete</div>
                    </div>
                </div>
                <div className = "userList">
                    {this.state.userListObject}
                </div>

                <div className = "newUserContainer">
                    <TextField onChange = {(e) => {this.handleChangeUsername(e);}} color = "primary" id="filled-basic" label="Username" variant="filled" value = {this.state.username}/>
                    <TextField onChange = {(e) => {this.handleChangePassword(e);}} color = "primary" id="filled-basic" label="Password" variant="filled" value = {this.state.password}/>
                    <Button variant="contained" color="primary" onClick={() => {this.addCredentials();}}>Add User</Button>
                </div>
            </div>
        )
    }
}