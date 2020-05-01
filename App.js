import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './components/Login';
import Register from './components/Register';
import Chitts from './components/Chitts';
import PostChitts from './components/PostChits';
import Profile from './components/Profile';
import Friends from './components/Friends';
import ExploreFriends from './components/ExploreFriends';
import Camera from './components/Camera';
import AsyncStorage from '@react-native-community/async-storage';
import UpdateProfile from './components/UpdateProfile';
import Drafts from './components/Drafts';
import ExploreDrafts from './components/ExploreDrafts';
import Followers from './components/Followers';
import Following from './components/Following';
import axios from 'axios';


import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
class App extends Component {
  render() {
    return <AppContainer />;
  }
}
export default App;

class WelcomeScreen extends Component {



  
  render() {
    return (

      
      <Login navigation={ this.props.navigation }/>


    );
  }
}






const FeedStack = createStackNavigator(
  {
    Feed: {
      screen: Chitts,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: 'Chitts',

          headerRight:  (
            <Icon  style={{ paddingRight: 10 }} onPress={() => navigation.navigate('PostChitts')} name="plus-circle" size={30}  color = "#000000"/>
          ),
          
          headerLeft: (
            <Icon  style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="align-justify" size={30}  color = "#000000"/>
          )

        
          
        };
      }
    },
    PostChitts: {
      screen: PostChitts
    },
    Camera:{
      screen:Camera
    }
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

const Logout = (navigation)=>{

  var token;

  AsyncStorage.getItem('userToken').then(
    
    (value) => {token= value;

      var postData = {
    
      };
      
      var axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
        }
      };
    
      console.log(axiosConfig.headers);
    
    
    
     axios.post('http://10.0.2.2:3333/api/v0.0.5/logout', postData,axiosConfig
    )
      .then(function (response) {
        console.log("received chit id"+response.data.chit_id);
        
        navigation.navigate('Login');
    
      }.bind(this))
      .catch(function (error) {
        alert(error);
      });
    
    
    
    }
  
  
  );


  


  
  

}



const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Profile',
        headerLeft: (
          <Icon  style={{ paddingLeft: 10 }} onPress={()=> Logout(navigation)} name="unlock-alt" size={30}  color = "#000000"/>
        )
        
      };
    }
  },
  Followers:{

    screen: Followers,
    



  },
  Following:{

    screen: Following,
    



  },
  ExploreFriends:{

    screen: ExploreFriends,
    



  },
  UpdateProfile:{

    screen: UpdateProfile,
    



  }
  
});
const FriendsStack = createStackNavigator({
  Friends: {
    screen: Friends,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Friends',
        
      };
    }
  },
  ExploreFriends: {
    screen: ExploreFriends,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Find Friends',
        
      };
    }
  }
  
});


const DraftsStack = createStackNavigator({
  Drafts: {
    screen: Drafts,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Drafts',
        
      };
    }
  },
  ExploreDrafts: {
    screen: ExploreDrafts,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Edit Draft',
        
      };
    }
  }
  
});

const DashboardTabNavigator = createBottomTabNavigator(
  {

    Chitts: { screen:FeedStack,
      navigationOptions: ({ navigation }) => {
        
    return{
          tabBarIcon: (<Icon  name="home" size={30}  color = "black"/>)

          
    };
      }
    },
    Profile: { screen:ProfileStack,
      navigationOptions: ({ navigation }) => {
        
        return{
              tabBarIcon: (<Icon  name="user" size={30}  color = "black"/>)
    
              
        };
          }},
    Friends: { screen:FriendsStack,
      navigationOptions: ({ navigation }) => {
        
        return{
              tabBarIcon: (<Icon  name="search" size={30}  color = "black"/>)
    
              
        };
          }}
    
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        header: null,
        
      };
    }
  }
);
const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        
      };
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard:DashboardStackNavigator,
  Friends:Friends,
  Drafts:DraftsStack,
  Profile:Profile},{

    overlayColor: 'rgba(0, 0, 0, 0.7)'
});

const AppSwitchNavigator = createSwitchNavigator({
  Welcome: { screen: WelcomeScreen },
  Dashboard: { screen: AppDrawerNavigator },
  Register: {screen: Register},
  Login:{screen:Login},
  PostChitts:{screen:PostChitts},
  Camera:{screen:Camera}
});

const AppContainer = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
