import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import '../css/popup.css';

export default class PopUp extends React.Component {
    constructor(props) {
        super(props);

        this.customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
        }
    }

    
    render() {
        return (
            <Modal
                style={this.customStyles}
                isOpen={this.props.isOpen}
            >
                {this.props.popupContent}
                <button className = 'popupButton' onClick={() => {this.props.closePopup()}}>close</button>
            </Modal>
      );
    }
}