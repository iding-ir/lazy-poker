import React, { Component } from "react";
import "./logs.css";
import M from "materialize-css";

class Logs extends Component {
  state = {};
  componentDidMount() {
    document.addEventListener("DOMContentLoaded", function() {
      let element = document.querySelector("#logs-modal");

      M.Modal.init(element);
    });
  }

  render() {
    return (
      <div className="logs">
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

export default Logs;
