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
  ActivityIndicator
} from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

import { useNavigation } from '@react-navigation/native';

const axios = require('axios');
var Buffer = require('buffer/').Buffer

import {API_URL, API_TOKEN} from "@env"

import RadioButton from './RadioButton'

class SearchScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {name: "", surname: "", bank_account: ""};

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {

    
    /*
    let username = 'admin';
    let password = 'Somkid058848391';
    const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
    */

    /*
    console.log(API_URL);
    axios.post(`${API_URL}/api/check_banlist?_format=json`, {
      type: '1',
      name: 'กิตติธัช',
      surname: ''
    }, {
      headers: { 
        'Authorization': `Basic ${API_TOKEN}` 
      }
    })
    .then(function (response) {
      let results = response.data
      console.log()
      if(results.result){
        // true
        console.log('true');
        // console.log(results);

        let {execution_time, datas, count} = results;
        console.log(execution_time);
        console.log(count);
        // console.log(datas);

      }else{
        // false
        console.log('false');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
    */

  }

  handleSearch= () => {
    console.log(this.state.name);
    console.log(this.state.surname);
    console.log(this.state.bank_account);

    // onPress={() => navigation.navigate('result')}

    // (useNavigation()).navigate('result');

    const { navigation } = this.props;
    navigation.navigate('result');
  }

  radioHandler2 = () => {
    console.log('radioHandler2');
  }

  render(){
    return (
            <View style={styles.container}>
              <ActivityIndicator />

              <Text>RadioButton</Text>
              <RadioButton checked={true} onPress={this.radioHandler2}/>

              <Text>Name</Text>
              <TextInput
                style={{height: 40, 
                        borderColor: '#FF5722', 
                        backgroundColor : "#FFFFFF",
                        borderWidth: 2,}}
                ref= {(el) => { this.name = el; }}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}/>

              <Text>Surname</Text>
              <TextInput
                style={{height: 40, 
                        borderColor: '#FF5722', 
                        backgroundColor : "#FFFFFF",
                        borderWidth: 2,}}
                ref= {(el) => { this.surname = el; }}
                onChangeText={(surname) => this.setState({surname})}
                value={this.state.surname}/>

              <Text>Bank account</Text>
              <TextInput
                style={{height: 40, 
                        borderColor: '#FF5722', 
                        backgroundColor : "#FFFFFF",
                        borderWidth: 2,}}
                ref= {(el) => { this.bank_account = el; }}
                onChangeText={(bank_account) => this.setState({bank_account})}
                value={this.state.bank_account}/>

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSearch}>
                <Text>Search</Text>
              </TouchableOpacity>

            </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
});

export default SearchScreen;
