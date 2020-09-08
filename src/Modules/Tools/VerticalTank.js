import React from 'react';

import '../../css/tools.css';

export default class VerticalTank extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var inidcatorList = []
        for (var i = this.props.incrementMax; i >= 0; i-= this.props.incrementAmount) {
            inidcatorList.push(<div className="verticalTankIndicator">{i}%</div>)
        }

        // Calculating display percent full
        var displayPercentFull = this.props.percentFull * (100 / this.props.incrementMax);
        displayPercentFull += '%';

        return (
            <div className = "verticalTankContainer">
                <div className = "verticalTankContainerTitle">{this.props.title}</div>
                <div className = "verticalTankContainerFillLevel">{this.props.percentFull}%</div>
                <div className = "verticalTankInnerContainer">
                    <div className = "verticalTankFillIndicators">
                        {inidcatorList}
                    </div>
                    <div className = "verticalTankContainerGlass">
                        <div style = {{height: displayPercentFull, backgroundColor: this.props.displayColor}} className = "verticalTankContainerFill"></div>
                    </div>
                </div>
            </div>
        )
    }
}