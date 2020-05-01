import React from "react";
import { PermissionsAndroid } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image } from "react-native";
import Ionicons from 'react-native-ionicons';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default class ExploreDrafts extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            token: "",
            id: "",
            text: "",
            chitData: "",
            index:0,

            image: null,
            isChitLoaded: false,
        };

    }

    getChit = async () => {

        const { params } = this.props.navigation.state;
        const chit = params ? params.chit : null;
        
        await this.setState({
            chitData: chit,
            text: chit.chit_content,
            isChitLoaded: true,
           
        })

    }



    componentDidMount() {
        this.getPhotoPermission();
        AsyncStorage.getItem('userToken').then((value) => this.setState({ 'token': value }));
        AsyncStorage.getItem('userId').then((value) => this.setState({ 'id': value }, () => this.getChit()));



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

    handleDrafts = async () => {

        try {
            const myArray = await AsyncStorage.getItem('drafts');
            console.log("myarray" + myArray);
            if (myArray !== null) {
                // We have data!!
                console.log("DATA From async storage drafts " + JSON.parse(myArray));

                let arr = JSON.parse(myArray);



                let chitData = {
                    chit_id: 0,
                    timestamp: 0,
                    chit_content: this.state.text.trim(),
                    location: { latitude: 0, longitude: 0 },
                    user: {
                        user_id: 0,
                        given_name: "",
                        family_name: "",
                        email: ""
                    }
                };

                arr.push(chitData);

                try {

                    await AsyncStorage.setItem('drafts', JSON.stringify(arr));
                    this.props.navigation.navigate('Feed');

                } catch (error) {
                    // Error retrieving data
                    console.log(error.message);
                }


            }

            else {
                console.log("async storage creating a new array ")

                let arr = [];



                let chitData = {
                    chit_id: 0,
                    timestamp: 0,
                    chit_content: this.state.text.trim(),
                    location: { latitude: 0, longitude: 0 },
                    user: {
                        user_id: 0,
                        given_name: "",
                        family_name: "",
                        email: ""
                    }
                };

                arr.push(chitData);

                try {

                    await AsyncStorage.setItem('drafts', JSON.stringify(arr));
                    this.props.navigation.navigate('Feed');

                } catch (error) {


                    console.log(error.message);
                }



            }
        } catch (error) {
        }
    }


    saveDraft = async (id)=>{


         const myArray = await AsyncStorage.getItem('draftsArray');
        if(myArray!=null){

            var array= JSON.parse(myArray);
            for(let i=0;i<array.length;i++){
              if(array[i].chit_id==id){
                array[i].chit_content = this.state.text.trim();
                console.log("Saved");
                await AsyncStorage.setItem('draftsArray', JSON.stringify(array));
                this.setState({
              
                    isChitLoaded:true
      
                } )


              }
              else{
                console.log("Not Saved reason: "+ array[i].chit_id+"doesnt match");
              }
            }
            
        }





    }



    delete = async (id)=>{
        this.setState({ isRefreshing: true }); 
         const myArray = await AsyncStorage.getItem('draftsArray');
        if(myArray!=null){

            var array= JSON.parse(myArray);
            for(let i=0;i<array.length;i++){
              if(array[i].chit_id==id){
                await array.splice(i,1);
                console.log("Removed");

              }
              else{
                console.log("NOt REMOVED reason: "+ array[i].chit_id+"doesnt match");
              }
            }
            this.setState({
              
                chitData: array,
                isRefreshing: false,
                isLoaded:true
  
            },async ()=>{
              await AsyncStorage.setItem('draftsArray', JSON.stringify(array));
              this.props.navigation.navigate('Drafts');

            })
        }   
      }

    handlePost = () => {

        var now = new Date();
        var nowLong = now.getTime();
        var postData = {
            chit_id: 0,
            timestamp: nowLong,
            chit_content: this.state.text.trim(),
            location: { latitude: 0, longitude: 0 },
            user: {
                user_id: 0,
                given_name: "",
                family_name: "",
                email: ""
            }
        };

        var axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.token,
            }
        };

        console.log(axiosConfig.headers);

        axios.post('http://10.0.2.2:3333/api/v0.0.5/chits', postData, axiosConfig
        )
            .then(function (response) {

                if (this.state.image) {

                    console.log("****PHOTO NOT NULL");
                    console.log("received chit id" + response.data.chit_id);
                    let customConfig = {

                        headers: {

                            'X-Authorization': this.state.token,
                            'Content-Type': 'image/jpeg',
                        }


                    }

                    this.customSendImage(customConfig, this.state.image, response.data.chit_id);

                }
                else {
                    this.props.navigation.navigate('Feed');
                }

            }.bind(this))
            .catch(function (error) {
                alert(error);
            });
    };
    customSendImage(config, data, id) {

        return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/' + id + '/photo', {
            method: 'POST',
            headers: {
                'X-Authorization': this.state.token,
                'Content-Type': 'image/jpeg'
            },
            body: this.state.image
        })
            .then((response) => {
                console.log("uploaded image succesfully");
                this.props.navigation.navigate('Feed');

            })

    }

    render() {


        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>

                    <TouchableOpacity onPress={()=>this.saveDraft(this.state.chitData.chit_id)}>

                        <Text style={{ fontWeight: "500" }}>Save </Text>
                    </TouchableOpacity>


                    <TouchableOpacity  style={{ paddingLeft: 120 }}onPress={()=>this.delete(this.state.chitData.chit_id)}>

                        <Text style={{ fontWeight: "500" }}>Delete </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ paddingLeft: 130 }} onPress={this.handlePost}>

                        <Text style={{ fontWeight: "500" }}>Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Image source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo?'+new Date() }} style={styles.avatar}></Image>
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

                <TouchableOpacity style={styles.photo} onPress={() => this.pickImage()}>
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
