
import React, { Component } from 'react';
import Ionicons from 'react-native-ionicons';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Base64 from '../assets/Base64';
import axios from 'axios';
export default class Profile extends Component {

    

    constructor(props) {
        super(props);
    
        this.state = {
          data:"",
          isImageLoaded:false,
          followersCount:0,
          isFollowersCount:false,
          isFollowingCount:false,
          isData:false,
          isToken:false,
          isId:false,
          image:"",
          isImage:false,
          followingCount:0, 
          token:"", 
          id:"",

          followers:[],
          following:[],
        };
      }

      getImage = async ()=> {
        axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.id+''+'/photo',{responseType:'arraybuffer'})
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



        });
         
          
        }.bind(this))
        
        .catch(function (error) {
          console.log('photo error'+error);
        });
      }

    

    getFollowers = ()=>{

      
        axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.id+'/followers')
        .then(function (response) {

            console.log("raw response"+response);
            console.log("followers length"+response.data.length);
          this.setState({
              
              followersCount:response.data.length,
              followers:response.data,
              isFollowersCount:true

          });
          
          
        }.bind(this))
        
        .catch(function (error) {
          console.log(error);
        });


    }
    getDetails =()=>
    {
      this.getProfile();
      this.getFollowers();
      this.getFollowing();
      this.getImage();

    }

    getFollowing = ()=>{

        
        axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.id+'/following')
        .then(function (response) {


            console.log("raw response"+response);
            console.log("following response"+response.data.length);
          this.setState({
              
              followingCount:response.data.length,
              following:response.data,
              isFollowingCount:true

          })
          
          
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


    getProfile= ()=> {

      
        axios.get('http://10.0.2.2:3333/api/v0.0.5/user/'+this.state.id)
        .then(function (response) {
            console.log(response);

          this.setState({
              
              data: response.data,
              isData:true

          })
          
          
        }.bind(this))
        
        .catch(function (error) {
          console.log(error);
        });
    }

     didFocus = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getDetails();
      }
    );
    componentDidMount(){

      this.didFocus;
      
      AsyncStorage.getItem('userToken').then((value) => {
        this.setState({ 'token': value, isToken:true });
        console.log("value***"+value);
        AsyncStorage.getItem('userId').then((value) => {
          this.setState({ 'id': value,isId:true },); console.log("value***"+value);

         
          this.getDetails();


        
        
        });


       
      
      }
        
        );
      


      
      
      this.setState({
          followersCount:this.state.followers.length,
          followingCount:this.state.following.length
      });


      console.log("followers count"+this.state.followersCount);
      
       
       


    }

  render() {
      console.log("recent cHITS: "+this.state.data.recent_chits);

      if(this.state.isImageLoaded){
    return (
      <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar} source={{uri: this.state.image}}/>
                <Text style={styles.name}>
                  {this.state.data.given_name + " " + this.state.data.family_name}
                </Text>
            </View>
          </View>

          <View style={styles.profileDetail}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Followers',{followers:this.state.followers})}>
            <View style={styles.detailContent}>
              <Text style={styles.title}>Followers</Text>
     <Text style={styles.count}>{this.state.followersCount}</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Following',{following:this.state.following})}>

            <View style={styles.detailContent}>
              <Text style={styles.title}>Following</Text>
              <Text style={styles.count}>{this.state.followingCount}</Text>
            </View>
            </TouchableOpacity>


            <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.props.navigation.navigate('UpdateProfile')}>
                <Text>Update Profile</Text>  
              </TouchableOpacity> 
            
          </View>
       
          <FlatList 
                    style={styles.feed}
                    data={this.state.data.recent_chits}
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
 
