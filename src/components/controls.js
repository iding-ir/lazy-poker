import React, { Component } from "react";
import "./controls.css";
import { stages } from "./definitions";

class Controls extends Component {
  state = {};
  render() {
    let { disabled } = this.props.state;
    let { icon, button } = stages[this.props.state.stage];

    return (
      <React.Fragment>
        <button
          id="controls-deal"
          disabled={disabled}
          className="waves-effect waves-light btn"
          onClick={this.props.onDeal}
        >
          <i className="material-icons left">{icon}</i>
          {button}
        </button>

        <button
          id="controls-autoplay"
          className="waves-effect waves-light btn btn-floating"
          onClick={this.props.onAutoplay}
        >
          <i className="material-icons left">refresh</i>
        </button>
      </React.Fragment>
    );
  }
}

export default Controls;
