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

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {email:''};
  }

  componentDidMount() {
  }

  handleSend= () =>{
    console.log('handleSend')
  }

  render(){
    return (
            <View style={styles.container}>
              <Text>Email</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.email = el; }}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}/>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSend}>
                <Text>Send</Text>
              </TouchableOpacity>
            </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingHorizontal: 10
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

export default ForgotPassword;
