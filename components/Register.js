import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Alert
  
} from "react-native";
import {
  createSwitchNavigator
  
} from 'react-navigation';

import Login from './Login';
import axios from 'axios';
import { BusyIndicator } from "./busy-indicator";


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isLoading: false
    };
    this.onRegister = this.onRegister.bind(this);
  }


  focusNextField = nextField => {
    this.refs[nextField].focus();
  };

  onRegister = e => {
    if(this.state.password.length<6){
      Alert.alert("Password too short","Your password must be at least 6 characters long.");
    }else if (!this.state.email.includes('@')){
      Alert.alert("Email Invalid","Please enter a valid email");
    }


    
    else{
      const { firstName, lastName, email, password } = this.state;
      axios.post('http://10.0.2.2:3333/api/v0.0.5/user', {
        given_name: firstName,
        family_name: lastName,
        email:email,
        password:password
      })
      .then(function (response) {
        //alert(response.data.token);
        this.props.navigation.navigate('Login');

      }.bind(this))
      .catch(function (error) {
        alert(error);
      });
      
    }
  };

  render() {
    const { firstName, lastName, email, password } = this.state;
    const hasValues =
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      password.length > 0;

    return (
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          justifyContent: "center",
          backgroundColor: "#F7FE0C"
        }}
      >
       
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                paddingTop: 40,
                paddingLeft: 25.73,
                height: 84,
              }}
            >
              <TouchableOpacity
                style={{ paddingTop: 20 }}
                onPress={() => this.props.navigation.navigate('Login')}>
                <Image
                  style={styles.barBackButtonSize}
                  source={require("../assets/arowLeft.png")}
                />
              </TouchableOpacity>
              <View style={{flex:0}}>
                <Text
                  style={{
                    marginRight: 45,
                    marginTop: 20,
                    fontSize: 18, 
                    fontWeight: "500",
                    textAlign:"center",
                    fontFamily:"Roboto-Medium"
                  }}
                >
                  Register
                </Text>
              </View>
            </View>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              style={styles.scroll}
            >
              <View
                style={{
                  paddingLeft: 47.47,
                  paddingRight: 47.47
                }}
              >
                <View style={{ height: 38.32 }} />
                <TextInput
                  ref="firstName"
                  style={styles.input}
                  maxLength={40}
                  placeholder="First name*"
                  placeholderTextColor="#707070"
                  value={firstName}
                  onChangeText={text => this.setState({ firstName: text })}
                  onSubmitEditing={() => this.focusNextField("lastName")}
                  blurOnSubmit={false}
                  returnKeyType={"next"}
                />
                <TextInput
                  ref="lastName"
                  style={styles.input}
                  maxLength={40}
                  placeholder="Last name*"
                  placeholderTextColor="#707070"
                  value={lastName}
                  onChangeText={text => this.setState({ lastName: text })}
                  onSubmitEditing={() => this.focusNextField("email")}
                  blurOnSubmit={false}
                  returnKeyType={"next"}
                />
                <TextInput
                  ref="email"
                  style={styles.input}
                  maxLength={40}
                  placeholder="Email address*"
                  placeholderTextColor="#707070"
                  value={email}
                  onChangeText={text => this.setState({ email: text })}
                  onSubmitEditing={() => this.focusNextField("password")}
                  blurOnSubmit={false}
                  returnKeyType={"next"}
                />
                <TextInput
                  ref="password"
                  style={styles.input}
                  maxLength={40}
                  placeholder="Create password*"
                  placeholderTextColor="#707070"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={text => this.setState({ password: text })}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  blurOnSubmit={false}
                  returnKeyType={"next"} />

                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 11,
                      marginBottom: 25,
                      color: "#3B3D40",
                      fontFamily:'Roboto-Regular',
                    }}
                  >
                    Minimum 6 characters
                  </Text>
                  <View style={{alignContent: 'center',justifyContent: 'center'}}>

                  <TouchableOpacity
                    disabled={!( hasValues) || this.props.isLoading }
                    style={{ width: "100%", marginBottom: 100, marginTop:10 }}
                    onPress={ this.onRegister }>
                    <Text
                      style={[
                        styles.btnRegister,
                         hasValues? null : styles.btnRegisterDisabled ]}>
                      Register 
                    </Text>
                  </TouchableOpacity>
                  
                  </View>
                
                </View>
              </View>
            </ScrollView>
        <BusyIndicator visible={ this.props.isLoading } />
      </View>
    );
  }
}



export default Register;


const AppSwitchNavigator = createSwitchNavigator({
  Login:{screen:Login}
});


const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    alignSelf: "stretch"
  },
  container: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
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
    marginBottom: 16.28,
    fontFamily:"Roboto-Regular"
  },
  btnRegister: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    padding: 11,
    backgroundColor: "#344762",
    borderRadius: 5,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    textAlign: "center"  
  },
  btnRegisterDisabled: {
    backgroundColor: "#707070"
  },
  barBackButtonSize:{
    width: 20,
    height: 20,
  }
  
});
