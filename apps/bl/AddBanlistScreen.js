/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useState} from 'react';
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
  Button
} from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// import DatePicker from 'react-native-datepicker'
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const axios = require('axios');
var Buffer = require('buffer/').Buffer
import {API_URL, API_TOKEN} from "@env"

class AddBanlistScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {title: "", 
                  name: "", 
                  surname: "", 
                  bank_account: "",
                  date:"2016-05-15",
                
                
                
                  textInput : []};
  
    // const [date, setDate] = useState(new Date(1598051730000));
    // const [mode, setMode] = useState('date');
    // const [show, setShow] = useState(false);

  }

  componentDidMount() {
    // this.props.navigation.dangerouslyGetParent().setOptions({
    //   tabBarVisible: false
    // });
  }

  handleAdd= () => {
    console.log(this.state.name);
    console.log(this.state.surname);
    console.log(this.state.bank_account);
  }

  handleDelete=(key)=>{
    console.log('handDelete > ' + key);
  }

  // https://stackoverflow.com/questions/45407581/how-to-dynamically-add-a-text-input-in-react-native/45407976
  addTextInput = (key) => {
    let textInput = this.state.textInput;
    textInput.push( <View>
                      <View style={{ flexDirection:"row", marginTop:10}}>
                        <Text>เลขบัญชี</Text> 
                        <Button style={{backgroundColor:"#FF2400"}} title='-' onPress={()=>this.handleDelete(key)} />
                      </View>
                      <TextInput key={key}  style={{borderWidth: .5, height: 40}}/>
                      <Text>ธนาคาร/ระบบ Wallet</Text>
                      <DropDownPicker
                        items={[
                          {label: 'ชื่อ-นามสกุล', value: '1', icon: () => <Icon name="flag" size={18}  />, hidden: false},
                          {label: 'เลขบัตรประชาชน', value: '2', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'บัญชีธนาคาร', value: '3', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '4', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '5', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '6', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '7', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '8', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '9', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '10', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '11', icon: () => <Icon name="flag" size={18}  />},
                          {label: 'เว็บไซด์ประกาศขายของ', value: '12', icon: () => <Icon name="flag" size={18}  />},
                        ]}
                        defaultValue={'1'}
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
                    </View>);
    this.setState({ textInput })
  }

  /*
  <Text>เลขบัญชี</Text>
  
  */
  
  render(){
    return (
            <KeyboardAwareScrollView>
            <View style={styles.container}>
              <Text>Title</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.title = el; }}
                onChangeText={(title) => this.setState({title})}
                value={this.state.title}/>

              <Text>Amount</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.amount = el; }}
                onChangeText={(amount) => this.setState({amount})}
                value={this.state.amount}/>

              <Text>Name</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.name = el; }}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}/>

              <Text>Subname</Text>
              <TextInput
                style={{height: 40, 
                        borderWidth: .5,}}
                ref= {(el) => { this.surname = el; }}
                onChangeText={(surname) => this.setState({surname})}
                value={this.state.surname}/>

              <Text>ID card number</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.id_card_number = el; }}
                onChangeText={(id_card_number) => this.setState({id_card_number})}
                value={this.state.id_card_number}/>

              <Text>Selling website</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.selling_website = el; }}
                onChangeText={(selling_website) => this.setState({selling_website})}
                value={this.state.selling_website}/>

              <Text>Date tranfer</Text>
              
              {/* <DatePicker
                style={{width: 200}}
                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2016-05-01"
                maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                useNativeDriver="false"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {this.setState({date: date})}}
              /> */}
              
              <Text>Detail</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,
                        height: 150}}
                multiline={true}
                ref= {(el) => { this.detail = el; }}
                onChangeText={(detail) => this.setState({detail})}
                value={this.state.detail}/>

              <View style={{ flexDirection:"row", marginTop:10}}>
                <Text>บัญชีธนาคารคนขาย</Text>
                <Button style={{height:5}} title='+' onPress={() => this.addTextInput(this.state.textInput.length)} />
              </View>
              
              {this.state.textInput.map((value, index) => {
                return value
              })}

      
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleAdd}>
                <Text>ADD</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>)
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
    marginTop: 10,
    padding: 10
  },
});

export default AddBanlistScreen;
