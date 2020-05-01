import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, RefreshControl } from 'react-native';
import Ionicons from 'react-native-ionicons';
import moment from 'moment';
import axios from 'axios';
import Base64 from '../assets/Base64';

posts = [];

chitdata = []

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      chitData: [],
      isRefreshing: false,
      hasPhoto: false,
      photo: '',
      photos: []

    };




  }

  onRefresh() {


    this.setState({ isRefreshing: true });

    axios.get('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=20')
      .then(function (response) {

        this.setState({

          chitData: response.data,
          isRefreshing: false

        })


      }.bind(this))

      .catch(function (error) {
        console.log(error);
        this.setState({


          isRefreshing: false

        })
      });



  }



  UNSAFE_componentWillMount() {

    axios.get('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=20')
      .then(function (response) {

        this.setState({

          chitData: response.data

        })


      }.bind(this))

      .catch(function (error) {
        console.log(error);
      });

  }


  getImage = async (id) => {
    axios.get('http://10.0.2.2:3333/api/v0.0.5/user/' + id + '/photo', { responseType: 'arraybuffer' })
      .then(function (response) {

        const base64 = Base64.btoa(

          new Uint8Array(response.data).reduce(

            (data, byte) => data + String.fromCharCode(byte),

            '',

          ),

        );

        this.setState({

          photo: 'data:image/png;base64,' + base64,
          hasPhoto: true



        });



      }.bind(this))

      .catch(function (error) {
        console.log('photo error' + error);
      });
  }

  didFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this.getChits();
    }
  );


  getChits = () => {

    axios.get('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=30')
      .then(function (response) {

        this.setState({

          chitData: response.data

        })


      }.bind(this))

      .catch(function (error) {
        console.log(error);
      });




  }



  componentDidMount() {

    this.didFocus;

    this.getChits();






  }



  getPostPhoto = (id) => {


    axios.get('http://10.0.2.2:3333/api/v0.0.5/chits/' + id + '/photo')
      .then(function (response) {

        this.setState({

          hasPhoto: true,
          photo: response

        })


      }.bind(this))

      .catch(function (error) {
        this.setState({

          hasPhoto: false

        })
      }.bind(this));


  }



  renderPost = post => {

    //this.getImage(post.chit_id);

    if (true) {
      return (
        <View style={styles.feedItem}>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={styles.timestamp}>{post.user.given_name + ' ' + post.user.family_name}</Text>

                <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
              </View>

            </View>
            <Text style={styles.post}>{post.chit_content}</Text>
            <Image source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/+' + post.chit_id + '/photo' }} style={styles.postImage} resizeMode="cover" />


            <View style={{ flexDirection: "row" }}>
            </View>
          </View>
        </View>
      );

    }

    return (
      <View style={styles.feedItem}>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={styles.timestamp}>{post.user.given_name + ' ' + post.user.family_name}</Text>

              <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
            </View>

          </View>
          <Text style={styles.post}>{post.chit_content}</Text>



          <View style={{ flexDirection: "row" }}>
          </View>
        </View>
      </View>);
  };

  render() {

    return (
      <View style={styles.container}>


        <FlatList
          style={styles.feed}
          data={this.state.chitData}
          keyExtractor={({ chit_id }, index) => String(chit_id)}

          renderItem={({ item }) => this.renderPost(item)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          showsVerticalScrollIndicator={false}
        ></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBECF4"
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500"
  },
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    borderColor: '#fcfc03',
    borderWidth: 2,
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "black"
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "black"
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16
  }
});
