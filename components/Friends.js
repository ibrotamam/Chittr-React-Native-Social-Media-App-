import React, { Component } from 'react';
import {StyleSheet,FlatList,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import axios from 'axios';
import { List, ListItem, Left, Body, Right, Thumbnail} from 'native-base';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
export default class Friends extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          data:[],
          loading: false,
          q:''
          
        };
    


    
      }

    componentDidMount(){

        this.searchRequest(this.state.q);
    }


    searchRequest= (query)=> {
        this.setState({loading:true})
        axios.get('http://10.0.2.2:3333/api/v0.0.5/search_user?q='+query)
        .then(function (response) {

          this.setState({
              
              data: response.data,
              loading:false

          })
          
          
        }.bind(this))
        
        .catch(function (error) {
          console.log(error);
        });
    }

    renderSearchResult = ({item,index})=>{
        console.log(item.user_id);

        return(


<ListItem avatar onPress={()=> this.props.navigation.navigate('ExploreFriends',{
              userId:item.user_id
              
            }
          
            )}>
  <Left>
    <Thumbnail source={{ uri: 'http://10.0.2.2:3333/api/v0.0.5/user/'+item.user_id+''+'/photo?'+ new Date() }} />
  </Left>
  <Body>
    <Text>{item.given_name}</Text>
        <Text note>{item.family_name}</Text>
  </Body>

  
  
</ListItem>
        )
    };
  render() {
    return (
      <Container >
        <Header searchBar rounded style={styles.container}>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" onChangeText={text => this.searchRequest(text)} />
            <Icon name="ios-people" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>


        <List>

            <FlatList
              data={this.state.data}
              renderItem = {this.renderSearchResult}
              keyExtractor = {(item,index)=>index.toString()}/>



        </List>
      </Container>


    );
  }
}


const styles = StyleSheet.create({
    container: {
      
        backgroundColor: "#fcfc03",
    },
    
});
