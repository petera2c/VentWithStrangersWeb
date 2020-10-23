import React, { Component } from "react";
import { Platform, Switch, Text, View } from "react-native";
import { CheckBox } from "react-native-elements";
import axios from "axios";
import Consumer from "../../context";

import { styles } from "../../styles";

class Checkbox extends Component {
  render() {
    const { checked, onPress, style, title } = this.props;

    if (Platform.OS == "ios")
      return (
        <View style={{ ...styles.flexRow, ...styles.my4 }}>
          <Switch
            onValueChange={onPress}
            style={{ ...style }}
            value={checked}
          />
          <Text
            style={{
              ...styles.fs20,
              flex: 1,
              ...styles.px16
            }}
          >
            {title}
          </Text>
        </View>
      );
    else
      return (
        <CheckBox
          checked={checked}
          onPress={onPress}
          style={style}
          title={title}
        />
      );
  }
}

export default Checkbox;
