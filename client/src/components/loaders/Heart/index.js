import React, { Component } from "react";

import "./style.css";

class LoadingHeart extends Component {
  render() {
    return (
      <div className="loader-heart-container">
        <div className="loader-heart">
          <div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoadingHeart;
