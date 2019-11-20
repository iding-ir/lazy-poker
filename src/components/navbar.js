import React, { Component } from "react";
import "./navbar.css";

class Navbar extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <nav className="blue-grey darken-1">
          <div className="nav-wrapper">
            <div className="navbar-container">
              <a href="https://github.com/iding-ir" className="brand-logo">
                Lazy Poker
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
