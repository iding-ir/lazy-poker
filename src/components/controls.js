import React, { Component } from "react";
import "./controls.css";
import { stages } from "./definitions";
import M from "materialize-css";

class Controls extends Component {
  state = {};
  componentDidMount() {
    document.addEventListener("DOMContentLoaded", function() {
      let element = document.querySelector("#logs-modal");

      M.Modal.init(element);
    });
  }

  render() {
    let { disabled } = this.props.state;
    let { icon, button } = stages[this.props.state.stage];

    return (
      <div className="controls">
        <div className="controls-deal">
          <button
            id="controls-deal"
            disabled={disabled}
            className="waves-effect waves-light btn"
            onClick={this.props.onDeal}
          >
            <i className="material-icons left">{icon}</i>
            {button}
          </button>
        </div>

        <div className="controls-autoplay">
          <button
            id="controls-autoplay"
            className="waves-effect waves-light btn btn-floating"
            onClick={this.props.onAutoplay}
          >
            <i className="material-icons left">refresh</i>
          </button>
        </div>

        <div className="controls-spacer"></div>

        <div className="controls-logs">
          <button
            id="logs-trigger"
            className="btn-floating btn waves-effect waves-light red"
            onClick={() => {
              let element = document.querySelector("#logs-modal");

              M.Modal.getInstance(element).open();
            }}
            disabled={!this.props.logs.length}
          >
            <i className="material-icons">filter_none</i>
          </button>

          <span className="badge new blue" data-badge-caption="logs">
            {this.props.logs.length}
          </span>
        </div>

        <div id="logs-modal" className="modal">
          <div className="modal-content">
            <h5>logs</h5>

            <ul className="collection">
              {this.props.logs.map((log, index) => (
                <li className="collection-item" key={index}>
                  <i className="material-icons left">{log.icon}</i>
                  <span>{log.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Controls;
