import { Component } from "react";

import { getHtmlElement } from "./util";
import "./style.css";

class Text extends Component {
  render() {
    return getHtmlElement(this.props);
  }
}

export default Text;
