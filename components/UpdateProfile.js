import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Alert,
  Platform
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Base64 from '../assets/Base64';
import axios from 'axios';
import { BusyIndicator } from "./busy-indicator";


class UpdateProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isDataLoaded:false,
        profileData:"",
        token:"",
        id:"",
        isTokenLoaded:false,
        isIdLoaded:false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      image:null,
      isLoading: false,
      imageURI:""

    };
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
  }


  focusNextField = nextField => {
    this.refs[nextField].focus();
  };

  onUpdateProfile = e => {
    if(this.state.password.length<6 && this.state.password.length!=0){
      Alert.alert("Password too short","Your password must be at least 6 characters long.");
    }else if (!this.state.email.includes('@')){
      Alert.alert("Email Invalid","Please enter a valid email");
    }


    
    else{
      const { firstName, lastName, email, password } = this.state;
      axios.patch('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.id, {
        given_name: firstName,
        family_name: lastName,
        email:email,
        password:password
      },{
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.state.token
        }
      })
      .then(function (response) {
        //alert(response.data.token);
        //this.props.navigation.navigate('Login');

        if(this.state.image){
            console.log('image');
            this.customSendImage();
        }
        else{
            Alert.alert("Updated Successfully");

        }
        

      }.bind(this))
      .catch(function (error) {
        Alert.alert("Failure Updating Please try again");
      });
      
    }
  };


  customSendImage(){

    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo',{
      method :'POST',
      headers:{
        'X-Authorization':this.state.token,
        'Content-Type':'image/jpeg'
      },
      body: this.state.image
    })
    .then((response)=>{
        Alert.alert("Updated Successfully");

      console.log("uploaded image succesfully");

    })

  }

  pickImage = async () => {

    const options = {
      title: 'Select from Photo Roll',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      
      
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          image: response,
          imageURI: response.uri
        });
      }
    });
  };


  getImage = async ()=> {
    axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.id+'/photo',{responseType:'arraybuffer'})
    .then(function (response) {

      const base64 = Base64.btoa(

        new Uint8Array(response.data).reduce(

        (data, byte) => data + String.fromCharCode(byte),

        '',

        ),
    
    );

    this.setState({

      imageURI:'data:image/png;base64,'+base64,



    });
     
      
    }.bind(this))
    
    .catch(function (error) {
      console.log('photo error'+error);
    });
  }
  

  pickImage = async () => {

    const options = {
      title: 'Select from Photo Roll',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      
      
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          image: response,
        });
      }
    });
  };


  getProfile= async ()=> {

    
    axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.id)
    .then(function (response) {
        console.log(response);

      this.setState({
          
          profileData: response.data,
          firstName: response.data.given_name,
          lastName:response.data.family_name,
          email:response.data.email,
          isDataLoaded:true,

      },()=>this.getImage())
      
      
    }.bind(this))
    
    .catch(function (error) {
      console.log(error);
    });
}


  componentDidMount(){

    

    AsyncStorage.getItem('userToken').then((value) => this.setState({ 'token': value ,isTokenLoaded:true },
    ()=>AsyncStorage.getItem('userId').then((value) => this.setState({ 'id': value ,isIdLoaded:true
},
    ()=>this.getProfile()))
    ));



  }

  render() {
    const { firstName, lastName, email, password } = this.state;
    const hasValues =
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 ;
                    
    if(this.state.isIdLoaded&&this.state.isDataLoaded&&this.state.imageURI!=""){
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
                  Update Details
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
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  blurOnSubmit={false}
                  returnKeyType={"next"}
                />
                <TextInput
                  ref="lastName"
                  style={styles.input}
                  maxLength={40}
                  placeholder={"Last Name*"}
                  placeholderTextColor="#707070"
                  value={lastName}
                  onChangeText={text => this.setState({ lastName: text })}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  blurOnSubmit={false}
                  returnKeyType={"next"}
                />
                <TextInput
                  ref="email"
                  style={styles.input}
                  maxLength={40}
                  placeholder={'Email*'}
                  placeholderTextColor="#707070"
                  value={email}
                  onChangeText={text => this.setState({ email: text })}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  blurOnSubmit={false}
                  returnKeyType={"next"}
                />
                <TextInput
                  ref="password"
                  style={styles.input}
                  maxLength={40}
                  placeholder="*************"
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
                  
                <TouchableOpacity onPress={()=>this.pickImage()}>
                  <Image source={{uri:this.state.imageURI}} style={styles.avatar} ></Image>
                  </TouchableOpacity>
                  <View style={{alignContent: 'center',justifyContent: 'center'}}>

                  <TouchableOpacity
                    disabled={!( hasValues) || this.props.isLoading }
                    style={{ width: "100%", marginBottom: 100, marginTop:10 }}
                    onPress={ this.onUpdateProfile }>
                    <Text
                      style={[
                        styles.btnUpdate,
                         hasValues? null : styles.btnUpdateDisabled ]}>
                      Update
                    </Text>
                  </TouchableOpacity>
                  
                  </View>
                
                </View>
              </View>
            </ScrollView>
        <BusyIndicator visible={ this.props.isLoading } />
      </View>
    );}
    else{
        return(<ActivityIndicator  style ={{flex:1}} size="large" color="#fcfc03"/>
        );
    }
  }
}



export default UpdateProfile;

/*
const AppSwitchNavigator = createSwitchNavigator({
  Login:{screen:Login}
});

*/


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
  btnUpdate: {
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth:4,
    borderColor: 'white',
    marginRight: 16
},
  btnUpdateDisabled: {
    backgroundColor: "#707070"
  }
  
});
