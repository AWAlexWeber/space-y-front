import React from 'react';
import '../css/login.css';

import Logo from '../assets/img/spacex-logo-white.png';
import Button from '@material-ui/core/Button';

import HackGif from '../assets/img/hack-gif.gif';

export default class LoginMain extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            'username': '',
            'password': ''
        }

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.attemptLogin = this.attemptLogin.bind(this);
        this.performHack = this.performHack.bind(this);
        this.disableHack = this.disableHack.bind(this);
    }

    /* * * Handling user input * * */
    setUsername(event) {
        this.setState({'username': event.target.value});
    }

    setPassword(event) {
        this.setState({'password': event.target.value});
    }

    attemptLogin(event) {
        this.props.functionSet['attemptLogin'](this.state.username, this.state.password, this.props.module);
    }

    renderMenuTitle() {

        return (
            <div>
                <img src={Logo} className = "loginlogo" alt="Logo" />
                <div className = "form-title">{this.props.title}</div>
            </div>
        )
    }

    performHack() {
        if (this.state.username.length <= 0) {
            let content = 
            <div>
                <div className = "popupTitle">Cannot Perform Hack</div>
                <div className = "popupInfo">Please Enter a Username</div>
            </div>;

            this.props.functionSet['setPopupContent'](content);
            this.props.functionSet['loadPopup']();
            return;
        }

        this.setState({hack: true});

        var refMe = this;
        setTimeout(function() {
            // Attempting hack
            refMe.props.functionSet['attemptHack'](refMe.state.username, refMe.props.module);
            setTimeout(function() {
                refMe.disableHack();
            }, 500)
        }, 6000);
    }

    disableHack() {
        this.setState({hack: false});
    }

    renderHack() {
        return (
            <div>
                <div className = "form-title">{this.props.title}</div>
                <img src = {HackGif} className = "hackGif" />
                <div className = "hack-title">Performing Manual Login Override</div>
            </div>
        )
    }

    render() {
        if (this.state.hack) {
            return this.renderHack();
        }

        return (
            <div className = "loginbody">
                {this.renderMenuTitle()}
                
                <div class="login-page">
                    <div class="form">
                        <form class="login-form">
                            <input type="text" placeholder="username" value={this.state.username} onChange={this.setUsername}/>
                            <input type="password" placeholder="password" value={this.state.password} onChange={this.setPassword}/>
                            <Button variant="contained" color="primary" style = {{minWidth: '100%'}} onClick={this.attemptLogin}>login</Button>
                            <Button variant="contained" color="primary" style = {{minWidth: '100%', marginTop: 25}} onClick={this.performHack}>hack</Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}