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
  Image,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
const axios = require('axios');
var Buffer = require('buffer/').Buffer
import { getUniqueId } from 'react-native-device-info';
 
import {API_URL, API_TOKEN} from "./constants"
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast'
import { ValidateEmail, isEmpty, Base64 } from './Utils'
import { userLogin, followUp, fetchMyApps, addfollowerPost } from './actions/user';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {name:'', 
                  password:'',
                  spinner: false};
  }

  componentDidMount() {
    let {user} = this.props.user;
    console.log('user : ', user)
  }

  handleLogin = () =>{
    let { navigation, route } = this.props;
    let { name, password } = this.state
    name = name.trim()
    password = password.trim()

    if( isEmpty(name) && isEmpty(password) ){
      this.toast.show('email && password empty');
    }else if( isEmpty(name) ) {
      this.toast.show('email empty');
    }else if( isEmpty(password) ) {
      this.toast.show('password empty');
    }else if( !ValidateEmail(name) ){
      this.toast.show('email invalidate.');
    }else{

      this.setState({spinner: true})

      let _this = this
      axios.post(`${API_URL}/api/login?_format=json`, {
        name, password, unique_id: getUniqueId()
      })
      .then(function (response) {
        let results = response.data
        console.log('/api/login : ', results, results.result)
        
        console.log('cccc : ', typeof results.result);
        if(results.result === true){ 
          _this.props.userLogin(results.user)
          _this.props.followUp(JSON.parse(results.follow_ups)) // follow_ups
          _this.props.fetchMyApps(results.user.basic_auth)
          _this.props.addfollowerPost(JSON.parse(results.follower_post))

          _this.setState({spinner: false}) 
          navigation.pop();
          route.params.onSelect({ isLogin: true });
        }else{
          _this.toast.show(results.message);
          _this.setState({spinner: false})
        }
      })
      .catch(function (error) {

        console.log(error)
        _this.setState({spinner: false})
      });
    }
  }

  handleForgotPassword= () =>{
    const { navigation } = this.props;
    navigation.navigate('forgot_password');
  }

  handleSignUp= () =>{
    const { navigation } = this.props;
    navigation.navigate('sign_up');
  }
 
  render(){
    return (
             <SafeAreaView style={{flex: 1}}>
             <View style={styles.container}>
                <Text>Email</Text>
                <TextInput
                  style={{height: 40,
                          borderWidth: .5,}}
                  ref= {(el) => { this.name = el; }}
                  onChangeText={(name) => this.setState({name})}
                  value={this.state.name}/>
                <Text>Password</Text>
                <TextInput
                  secureTextEntry={true}
                  style={{height: 40, 
                          borderWidth: .5,}}
                  ref= {(el) => { this.password = el; }}
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}/>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleLogin}>
                  <Text>Login</Text>
                </TouchableOpacity>

                <View style={{ flexDirection:"row",}}>
                  <TouchableOpacity
                    style={{margin:5}}
                    onPress={this.handleForgotPassword}>
                    <Text>Forgot Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{margin:5}}
                    onPress={this.handleSignUp}>
                    <Text>Sign up</Text>
                  </TouchableOpacity>
                </View>
 
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}/> 
                <Toast
                    ref={(toast) => this.toast = toast}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}/>
                </View>
             </SafeAreaView>)
    }
}
 
const styles = StyleSheet.create({
   container: {
     flex: 1,
     paddingHorizontal: 10,
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
     marginTop:10,
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
    user: state.user.data
  }
}

// is function call by user
const mapDispatchToProps = {
  userLogin,
  followUp,
  fetchMyApps,
  addfollowerPost
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
 