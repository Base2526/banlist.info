/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useEffect, useState} from 'react';
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

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';


const axios = require('axios');
var Buffer = require('buffer/').Buffer

import {API_URL, API_TOKEN} from "@env"

import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';

import Spinner from 'react-native-loading-spinner-overlay';

class MeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {name: '', password: '', };
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: '693724870615-sctm232nea5uoce5us2l5le0mj7bi77p.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    
    this.isSignedIn()
  }

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      this.getCurrentUserInfo()
    } else {
      console.log('Please Login')
    }
  };

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      // setUser(userInfo);
      console.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        // alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  }

  handleSearch= () => {
    console.log(this.state.name);
    console.log(this.state.surname);
    console.log(this.state.bank_account);
  }

  handleLogin= () =>{
    // console.log('handleLogin') 

    console.log(this.state.name);
    console.log(this.state.password);
  }

  handleForgotPassword= () =>{
    // console.log('handleForgotPassword')

    const { navigation } = this.props;
    navigation.navigate('forgot_password');
  }

  handleSignUp= () =>{
    const { navigation } = this.props;
    navigation.navigate('sign_up');
  }

  handleLoginWithFacebook= () =>{
    // console.log('handleLoginWithFacebook')

    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }

  handleLoginWithGoogle= () =>{
    console.log('handleLoginWithGoogle')
  }

  signInOnGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
      // setUser(userInfo)
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  }

  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          this.setState({userInfo: result});
          console.log('result:', result);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  render(){
    return (<View style={styles.container}>
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

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleLoginWithFacebook}>
                <Text>Login with facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={this.signInOnGoogle}>
                <Text>Login with google</Text>
              </TouchableOpacity>
            </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingHorizontal: 10,
    margin: 10
  },
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
  engine: {
    position: 'absolute',
    right: 0,
  },
//   body: {
//     backgroundColor: Colors.white,
//   },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    // color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    // color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    // color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 10
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

export default MeScreen;
