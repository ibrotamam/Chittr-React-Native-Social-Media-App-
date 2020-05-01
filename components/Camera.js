import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
export default class Camera extends Component {
 constructor(props){
 super(props);
 this.navigateToScreen = this.navigateToScreen.bind(this);

 }

 navigateToScreen(screenName,data) {
    this.props.navigation.navigate(screenName,{imageData:data});
  }

 render() {
 return (
 <View style={styles.container}>
 <RNCamera
 ref={ref => {
 this.camera = ref;
 }}
 style={styles.preview}
 />
 <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
 <TouchableOpacity
 onPress={this.takePicture.bind(this)}
 style={styles.buttonContainer}
 >
 <Text style={{ fontSize: 16 }}>
 CAPTURE
 </Text>
 </TouchableOpacity>
 </View>
 </View>
 );
 }

 
 takePicture = async() => {
 if (this.camera) {
 const options = { quality: 0.5, base64: true };
 const data = await this.camera.takePictureAsync();
 console.log(data);

this.navigateToScreen('PostChitts',data);


 }
 };
}
const styles = StyleSheet.create({
 container: { flex: 1, flexDirection: 'column' },
 buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:130,
    borderRadius:30,
    backgroundColor: "#fcfc03",
  },
 preview: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
 capture: { flex: 0, borderRadius: 5, padding: 15, paddingHorizontal: 20,
 alignSelf: 'center', margin: 20, marginTop:40}
});
