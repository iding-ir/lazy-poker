import React, { Component } from "react";
import M from "materialize-css";

import "./controls.css";
import { stages } from "./definitions";

class Controls extends Component {
  state = {};
  componentDidMount() {
    document.addEventListener("DOMContentLoaded", function () {
      let logsModal = document.querySelector("#logs-modal");

      M.Modal.init(logsModal);

      let restartModal = document.querySelector("#restart-modal");

      M.Modal.init(restartModal);
    });
  }

  render() {
    let { onDeal, onAutoplay, onRestart, logs } = this.props;
    let { dealIsDisabled, autoplayIsEnabled } = this.props.state;
    let { icon, button } = stages[this.props.state.stage];
    let autoplayIcon = autoplayIsEnabled ? "pause" : "play_arrow";

    return (
      <div className="controls">
        <div className="controls-deal">
          <button
            id="controls-deal"
            className="waves-effect waves-light btn-large pink"
            disabled={dealIsDisabled}
            onClick={onDeal}
          >
            <i className="material-icons left">{icon}</i>
            {button}
          </button>

          <button
            id="controls-autoplay"
            className="waves-effect waves-light btn-large pink darken-2"
            disabled={dealIsDisabled}
            onClick={onAutoplay}
          >
            <i className="material-icons left">{autoplayIcon}</i>
          </button>
        </div>

        <div className="controls-spacer"></div>

        <div className="controls-restart">
          <button
            id="controls-restart"
            className="waves-effect btn-large blue"
            onClick={() => {
              let element = document.querySelector("#restart-modal");

              M.Modal.getInstance(element).open();
            }}
          >
            <i className="material-icons">refresh</i>
          </button>

          <div id="restart-modal" className="modal">
            <div className="modal-header">
              <h5>Restart</h5>
            </div>

            <div className="modal-content">
              <p>Are you sure you want to restart the game?</p>
            </div>

            <div className="modal-footer">
              <button
                className="modal-close waves-effect btn-flat"
                onClick={onRestart}
              >
                Restart
              </button>

              <button className="modal-close waves-effect btn-flat">
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="controls-logs">
          <button
            id="controls-logs"
            className="waves-effect btn-large blue"
            onClick={() => {
              let element = document.querySelector("#logs-modal");

              M.Modal.getInstance(element).open();
            }}
            disabled={!logs.length}
          >
            <i className="material-icons">filter_none</i>
          </button>

          <span
            className="logs-counter badge new pink"
            data-badge-caption=""
            style={{ display: !logs.length ? "none" : "block" }}
          >
            {logs.length}
          </span>

          <div id="logs-modal" className="modal">
            <div className="modal-header">
              <h5>Logs</h5>
            </div>

            <div className="modal-content">
              <ul className="collection">
                {logs.map((log, index) => (
                  <li className="collection-item logs-item" key={index}>
                    <i className="material-icons left blue-text">{log.icon}</i>

                    <div dangerouslySetInnerHTML={{ __html: log.text }}></div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-footer">
              <button className="modal-close waves-effect btn-flat">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Controls;
