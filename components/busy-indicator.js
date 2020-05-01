import * as React from "react";
import { View, ActivityIndicator,StyleSheet } from "react-native";


export class BusyIndicator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.visible ? (
      <View style={styles.initStyle} >
        <ActivityIndicator size="large" color="yellow" />
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
    initStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        opacity: 0.7
      }
})
