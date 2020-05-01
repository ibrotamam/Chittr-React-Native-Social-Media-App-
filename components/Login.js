import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert
} from "react-native";

import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { BusyIndicator } from "./busy-indicator";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          showBusyIndicator: false,
          username: '',
          password: ''
        };
    
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      }


  
  handleBackButtonClick() {
    if (this.state.showBusyIndicator == true) {
      return true;
    }
    this.props.navigation.goBack();
    return true;
  }

  static navigationOptions = {
    title: "Login",
    header: null
  };

  focusNextField = nextField => {
    this.refs[nextField].focus();
  };


  

  onLoginPress = e => {
    const { username, password } = this.state;

    if(password.length<6){
      Alert.alert("Password too short","Your password must be at least 6 characters long.");
    }else if (!username.includes('@')){
      Alert.alert("Email Invalid","Please enter a valid email");
    }

    else{

      const saveId = async userId => {
        try {
          await AsyncStorage.setItem('userId', userId.toString());
          console.log("in login"+userId);
        } catch (error) {
          // Error retrieving data
          console.log(error.message);
        }
      };

      const saveToken = async userToken => {
        try {
          await AsyncStorage.setItem('userToken', userToken);
          console.log("in login"+userToken);
        } catch (error) {
          // Error retrieving data
          console.log(error.message);
        }
      };

      

    axios.post('http://10.0.2.2:3333/api/v0.0.5/login', {
        email: username,
        password: password
      })
      .then(function (response) {
        //alert(response.data.token);
        saveToken(response.data.token);
        saveId(response.data.id);
        this.props.navigation.navigate('Dashboard');


      }.bind(this))
      .catch(function (error) {
        alert("Login Details Incorrect, Please try again");
      });

    
    }
  };

  render() {
    const { username, password } = this.state;
    const hasValues = username.length > 0 && password.length > 0;

    

    return (
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          justifyContent: "center",
          backgroundColor: "#F7FE0C"
        }}>
        
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingTop: 40,
              paddingLeft: 25.73,
              height: 120
            }}>
            
            <View style={{ flex: 0 }}>
              <Text style={{
                marginLeft: 20,
                marginTop: 17,
                fontSize: 18,
                textAlign: "center",
                fontWeight: "500",
                fontFamily: "Roboto-Medium",
              }}>
                Login
                </Text>
            </View>
            <View style={{ flex: 0 }}></View>
          </View>

          <View
            style={{
              paddingLeft: 47.47,
              paddingRight: 47.47,
              justifyContent: 'center',
              paddingTop: "10%"
            }}>
              <Text style={{justifyContent:'center',textAlign:'center',color:'white',fontSize:60,paddingRight:30,shadowColor:'black',shadowOffset:{width:2,height:10},textShadowRadius:5}}>Chittr</Text>
            <View style={{ height: 87.33 }} />
            <TextInput
              ref="username"
              maxLength={40}
              value={this.state.username}
              style={styles.input}
              placeholderTextColor="#707070"
              placeholder="Email address*"
              onSubmitEditing={() => this.focusNextField("password")}
              onChangeText={text => this.setState({ username: text })}
             
               />

            <TextInput
              ref= "password"
              maxLength={40}
              placeholderTextColor="#707070"
              reference={(input) => { this.passwordInput = input; }}
              value={this.state.password}
              style={styles.input}
              placeholder="Password*"
              onChangeText={text => this.setState({ password: text })}
              onSubmitEditing={() => Keyboard.dismiss()}
              secureTextEntry={true} />

            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Register'); }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 14,
                  marginBottom: 30.85,
                  marginTop: 25.29,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}>
                Dont have an account? Sign up here
                  </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!hasValues}
              style={{ width: "100%", marginBottom: 100 }}
              onPress={this.onLoginPress}>
              <Text style={[styles.btn, hasValues ? null : styles.btnDisabled]}>
                Login
                  </Text>
            </TouchableOpacity>
          </View>
        <BusyIndicator visible={this.props.isLoading} />
      </View>
    );
  }
}



export default LoginForm;

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    borderColor: "#DBDBDB",
    paddingTop: 13.43,
    paddingBottom: 13.43,
    paddingLeft: 23.94,
    paddingRight: 23.94,
    backgroundColor: "white",
    color: "black",
    fontSize: 11,
    marginBottom: 16.28
  },

  btn: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    padding: 11,
    backgroundColor: "#344762",
    borderRadius: 5,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    textAlign: "center",
    fontFamily: "Roboto-Medium",

  },
  btnDisabled: {
    backgroundColor: "#707070",
    fontFamily: "Roboto-Medium"
  }
});
