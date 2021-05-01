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
import {API_URL, API_TOKEN} from "./constants"
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast'
import { ValidateEmail } from './Utils'

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {email:''};
  }

  componentDidMount() {
  }

  handleSend= () =>{
    // Hide that keyboard!
    Keyboard.dismiss()

    let {email} = this.state
    email = email.trim();

    if(!ValidateEmail(email)){
      this.toast.show('Email Field is Invalid');
    }else{
      this.setState({spinner: true});

      let _this =this

      axios.post(`${API_URL}/api/reset_password?_format=json`, {
        email
      })
      .then(function (response) {
        let results = response.data
        console.log(results)
        if(results.result){        
          _this.toast.show('Check email.');
          _this.props.navigation.pop();   
          _this.setState({spinner: false})
        }else{
          _this.toast.show(results.message, 500);
          _this.setState({spinner: false})
        }
      })
      .catch(function (error) {
        console.log(error)
        _this.setState({spinner: false})
      });
    }
  }

  render(){
    return (<View style={styles.container}>
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
    marginTop:10,
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
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

const mapStateToProps = state => {  
  return{
    user: state.user.data
  }
}

// is function call by user
const mapDispatchToProps = {}

export default connect(null, null)(ForgotPassword)
