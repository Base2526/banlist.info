/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image 
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import { connect } from 'react-redux';
const axios = require('axios');
var Buffer = require('buffer/').Buffer
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUniqueId, getVersion } from 'react-native-device-info';

import { NumberFormat, isEmpty } from './Utils'
import {API_URL, API_URL_SOCKET_IO} from "./constants"


class ResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
                  offset: 0,
                  data:[],
                  loading: false
                };
  }

  componentDidMount() {
    // let { navigation, route } = this.props;
    // let key_search =  route.params.key_search;

    this.handleSearch()
  }

  handleSearch= () => {
    let { navigation, route, offset } = this.props;

    let _this = this;
    
    // if(!offset){
    //   _this.setState({spinner: true, datas:[]})
    // }else{
      _this.setState({loading: true})
    // }

    /**
      let text = '';
      switch(id){
        case '0':{
          text = 'ti:';
          break;
        }

        case '1':{
          text = 'ns:';
          break;
        }

        case '2':{
          text = 'in:';
          break;
        }
      }

      { section: '1', id: '0', title: 'ti:', ex: 'Ex. title' },
      { section: '1', id: '1', title: 'ns:', ex: 'Ex. name subname' },
      { section: '1', id: '2', title: 'in:', ex: 'Ex. 33209xxxxxx72' },

      1 : title
      2 : name
      3 : surname
      4 : detail
      5 : name & surname
    */

    let key_search = route.params.key_search;
    let type = 0;
    switch(key_search.substring(0, 3)){
      case 'ti:':{
        type = 1;
        key_search = key_search.substring(3, key_search.length)
        break;
      }

      case 'ns:':{
        type = 5;
        key_search = key_search.substring(3, key_search.length)
        break;
      }

      case 'in:':{
        type = 6;
        key_search = key_search.substring(3, key_search.length).replace(" ", "&")
        break;
      }
    }
    
    axios.post(`${API_URL}/api/search?_format=json`, {
      key_word: key_search,
      offset,
      type
    }, {
      headers: { 
        'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx` 
      }
    })
    .then(function (response) {
      let results = response.data
      // console.log()
      if(results.result){
        // true
        console.log('result search : ', results);
        // console.log(results);

        let {execution_time, datas, count} = results;
        // console.log(execution_time);
        // console.log(count);
        // console.log(datas);

        if(datas && datas.length > 0){

          // console.log(datas)
          _this.setState({spinner: false, execution_time, data:[ ..._this.state.data, ...datas], count, loading: false});
        }else{

          _this.setState({spinner: false, loading: false})
          // alert('Empty result.');

          _this.toast.show('Empty result.');
        }
        
      }else{
        // false
        console.log(results);

        // _this.setState({spinner: false, loading: false})
      }
    })
    .catch(function (error) {

      // _this.setState({spinner: false, loading: false})

      console.log(error);
    });
  }

  renderItem = (item) =>{
    // console.log(item.id)
    const { navigation, follow_ups } = this.props;

    let _menu = null;
    let _this = this

    return(<TouchableOpacity 
            key={item.id}
            style={{padding:5}}
            onPress={()=>{
              navigation.navigate('detail', {data:item})
            }}>
          <View style={{flex:1, backgroundColor:'#fff' }}>
            <View style={{position:'absolute', right: 0, flexDirection:'row', padding:10}}>
              <TouchableOpacity 
                style={{ padding:3,}}
                onPress={ async ()=>{
                  let cL = this.props.user
                  // console.log(API_URL_SOCKET_IO(), cL.uid, item.id, getUniqueId())
                
                  if(isEmpty(cL)){
                    this.setState({ bottomModalAndTitle: true })
                  }else{
                    axios.post(`${API_URL_SOCKET_IO()}/api/follow_up`, {
                      uid: cL.uid,
                      id_follow_up: item.id,
                      unique_id: getUniqueId(),
                      owner_id: item.owner_id
                    }, {
                      headers: { 
                        'Content-Type': 'application/json',
                      }
                    })
                    .then(function (response) {
                      let {result, message} = response.data

                      // console.log('message :', message)
                      if(result){

                      }else{
                        
                      }
                      _this.toast.show(message);
                    })
                    .catch(function (error) {
                      console.log('error :', error)
                      // _this.setState({loading: false})
                    });
                  }
                }}>
                <Ionicons 
                  name="shield-checkmark-outline" 
                  size={25} 
                  color={isEmpty(follow_ups) ? 'gray' : (isEmpty(follow_ups.find( f => String(f) === String(item.id) )) ? 'gray' : 'red')} 
                />
              </TouchableOpacity>
              <View style={{justifyContent:'center'}}>
                <Menu
                  ref={(ref) => (_menu = ref)}
                  button={
                    <TouchableOpacity 
                      style={{ paddingLeft:3, }}
                      onPress={()=>{
                        _menu.show()
                      }}>
                    <MaterialIcons name="more-vert" size={25} color={'grey'}  />
                    </TouchableOpacity>
                  }>
                  <MenuItem onPress={() => {
                          _menu.hide();
                          const shareOptions = {
                              title: 'Share Banlist',
                              url: item.link,
                              failOnCancel: false,
                          };

                          Share.open(shareOptions)
                          .then((res) => {
                              // console.log(res);
                          })
                          .catch((err) => {
                              err && console.log(err);
                          });
                        }} style={{flex:1, justifyContent:'center'}}>
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="share" size={25} color={'grey'}  />
                        <Text style={{ textAlign: 'center' }}>Share</Text>
                      </View>
                  </MenuItem>

                  <MenuItem onPress={ async () => {
                          _menu.hide();
                          
                          let cL = this.props.user
                          if(isEmpty(cL)){
                            this.setState({ bottomModalAndTitle: true })
                          }else{
                            navigation.navigate('report', {data:item})
                          }
                        }} style={{flex:1, justifyContent:'center'}}>
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="report" size={25} color={'grey'}  />
                        <Text style={{ textAlign: 'center' }}>Report</Text>
                      </View>
                  </MenuItem>
                </Menu>
              </View> 
            </View>
            <View style={{ padding:10 }}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
                <TouchableOpacity 
                  style={{ }}
                  onPress={()=>{
                    navigation.navigate('filter', {data:item})
                  }}>
                  <Text style={{color:'#1a73e8'}}>{item.name} {item.surname}</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                <Text style={{color:'gray'}}>{item.title}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                <Text style={{color:'gray'}}>{NumberFormat(Number(item.transfer_amount))}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                <Text style={{color:'gray'}}>{item.transfer_date ==='' ? '-' : item.transfer_date}</Text>
              </View>
              <View style={{flexDirection:'column'}}>
                <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
                <Text style={{color:'gray'}}>{item.detail}</Text>
              </View>
            </View>
          </View>
          </TouchableOpacity>)

    return (
        <TouchableOpacity 
            key={item.id}
            style={{padding:5}}
            onPress={()=>{
              navigation.navigate('detail', {data:item})
            }}>
          <View style={{flex:1, backgroundColor:'red'}}>
            <View style={{position:'absolute', right: 0, flexDirection:'row' }}>
              <TouchableOpacity 
                style={{ padding:3,}}
                onPress={ async ()=>{

                  let cL = this.props.user
                  console.log(API_URL_SOCKET_IO(), cL.uid, id, getUniqueId())
                
                  if(isEmpty(cL)){
                    this.setState({ bottomModalAndTitle: true })
                  }else{
                    axios.post(`${API_URL_SOCKET_IO()}/api/follow_up`, {
                      uid: cL.uid,
                      id_follow_up: id,
                      unique_id: getUniqueId()
                    }, {
                      headers: { 
                        'Content-Type': 'application/json',
                      }
                    })
                    .then(function (response) {
                      let {result, message} = response.data

                      // console.log('message :', message)
                      if(result){

                      }else{
                        
                      }
                      toast.show(message);
                    })
                    .catch(function (error) {
                      console.log('error :', error)
                      // _this.setState({loading: false})
                    });
                  }
                  
                }}>
                  <Text>ddd</Text>
                {/* <Ionicons 
                name="shield-checkmark-outline" 
                size={25} 
              
                // color={isEmpty(follow_ups) ? 'gray' : (isEmpty(follow_ups.find( f => f === id )) ? 'gray' : 'red')} 
                /> */}
              </TouchableOpacity>
      
                {/* 
                <View style={{justifyContent:'center'}}>
                  <Menu
                    ref={(ref) => (_menu = ref)}
                    button={
                      <TouchableOpacity 
                        style={{ paddingLeft:3, }}
                        onPress={()=>{
                          _menu.show()
                        }}>
                      <MaterialIcons name="more-vert" size={25} color={'grey'}  />
                      </TouchableOpacity>
                    }>
                    <MenuItem onPress={() => {
                            _menu.hide();
                            const shareOptions = {
                                title: 'Share Banlist',
                                url: item.link,
                                failOnCancel: false,
                            };

                            Share.open(shareOptions)
                            .then((res) => {
                                // console.log(res);
                            })
                            .catch((err) => {
                                err && console.log(err);
                            });
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="share" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center' }}>Share</Text>
                        </View>
                    </MenuItem>

                    <MenuItem onPress={ async () => {
                            _menu.hide();
                            
                            let cL = this.props.user
                            if(isEmpty(cL)){
                              this.setState({ bottomModalAndTitle: true })
                            }else{
                              navigation.navigate('report', {data:item})
                            }
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="report" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center' }}>Report</Text>
                        </View>
                    </MenuItem>
                  </Menu>
                </View> */}
              </View>
            <View style={{ flex:1, backgroundColor:'#fff', padding:10 }}>
            {/*      'name'    => $name, 
                      'surname' => $surname,  */}
            <View style={{flexDirection:'row'}}>
              <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
              {/* <Text>{item.name} {item.surname}</Text> */}

              <TouchableOpacity 
                style={{ }}
                onPress={()=>{
                  navigation.navigate('filter', {data:item})
                }}>
                <Text style={{color:'#1a73e8'}}>{item.name} {item.surname}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
              <Text style={{color:'gray'}}>{item.title}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
              <Text style={{color:'gray'}}>{NumberFormat(Number(item.transfer_amount))}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                    <Text style={{color:'gray'}}>{item.transfer_date ==='' ? '-' : item.transfer_date}</Text>
                </View>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
              <Text style={{color:'gray'}}>{item.detail}</Text>
            </View>
            </View>
          </View>
        </TouchableOpacity>
      );
  }

  renderFooter = () => {
    let {loading, offset} = this.state
    return (
      //Footer View with Load More button
      <TouchableOpacity
          activeOpacity={0.9}
          onPress={()=>{
            this.setState({
              offset: offset+1
            },() => {
              this.handleSearch();
            });
          }}
          >
          <View style={{backgroundColor:'#fff', alignItems: 'center', padding:10, margin:5}}> 
            <View style={{flexDirection:'row'}}>
              <Text>Load More</Text>
              {loading ? (
                <ActivityIndicator color="black" style={{marginLeft: 8}} />
              ) : null}
            </View>
          </View>
      </TouchableOpacity>
    );
  };

  render(){
    let {data} = this.state
    return (<View style={styles.container}>
              <FlatList
                style={{flex:1}}
                data={data}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item, index) => String(index)}
                ListFooterComponent={this.renderFooter()}/>
              <Toast
                ref={(toast) => this.toast = toast}
                position='bottom'
                positionValue={220}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}/>
            </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  listItem:{
    margin:10,
    padding:10,
    backgroundColor:"#FFF",
    width:"80%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  }
});

const mapStateToProps = state => {
  return{
    user: state.user.data,
    follow_ups: state.user.follow_ups
  }
}

export default connect(mapStateToProps, null)(ResultScreen)
