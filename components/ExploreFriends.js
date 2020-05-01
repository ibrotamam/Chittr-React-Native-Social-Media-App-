import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-ionicons';
import Base64 from '../assets/Base64';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
          profileId:"",
          isProfileId:false,
            id:"",
            token:"",
            followText:'Follow',
            isIdLoaded:false,
            isTokenLoaded:false,
         isImageLoaded:false,
         image:'',
         isFollowersLoaded:false,
         isFollowingLoaded:false,
         isDataLoaded:false,
         followersData:[],
         followingData:[],
         followers:200,
         following:100,
         followingStatus:false,
         profileData:""
        };
      }


      getAllData = async ()=>{

        const { params } = this.props.navigation.state;
        const userId = params ? params.userId : null

        this.setState({
          profileId:userId,
          isProfileId:true
         },()=>this.getProfile());


      }

      getFollowers = async ()=>{

       
        axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profileId+'/followers')
        .then(function (response) {

            console.log("raw response"+response);
            console.log("followers length"+response.data.length);
          this.setState({
              
              followers:response.data.length,
              followersData:response.data,
              isFollowersLoaded:true

          },()=>this.getFollowing());
          
        }.bind(this))
        
        .catch(function (error) {
          console.log(error);
        });


    }

    getFollowing =  async ()=>{

        const { params } = this.props.navigation.state;
        const userId = params ? params.userId : null;
        axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profileId+'/following')
        .then(function (response) {


            console.log("raw response"+response);
            console.log("following response"+response.data.length);
          this.setState({
              
              following:response.data.length,
              followingData:response.data,
              isFollowingLoaded:true

          },()=>this.getImage())
          
          
        }.bind(this))
        
        .catch(function (error) {
          console.log(error);
        });


    }

    follow = async ()=>{

        console.log("async id" +this.state.id);
        console.log("token async"+ this.state.token);
  
        
        if(!this.state.followingStatus){
  
  
          var axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.token,
            }
          };
    
          var postData ={};
        
        axios.post('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profileId+'/follow', postData,axiosConfig
         )
            .then(function (response) {
              
               this.setState({
                followText:"Unfollow",
                followingStatus:true
              })
              this.getFollowers();
              this.getFollowing();
              
              
      
            }.bind(this))
            .catch(function (error) {
              alert(error);
            });
          } 
  
          else{
  
            var config = {
              headers: {
                  'X-Authorization': this.state.token,
              }
            };
      
            var postdata ={};
    
            axios.delete('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profileId+'/follow',config
         )
            .then(function (response) {
              this.setState({
                followText:"Follow",
                followingStatus:false
              })
              console.log(response);
              this.getFollowers();
              this.getFollowing();     
             }.bind(this))
            .catch(function (error) {
              alert(error);
            });
          }
        
      }

    checkFollowStatus(){ 

        var found = false;
        console.log("followers length"+this.state.followersData.length);
        console.log("followers data"+this.state.followersData);

        for( var i = 0; i < this.state.followersData.length; i++ ) {
          console.log("********PROFILE ID"+this.state.profileId);
          console.log("*********FOLLOWING USER ID"+this.state.followersData[i].user_id);
        if ( this.state.followersData[i].user_id == this.state.id) {
          console.log("following user id"+this.state.followersData[i].user_id);
        found = true;
        break;
        }
      }
  
      if ( found ) {
        console.log("***********FOUND*********");
        this.setState({
          followingStatus:true,
          followText:"Unfollow"
        })
  
      } else {
        console.log("***********NOT FOUND*********");
  
        this.setState({
          followingStatus:false,
          followText:"Follow"
        })
  
    
      }
        
        
      }

      getImage = async ()=> {
        axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profileId+'/photo?'+new Date(),{responseType:'arraybuffer'})
        .then(function (response) {

          const base64 = Base64.btoa(

            new Uint8Array(response.data).reduce(

            (data, byte) => data + String.fromCharCode(byte),

            '',

            ),
        
        );

        this.setState({

          image:'data:image/png;base64,'+base64,
          isImageLoaded:true



        },()=>this.checkFollowStatus());
   
        }.bind(this))
        
        .catch(function (error) {
          console.log('photo error'+error);
        });
      }

      getProfile= async ()=> {
        axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.profileId)
        .then(function (response) {
            console.log(response);

          this.setState({
              
              profileData: response.data,
              isDataLoaded:true

          },()=>this.getFollowers())
          
          
        }.bind(this))
        
        .catch(function (error) {
          console.log(error);
        });
    }

    renderPost = post => {
      console.log("item 1"+ post.chit_content);
        return (
            <View style={styles.feedItem}>

                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                        </View>

                        <Ionicons name="ios-more" size={24} color="#73788B" />
                    </View>
                    <Text style={styles.post}>{post.chit_content}</Text>
                    <View style={{ flexDirection: "row" }}>
                      
                    </View>
                </View>
            </View>

            
        );
    };



   componentDidMount(){
     
       AsyncStorage.getItem('userToken').then((value) => this.setState({ 'token': value ,isTokenLoaded:true },
       ()=>AsyncStorage.getItem('userId').then((value) => this.setState({ 'id': value ,isIdLoaded:true},
       ()=>this.getAllData()))
       ));
    }

  render() {

    if(this.state.isProfileId&&this.state.isDataLoaded&&this.state.isFollowingLoaded&&this.state.isFollowersLoaded&&this.state.isImageLoaded&&this.state.isIdLoaded&&this.state.isTokenLoaded){
      return (
        <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                  <Image style={styles.avatar} source={{uri: this.state.image}}/>
                  <Text style={styles.name}>
                    {this.state.profileData.given_name + " " + this.state.profileData.family_name}
                  </Text>
              </View>
            </View>
  
            <View style={styles.profileDetail}>
              
              <View style={styles.detailContent}>
                <Text style={styles.title}>Followers</Text>
       <Text style={styles.count}>{this.state.followers}</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.title}>Following</Text>
                <Text style={styles.count}>{this.state.following}</Text>
              </View>
  
              <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.follow()}>
                  <Text>{this.state.followText}</Text>  
                </TouchableOpacity> 
              
            </View>
         
            <FlatList 
                      style={styles.feed}
                      data={this.state.profileData.recent_chits}
                      keyExtractor={({ chit_id }, index) => String(chit_id)}

                      renderItem={({ item }) => this.renderPost(item)}
                      
                      showsVerticalScrollIndicator={false}
                  ></FlatList>
           
              <View style={styles.bodyContent}>
  
              </View>
        </View>
      );}
    else{

        return(
            <ActivityIndicator  style ={{flex:1}} size="large" color="#fcfc03"/>
        );
    }
  }
}

const styles = StyleSheet.create({

  feed: {
      marginTop: 30
  },
  feedItem: {
      borderBottomColor:"#fcfc03",
      borderBottomWidth:2,
      backgroundColor: "#FFF",
      borderRadius: 5,
      padding: 8,
      flexDirection: "row",
      marginVertical: 8
  },
header:{
  backgroundColor: "#fcfc03",
},
headerContent:{
    
  padding:30,
  alignItems: 'center',
},
avatar: {
  width: 130,
  height: 130,
  borderRadius: 60,
  borderWidth: 4,
  borderColor: "white",
  marginBottom:10,
},
name:{
  fontSize:22,
  
  color:"#000000",
  fontWeight:'600'
},
profileDetail:{
    
  borderRadius:30,
  alignSelf: 'center',
  marginTop:200,
  alignItems: 'center',
  flexDirection: 'row',
  position:'absolute',
  backgroundColor: "#ffffff"
},
detailContent:{
  borderRadius:20,
  margin:10,
  alignItems: 'center'
},
title:{
  fontSize:20,
  color: "#000000"
},
count:{
  fontSize:18,
},
bodyContent: {
  flex: 1,
  alignItems: 'center',
  padding:30,
  marginTop:40
},
textInfo:{
  fontSize:18,
  marginTop:20,
  color: "#000000",
},
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
description:{
  fontSize:20,
  color: "#000000",
  marginTop:10,
  textAlign: 'center'
},
post: {
  marginTop: 16,
  fontSize: 14,
  color: "#838899"
}
});