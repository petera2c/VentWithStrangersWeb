import { Component } from "react";

import { getHtmlElement } from "./util";
import "./style.css";

class VWSText extends Component {
  render() {
    return getHtmlElement(this.props);
  }
}

export default VWSText;
