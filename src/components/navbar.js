import React, { Component } from "react";

import "./navbar.css";

class Navbar extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <nav className="blue darken-3">
          <div className="nav-wrapper">
            <div className="navbar-container">
              <a href="http://lazy-poker.iding.ir" className="logo">
                <span></span>
                Lazy Poker
              </a>

              <ul>
                <a
                  className="github"
                  href="https://github.com/iding-ir/lazy-poker"
                >
                  Github
                  <span></span>
                </a>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default Navbar;
