import React, {Component, useEffect, PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ReadMore from '@fawazahmed/react-native-read-more';
import { getUniqueId, getVersion } from 'react-native-device-info';
import Share from 'react-native-share';
import { API_URL } from "./constants"
import { isEmpty } from './Utils'

export default class HomeScreenItem extends Component {
    shouldComponentUpdate(nextProps, nextState) {   
      //   const { follow_ups, item } = this.props;
      //   // fase = not reload item, true =  reload item all
    
      //   // T - T, F - F = 0 << use case ***
      //   // T - F, F - T = 1
      //   return  (nextProps.follow_ups.includes(item.id) ^ follow_ups.includes(item.id))

      const {___follow_ups, item} = this.props;

      if(isEmpty(nextProps.___follow_ups)){
        return true
      }

      const n = nextProps.___follow_ups.find(value=> String(value.id) === String(item.id));
      const nn = ___follow_ups.find(value=> String(value.id) === String(item.id))

      if( !isEmpty(n) && !isEmpty(nn) ){
        if(!(n.follow_up && nn.follow_up)){
          return true
        }
        return false
      }else if( !isEmpty(n) ){
        return true
      }else if( !isEmpty(nn) ){
        return true
      }else{
        return false
      }

    }
  
    renderImage = (item) =>{
      if(isEmpty(item.images.thumbnail)){
        return <View />
      }
  
      let thumbnail = item.images.thumbnail
      switch(thumbnail.length){
        case 0:{
          return(<View />)
        }
        case 1 :{
          return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <TouchableOpacity
                      onPress={()=>{
                        this.props.onUpdateState({showModalLogin:false, modalVisible: true, init_index: 0, mv: item.id})
                      }}
                      style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0].url,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>)
        }
  
        case 2 :{
          return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity 
                    onPress={()=>{
                      this.props.onUpdateState({showModalLogin:false, modalVisible: true, init_index: 0, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[0].url,
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={()=>{
                      this.props.onUpdateState({showModalLogin:false, modalVisible: true, init_index: 1, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[1].url,
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                      
                  </TouchableOpacity>
                  
                </View>
              </View>)
        }
  
        default:{
          return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <TouchableOpacity 
                    onPress={()=>{
                      // this.setState({modalVisible: true, init_index: 0, mv: item.id})
                      this.props.onUpdateState({showModalLogin:false, modalVisible: true, init_index: 0, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0].url,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}

                        onLoadStart={e => console.log('Loading Start')}
                        onProgress={e =>
                        console.log(
                            'Loading Progress ' +
                            e.nativeEvent.loaded / e.nativeEvent.total
                        )
                        }
                        onLoad={e =>
                        console.log(
                            'Loading Loaded ' + e.nativeEvent.width,
                            e.nativeEvent.height
                        )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={()=>{
                      this.props.onUpdateState({showModalLogin:false, modalVisible: true, init_index: 1, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1].url,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        onLoadStart={e => console.log('Loading Start')}
                        onProgress={e =>
                            console.log(
                                'Loading Progress ' +
                                e.nativeEvent.loaded / e.nativeEvent.total
                            )
                        }
                        onLoad={e =>
                            console.log(
                                'Loading Loaded ' + e.nativeEvent.width,
                                e.nativeEvent.height
                            )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity 
                    onPress={()=>{
                      this.props.onUpdateState({showModalLogin:false, modalVisible: true, init_index: 2, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[2].url,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        onLoadStart={e => console.log('Loading Start')}
                        onProgress={e =>
                        console.log(
                            'Loading Progress ' +
                            e.nativeEvent.loaded / e.nativeEvent.total
                        )
                        }
                        onLoad={e =>
                        console.log(
                            'Loading Loaded ' + e.nativeEvent.width,
                            e.nativeEvent.height
                        )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />
  
  {
    thumbnail.length > 3 ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  opacity: 0.5, backgroundColor: 'black', }} >
                            <Text style={{fontWeight:'bold', fontSize:33, color:'white'}}>+{thumbnail.length - 3}</Text>
                          </View>
                          : <View />

  }
                    
                  </TouchableOpacity>
                </View>
              </View>)
        }
  
        /*
        case 4:{
          return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 0, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[0],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 1, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[1],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 2, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[2],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 3, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[3],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                  </TouchableOpacity>
                </View>
              </View>)
        }
  
        default:{
          return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                      <TouchableOpacity 
                      onPress={()=>{
                        this.setState({modalVisible: true, init_index: 0, mv: item.id})
                      }} 
                      style={{flex: 1, margin: 2, }} >
                        <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[0],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity 
                      onPress={()=>{
                        this.setState({modalVisible: true, init_index: 1, mv: item.id})
                      }} 
                      style={{flex: 1, margin: 2, }} >
                        <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[1],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                      </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <TouchableOpacity 
                      onPress={()=>{
                        this.setState({modalVisible: true, init_index: 2, mv: item.id})
                      }} 
                      style={{flex: 1, margin: 2, }} >
                        <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[2],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity 
                      onPress={()=>{
                        this.setState({modalVisible: true, init_index: 3, mv: item.id})
                      }} 
                      style={{flex: 1, margin: 2, }} >
                        <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[3],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity 
                      onPress={()=>{
                        this.setState({modalVisible: true, init_index: 4, mv: item.id})
                      }} 
                      style={{flex: 1, margin: 2, }} >
                        <FastImage
                          style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                          containerStyle={{ ...StyleSheet.absoluteFillObject }}
                          source={{
                              uri: thumbnail[4],
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          />
                          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  opacity: 0.5, backgroundColor: 'black', }} >
                            <Text style={{fontWeight:'bold', fontSize:33, color:'white'}}>+{thumbnail.length - 5}</Text>
                          </View>
                      </TouchableOpacity>
                    </View>
                  </View>)
        }
  
        */
      }
    }
  
    isOwner = (id_check) => {
      return this.props.my_apps.includes(id_check)
    }
  
    render() {
      const { navigation, item, ___follow_ups, ___followUp } = this.props;
      let _menu = null;
      let _this = this;

      return (
        <TouchableOpacity 
          key={Math.floor(Math.random() * 100) + 1}
          style={styles.listItem}
          onPress={()=>{
            navigation.navigate('detail', {data:item})
          }}>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row'}}>
              <View style={{position:'absolute', right: 0, flexDirection:'row'}}>
                <TouchableOpacity 
                  style={{ padding:3,}}
                  onPress={()=>{
  
                    let cL = this.props.user
                    if(isEmpty(cL)){
                      _this.props.onUpdateState({showModalLogin: true})
                    }else{
                   
                      let follow_up = true;
                      if(!isEmpty(___follow_ups)){
                        let find_fup = ___follow_ups.find(value => String(value.id) === String(item.id) )
                        // console.log('fup : ', find_fup, item.id)
  
                        if(!isEmpty(find_fup)){
                          follow_up = !find_fup.follow_up
                        }
                      }

                      if(follow_up){
                        _this.props.toast.show("Follow up");
                      }else{
                        _this.props.toast.show("Unfollow up");
                      }

                      ___followUp({"id": item.id, 
                                   "local": true, 
                                   "follow_up": follow_up, 
                                   "unique_id": getUniqueId(), 
                                   "owner_id": item.owner_id, 
                                   "date": Date.now()}, 0);
                    }
                    
                  }}>
                  { 
                    !this.isOwner(item.id) &&
                    <Ionicons 
                      name="shield-checkmark-outline" 
                      size={25} 
                      /*color={isEmpty(follow_ups.find( f => f === id )) ? 'gray' : 'red'}*/ 
                      color={isEmpty(___follow_ups) ? 'gray' : (isEmpty(___follow_ups.find( value => String(value.id) === String(item.id) && value.follow_up )) ? 'gray' : 'red')} />
                  }
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
                          url: API_URL + "/node/" +item.id,
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
                        
                        if(isEmpty(this.props.user)){
                          _this.props.onUpdateState({showModalLogin: true})
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
              <View>
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
                  <Text style={{color:'gray'}}>{item.transfer_amount}</Text>
                </View>
                {/* transfer_date */}
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                  <Text style={{color:'gray'}}>{item.transfer_date ==='' ? '-' : item.transfer_date}</Text>
                </View>
              </View>
            </View>
            <View style={{paddingRight:5, paddingBottom:5}}>
              {this.renderImage(item)}
            </View>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
              <View style={styles.root}>
                <ReadMore 
                  ellipsis={''} 
                  seeMoreText={'See More'} 
                  seeLessText={''}
                  animate={false} 
                  numberOfLines={3} 
                  seeMoreStyle={{color:'black'}}
                  style={styles.textStyle}>{ item.detail == '' ? '-' : item.detail}</ReadMore>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
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
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
    },
    listItem:{
      margin:5,
      padding:10,
      backgroundColor:"#FFF",
      borderRadius:5
    },
    footer: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    loadMoreBtn: {
      backgroundColor: '#800000',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10,
      marginTop: 10
    },
    root: {
      flex: 1,
    },
    textStyle: {
      fontSize: 14,
      color:'gray'
    },
  });

