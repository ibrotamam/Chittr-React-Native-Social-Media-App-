import React from 'react';
import { TouchableOpacity,View, Text, StyleSheet, Image, FlatList,RefreshControl, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';



posts =[];

chitdata =[]

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          chitData:[],
          isRefreshing: false,
          isLoaded:false
          
        };
    
      }

      onRefresh= async () =>{


        this.setState({ isRefreshing: true }); 

        const myArray = await AsyncStorage.getItem('draftsArray');
        if(myArray!=null){

            this.setState({
              
                chitData: JSON.parse(myArray),
                isRefreshing: false,
                isLoaded:true
  
            })
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
              this.getChits();

            })
        }
        
      }

      getChits = async  ()=>{

        this.setState({ isRefreshing: true }); 

        const myArray = await AsyncStorage.getItem('draftsArray');
        if(myArray!=null){
            
            this.setState({
              
                chitData: JSON.parse(myArray),
                isRefreshing: false,
                isLoaded:true
  
            })
        }



      }

      
      didFocus = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.getChits();
        }
      );
      

    componentDidMount(){

      this.didFocus;

      this.getChits();

      
      }
    

    renderPost = post => {

        
      
        return (
            <View style={styles.feedItem}>

                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>

                        </View>

                    </View>
                    <Text style={styles.post}>{post.chit_content}</Text>


                    <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                    style={{ width: "100%", marginTop:10 }}
                    onPress={ ()=>this.props.navigation.navigate('ExploreDrafts',{chit:post, index:post.index}) }>
                    <Text
                      style={
                        styles.btnUpdate
                         }>
                      Expand
                    </Text>

                    
                  </TouchableOpacity>

                    </View>


                    <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                    style={{ width: "100%", marginTop:10 }}
                    onPress={ ()=> this.delete(post.chit_id) }>
                    <Text
                      style={
                        styles.btnDelete
                         }>
                      Delete
                    </Text>

                    
                  </TouchableOpacity>

                    </View>
                </View>
            </View>
        );

        
       

    
    };

    render() {

        


        if(this.state.isLoaded){
        return (
            <View style={styles.container}>


<TouchableOpacity
        style={{ paddingTop: 20 }}
        onPress={() => this.props.navigation.navigate('Dashboard')}>
        <Image
          style={styles.barBackButtonSize}
          source={require("../assets/arowLeft.png")}
        />
      </TouchableOpacity>
               
                
                <FlatList
                    style={styles.feed}
                    data={this.state.chitData}
                    keyExtractor={({ chit_id }, index) => String(chit_id)}

                    
                    renderItem={({ item }) => this.renderPost(item)}
                    refreshControl={
                        <RefreshControl
                          refreshing = {this.state.isRefreshing}
                          onRefresh={this.onRefresh.bind(this)}
                        />
                      }
                    showsVerticalScrollIndicator={false}
                ></FlatList>
            </View>
        );

                    }
        else{
            return(

                <ActivityIndicator/>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4"
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
      btnDelete: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
        padding: 11,
        backgroundColor: "red",
        borderRadius: 5,
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        textAlign: "center"  
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
        borderColor:'#fcfc03',
        borderWidth:2,
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
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    },
    barBackButtonSize:{
      width: 20,
      height: 20,
    }
});
