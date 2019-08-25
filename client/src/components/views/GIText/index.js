import { Component } from "react";

import { getHtmlElement } from "./util";
import "./style.css";

class GIText extends Component {
  render() {
    return getHtmlElement(this.props);
  }
}

export default GIText;
