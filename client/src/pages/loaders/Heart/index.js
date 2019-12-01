import React, { Component, useState } from "react";

import "./style.css";

class LoadingHeart extends Component {
  render() {
    return (
      <div className="">
        <div className="lds-heart"></div>
        <div className="lds-heart"></div>
      </div>
    );
  }
}

export default LoadingHeart;
