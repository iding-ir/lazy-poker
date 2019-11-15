import React, { Component } from "react";

class Navbar extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <nav className="indigo darken-2">
          <div className="nav-wrapper row">
            <div className="col s12">
              <a href="https://github.com/iding-ir" className="brand-logo">
                React Poker
              </a>

              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <a href="https://github.com/iding-ir/react-poker">Github</a>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default Navbar;
