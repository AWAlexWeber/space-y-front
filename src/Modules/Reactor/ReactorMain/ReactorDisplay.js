import React from 'react';
import Paper from '@material-ui/core/Paper';

export default class ReactorDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Paper className = "reactorDisplayContainer" elevation={20}>
                <div className = "reactorDisplayContainerTitle">Fusion Reactor</div>
                <div className = "reactorDisplayInnerTitle">#00{this.props.id}</div>

                <div className = "reactorTankHolder">
                    <ReactorTank type = {"Tritium"} percentFull = {'55%'}/>
                    <ReactorTank type = {"Deuterium"} percentFull = {'85%'}/>
                </div>
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
                <div className = "reactorTankGlass">
                    <div style = {{height: this.props.percentFull}} className = {additionalClass +" reactorTankFill"}>

                    </div>
                </div>
            </div>
        )
    }
}