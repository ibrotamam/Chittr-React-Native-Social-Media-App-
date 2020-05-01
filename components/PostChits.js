import React from "react";
import {PermissionsAndroid} from 'react-native';
import { Alert,View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image } from "react-native";
import Ionicons from 'react-native-ionicons';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import BackgroundJob from 'react-native-background-job';


export default class PostScreen extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            token:"",
            id:"",
            text: "",
            image: null,
            latitude:0,
            longitude:0
        };
    
    }

     requestLocationPermission = async ()=>{
      try {
      const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
      title: 'Location Permission',
      message:
      'This app requires access to your location.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
      },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can access location');
      return true;
      } else {
      console.log('Location permission denied');
      return false;
      }
      } catch (err) {
      console.warn(err);
      }
     }

    

    componentDidMount() {
        this.getPermissions();
        AsyncStorage.getItem('userToken').then((value) => this.setState({ 'token': value }));
        AsyncStorage.getItem('userId').then((value) => this.setState({ 'id': value },()=>this.findCoordinates()));


        
        
    }


    findCoordinates = async () => {
      await Geolocation.getCurrentPosition(
      (position) => {
      const location = JSON.stringify(position);
      console.log("location"+location);
      this.setState({location});
      },
      (error) => {
      Alert.alert(error.message)
      },
      {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
      }
      );
      };

   
    getPhotoPermission = async () => {
        try {

            
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'Chittr Camera Permission',
                message:
                  'Chittr needs access to your camera ' +
                  'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('You can use the camera');
            } else {
              console.log('Camera permission denied');
            }
          } catch (err) {
            console.warn(err);
          }
    };

    handleDrafts = async ()=>{

      try {
        const myArray = await AsyncStorage.getItem('draftsArray');
        console.log("myarray"+ myArray);
        if (myArray !== null) {
          // We have data!!
          console.log("DATA From async storage drafts "+JSON.parse(myArray));

          let arr = JSON.parse(myArray);

          

          let chitData = {
            chit_id: arr.length,
            timestamp: 0,
            chit_content: this.state.text.trim(),
            location:{ latitude:this.state.latitude,longitude:this.state.longitude},
            user:{
                user_id:0,
                given_name:"",
                family_name:"",
                email:""
            }
          };

          arr.push(chitData);
          
          try {
            
            await AsyncStorage.setItem('draftsArray', JSON.stringify(arr));
            this.props.navigation.navigate('Feed');

          } catch (error) {
            // Error retrieving data
            console.log(error.message);
          }


        }

        else{
          console.log("async storage creating a new array ")

          let arr = [];

          

          let chitData = {
            chit_id: 0,
            timestamp: 0,
            chit_content: this.state.text.trim(),
            location:{ latitude:this.state.latitude,longitude:this.state.longitude},
            user:{
                user_id:0,
                given_name:"",
                family_name:"",
                email:""
            }
          };

          arr.push(chitData);
          
          try {
            
            await AsyncStorage.setItem('draftsArray', JSON.stringify(arr));
            this.props.navigation.navigate('Feed');

          } catch (error) {


            // Error retrieving data
            console.log(error.message);
          }



        }
      } catch (error) {
        // Error retrieving data
      }




    }

    handlePost = () => {

        

          var now = new Date();
          var nowLong = now.getTime();

          var postData = {
            chit_id: 0,
            timestamp: nowLong,
            chit_content: this.state.text.trim(),
            location:{ latitude:this.state.latitude,longitude:this.state.longitude},
            user:{
                user_id:0,
                given_name:"",
                family_name:"",
                email:""
            }
          };

          var axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.token,
            }
          };

          console.log(axiosConfig.headers);

         

         axios.post('http://10.0.2.2:3333/api/v0.0.5/chits', postData,axiosConfig
       )
          .then(function (response) {

            if(this.state.image){

              console.log("****PHOTO NOT NULL");
              console.log("received chit id"+response.data.chit_id);
              let customConfig ={

                headers: {
                  
                  'X-Authorization': this.state.token,
                  'Content-Type': 'image/jpeg',
              }


              }

              this.customSendImage(customConfig,this.state.image,response.data.chit_id);
            }
            else{
              this.props.navigation.navigate('Feed');

            }


    
          }.bind(this))
          .catch(function (error) {
            alert(error);
          });

        
          
        
    };
    customSendImage(config,data,id){

      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/'+id+'/photo',{
        method :'POST',
        headers:{
          'X-Authorization':this.state.token,
          'Content-Type':'image/jpeg'
        },
        body: this.state.image
      })
      .then((response)=>{
        console.log("uploaded image succesfully");
        this.props.navigation.navigate('Feed');

      })

    }

    getPermissions = async()=>{

      await this.getPhotoPermission();
      await this.requestLocationPermission();
    }


    schedulePost = async ()=>{

      const backgroundJob = {
        jobKey: "scheduledpost",
        job: () => {console.log("Running in background");
      
        this.handlePost();
      
      }


       };
       
       BackgroundJob.register(backgroundJob);

       var backgroundSchedule = {
        jobKey: "scheduledpost",
       }

       BackgroundJob.schedule(backgroundSchedule)
      .then(() => {Alert.alert("Succesfully Scheduled Post, posting in 15 minutes");this.props.navigation.navigate('Feed');})
      .catch(err => console.err(err));


    }

    getImage = async ()=> {
      axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profileId+'/photo',{responseType:'arraybuffer'})
      .then(function (response) {

        const base64 = Base64.btoa(

          new Uint8Array(response.data).reduce(

          (data, byte) => data + String.fromCharCode(byte),

          '',

          ),
      
      );

      this.setState({

        imageURI:'data:image/png;base64,'+base64,
        isImageLoaded:true



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

    

    render() {

      
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>

                <TouchableOpacity onPress={this.handleDrafts}>

              <Text style={{ fontWeight: "500" }}>Draft </Text>
              </TouchableOpacity>

              <TouchableOpacity  style={{ paddingLeft: 120 }}onPress={()=>this.schedulePost()}>

                        <Text style={{ fontWeight: "500" }}>Schedule </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity  style ={ {paddingLeft:130}}onPress={this.handlePost}>

                        <Text style={{ fontWeight: "500" }}>Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Image source={{uri:'http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.id+'/photo'}} style={styles.avatar}></Image>
                    <TextInput
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={4}
                        style={{ flex: 1 }}
                        placeholder="Want to share something?"
                        onChangeText={text => this.setState({ text })}
                        value={this.state.text}
                    ></TextInput>
                </View>

                <TouchableOpacity style={styles.photo} onPress={()=>this.pickImage()}>
                    <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>

               

                

                

                
            </SafeAreaView>
        );
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
   
  
});
