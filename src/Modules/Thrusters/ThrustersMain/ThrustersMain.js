import React from 'react';
import ModuleDefault from '../../ModuleDefault';

import Thruster from '../../../assets/img/thruster.png';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import VerticalTank from '../../Tools/VerticalTank';

import '../../../css/thrusters.css';

export default class ThrustersMain extends ModuleDefault {
    
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

                    <div className = "upperContainer">
                        <div className = "thrusterLeftContainer">
                            <ThrusterControl id = {1}/>
                            <ThrusterControl id = {2}/>
                            <ThrusterControl type = {"main"} />
                            <ThrusterControl id = {3}/>
                            <ThrusterControl id = {4}/>
                        </div>

                        <Paper className = "thrusterRightContainer" elevation={20}>
                            <VerticalTank displayColor = {"lightblue"} incrementAmount = {10} incrementMax = {100} percentFull={55} title = {'Power'}/>
                            <VerticalTank displayColor = {"#e9b251"} incrementAmount = {20} incrementMax = {200} percentFull={55} title = {'Heat'}/>
                            <VerticalTank displayColor = {"#5559b9"} incrementAmount = {10} incrementMax = {100} percentFull={55} title = {'Coolant'}/>
                        </Paper>
                    </div>

                    <div className = "bottomContainer">
                        <div className = "elevationBar">
                            <div className = "elevationLeft">0km</div>
                            <div className = "elevationBarInner">
                                <div className = "elevationFinal"></div>
                                    <div className = "currentElevation">Current Elevation 250km</div>
                                </div>
                            <div className = "elevationLeft">500km</div>
                        </div>
                    </div>

                    {this.renderLogOutButton()}
                </div>

                {this.renderBottomOptions()}
            </div>
        )
    }
}

class ThrusterControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.type == "main")
            return (
                <Paper className = "thrusterControlContainer" elevation={20}>
                    <div className = "thrusterTitle">Control Thruster{this.props.id}</div>
                    <div className = "thrusterStatus">Offline</div>
                    <img src={Thruster} className = "thrusterImg" alt="Logo" />
                    <div className = "thrusterAlignment">Current Angle: 0 Degrees</div>

                    <Button className = 'thrusterButton' variant="contained" color="primary" onClick = {() => {this.onlineReactor()}}>
                        Online
                    </Button>
                    <Button className = 'thrusterButton' variant="contained" color="primary" onClick = {() => {this.offlineReactor()}}>
                        Offline
                    </Button>
                    <Button className = 'thrusterOverrideButton' variant="contained" color="primary" >
                        Next Angle
                    </Button>
                </Paper>
            )

        return (
            <Paper className = "thrusterControlContainer" elevation={20}>
                <div className = "thrusterTitle">Thruster #00{this.props.id}</div>
                <div className = "thrusterStatus">Offline</div>
                <img src={Thruster} className = "thrusterImg" alt="Logo" />
                <div className = "thrusterAlignment">Current Angle: 90 Degrees</div>
                <div className = "thrusterEfficiency">Efficiency: 100%</div>

                <Button className = 'thrusterButton' variant="contained" color="primary" onClick = {() => {this.onlineReactor()}}>
                    Online
                </Button>
                <Button className = 'thrusterButton' variant="contained" color="primary" onClick = {() => {this.offlineReactor()}}>
                    Offline
                </Button>
                <Button className = 'thrusterButton' variant="contained" color="primary">
                    Fix
                </Button>
                <Button className = 'thrusterOverrideButton' variant="contained" color="primary" onClick = {() => {this.props.functionSet['performManualOverrideFunction']('reactor', this.props.id, 'reactor-' + this.props.id)}}>
                    Override
                </Button>
            </Paper>
        )
    }
}