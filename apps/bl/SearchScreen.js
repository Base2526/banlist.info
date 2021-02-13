/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, } from 'react';
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
  Animated,
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

import ActionButton from 'react-native-action-button';
import Spinner from 'react-native-loading-spinner-overlay';

import {API_URL, API_TOKEN} from "@env"

import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';

class SearchScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {name: "", 
                  surname: "", 
                  id_card: "",
                  bank_account: "", 
                  ref_web: "",
                  find_id: '1',
                
                
                  spinner: false};

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

    // setInterval(() => {
    //   this.setState({
    //     spinner: !this.state.spinner
    //   });
    // }, 3000);

  }

  handleSearch= () => {
    // console.log(this.state.name);
    // console.log(this.state.surname);
    // console.log(this.state.bank_account);

    // onPress={() => navigation.navigate('result')}

    // (useNavigation()).navigate('result');

    const { navigation } = this.props;
    navigation.navigate('result');

    // console.log('handleSearch > ' + this.state.find_id);

    /*
        this.state = {name: "", 
                  surname: "", 
                  id_card: "",
                  bank_account: "", 
                  ref_web: "",
                  find_id: '1'};
    */

    switch(this.state.find_id){
      case '1':{
        console.log('find_id = ' + this.state.find_id +", name = "+this.state.name+", surname = "+this.state.surname);
        break;
      }
      case '2':{
        console.log('find_id = ' + this.state.find_id +", id_card = "+this.state.id_card);
        break;
      }
      case '3':{
        console.log('find_id = ' + this.state.find_id +", bank_account = "+this.state.bank_account);
        break;
      }
      case '4':{
        console.log('find_id = ' + this.state.find_id +", ref_web = "+this.state.ref_web);
        break;
      }
    }
    /*
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
      // console.log()
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

  radioHandler2 = () => {
    console.log('radioHandler2');
  }

  render(){
    console.log('--');

    const { navigation } = this.props;
    
    let v = <View />;
    switch(this.state.find_id){
      case '1':{
        v = <View>
              <Text>ชื่อ</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.name = el; }}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}/>

              <Text>นามสกุล</Text>
              <TextInput
                style={{height: 40, 
                        borderWidth: .5,}}
                ref= {(el) => { this.surname = el; }}
                onChangeText={(surname) => this.setState({surname})}
                value={this.state.surname}/>
            </View>
        break;
      }
      case '2':{
        v = <View>
              <Text>เลขบัตรประชาชน</Text>
              <TextInput
                style={{height: 40, 
                        borderWidth: .5,}}
                ref= {(el) => { this.id_card = el; }}
                onChangeText={(id_card) => this.setState({id_card})}
                value={this.state.id_card}/>
            </View>
        break;
      }
      case '3':{
        v = <View>
              <Text>บัญชีธนาคาร</Text>
              <TextInput
                style={{height: 40, 
                        borderWidth: .5,}}
                ref= {(el) => { this.bank_account = el; }}
                onChangeText={(bank_account) => this.setState({bank_account})}
                value={this.state.bank_account}/>
            </View>
        break;
      }
      case '4':{
        v = <View>
              <Text>เว็บไซด์ประกาศขายของ</Text>
              <TextInput
                style={{height: 40, 
                        borderWidth: .5,}}
                ref= {(el) => { this.ref_web = el; }}
                onChangeText={(ref_web) => this.setState({ref_web})}
                value={this.state.ref_web}/>
            </View>
        break;
      }
    }

    return (
            <View style={styles.container}>
              {/* <ActivityIndicator /> */}

              <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />

              <Text style={{marginTop: 10,}}>ค้นหาจาก</Text>
              <DropDownPicker
                items={[
                  {label: 'ชื่อ-นามสกุล', value: '1', icon: () => <Icon name="flag" size={18}  />, hidden: false},
                  {label: 'เลขบัตรประชาชน', value: '2', icon: () => <Icon name="flag" size={18}  />},
                  {label: 'บัญชีธนาคาร', value: '3', icon: () => <Icon name="flag" size={18}  />},
                  {label: 'เว็บไซด์ประกาศขายของ', value: '4', icon: () => <Icon name="flag" size={18}  />},
                ]}
                defaultValue={this.state.find_id}
                containerStyle={{height: 50}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item => this.setState({
                  find_id: item.value
                })}
                labelStyle={{
                  fontSize: 16,
                  textAlign: 'left',
                  color: '#000'
                }}
                />
                {v}
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSearch}>
                <Text>Search</Text>
              </TouchableOpacity>

              <ActionButton
                buttonColor="rgba(231,76,60,1)"
                onPress={() => { 
                  navigation.navigate('add_banlist');
                }}
              />
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
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

export default SearchScreen;
