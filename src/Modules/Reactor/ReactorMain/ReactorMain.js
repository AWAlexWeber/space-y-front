import React from 'react';
import ModuleDefault from '../../ModuleDefault';
import ReactorDisplay from './ReactorDisplay';
import ReactorOutputControl from './ReactorOutputControl';

import '../../../css/reactor.css';

const FULL_URL = "http://165.22.83.88:5000"

export default class ReactorMain extends ModuleDefault {
    
    constructor(props) {
        super(props);
    
        this.interval = null;
        this.state = {}
    }

    componentDidMount() {
        // Only do this if we did not fail render state
        if (!this.isFailRender())
            this.props.functionSet['startIntervalUpdate']();
    }

    componentWillUnmount() {
        this.props.functionSet['stopIntervalUpdate']();
    }

    render() {
        if (this.isFailRender()) {
            return this.failRender();
        }

        // Getting the reactor data
        var reactorData = this.props.functionSet['getState'](['systemStatus', 'modules', 'reactor']);
        console.log(reactorData);

        if (reactorData == null || reactorData == undefined)
            return (<div />);

        return (
            <div>
                {this.renderMenuTitle()}

                <div className = 'innerBodyMain'>
                    <div className = 'reactorDisplayList'>
                        <ReactorDisplay reactorData = {reactorData} functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {1}/>
                        <ReactorDisplay reactorData = {reactorData} functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {2}/>
                        <ReactorDisplay reactorData = {reactorData} functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {3}/>
                        <ReactorDisplay reactorData = {reactorData} functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {4}/>
                        <ReactorDisplay reactorData = {reactorData} functionSet = {this.props.functionSet} stateValues = {this.props.stateValues} id = {5}/>
                        <ReactorOutputControl />
                    </div>

                    {this.renderLogOutButton()}
                </div>

                {this.renderBottomOptions()}
            </div>
        )
    }
}