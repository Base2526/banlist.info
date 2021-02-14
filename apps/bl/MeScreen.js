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

// import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';

function Item({ item }) {
  return (
    <View style={styles.listItem}>
      <Image source={{uri:item.photo}}  style={{width:60, height:60,borderRadius:30}} />
      <View style={{alignItems:"center",flex:1}}>
        <Text style={{fontWeight:"bold"}}>{item.name}</Text>
        <Text>{item.position}</Text>
      </View>
      <TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}>
        <Text style={{color:"green"}}>Call</Text>
      </TouchableOpacity>
    </View>
  );
}

class MeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleSearch= () => {
    console.log(this.state.name);
    console.log(this.state.surname);
    console.log(this.state.bank_account);
  }

  handleLogin= () =>{
    console.log('handleLogin')
  }

  handleForgotPassword= () =>{
    console.log('handleForgotPassword')
  }

  handleSignUp= () =>{
    console.log('handleSignUp')
  }

  handleLoginWithFacebook= () =>{
    console.log('handleLoginWithFacebook')
  }

  handleLoginWithGoogle= () =>{
    console.log('handleLoginWithGoogle')
  }
  
  render(){
    return (
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
                style={{height: 40, 
                        borderWidth: .5,}}
                ref= {(el) => { this.surname = el; }}
                onChangeText={(surname) => this.setState({surname})}
                value={this.state.surname}/>
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
                onPress={this.handleLoginWithGoogle}>
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
