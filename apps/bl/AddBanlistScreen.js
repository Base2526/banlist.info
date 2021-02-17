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
  Button,
  Image,
  Platform
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';

import DateTimePicker from '@react-native-community/datetimepicker';

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
                
                
                
                  textInput : [],
                
                  selectedPhotoIndex: 0,
                  localPhotos: [],
                
                  showDateTimePicker: false,
                  currentDateTimePicker: new Date(),
                  items_merchant_bank_account : {
                    1: 'ธนาคารกรุงศรีอยุธยา',
                    2: 'ธนาคารกรุงเทพ',
                    3: 'ธนาคารซีไอเอ็มบี' ,
                    4: 'ธนาคารออมสิน',
                    5: 'ธนาคารอิสลาม',
                    6: 'ธนาคารกสิกรไทย',
                    7: 'ธนาคารเกียรตินาคิน',
                    8: 'ธนาคารกรุงไทย',
                    9: 'ธนาคารไทยพาณิชย์',
                    10: 'Standard Chartered',
                    11: 'ธนาคารธนชาติ',
                    12: 'ทิสโก้แบงค์',
                    13: 'ธนาคารทหารไทย',
                    14: 'ธนาคารยูโอบี',
                    15: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
                    16: 'True Wallet',
                    17: 'พร้อมเพย์ (PromptPay)',
                    18: 'ธนาคารอาคารสงเคราะห์',
                    19: 'AirPay (แอร์เพย์)',
                    20: 'mPay',
                    21: '123 เซอร์วิส',
                    22: 'ธ.ไทยเครดิตเพื่อรายย่อย',
                    23: 'ธนาคารแลนด์แอนด์เฮ้าส์',
                    24: 'เก็บเงินปลายทาง' 
                  }};


    
    
    console.log()
    
  
    // const [date, setDate] = useState(new Date(1598051730000));
    // const [mode, setMode] = useState('date');
    // const [show, setShow] = useState(false);

    // this.state = {
    //   logs: 'ahihi',
    //   selectedPhotoIndex: 0,
    //   localPhotos: []
    // };
    this.onDoUploadPress = this.onDoUploadPress.bind(this);

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
    let items_merchant_bank_account = this.state.items_merchant_bank_account;

    var tifOptions = [];

    Object.keys(items_merchant_bank_account).forEach(function(key) {
      tifOptions.push({key, label: items_merchant_bank_account[key], value: key, icon: () => <Icon name="flag" size={18}  />, hidden: false})
    });
    
    textInput.push( <View key={{key}}>
                      <View style={{ flexDirection:"row", marginTop:10}}>
                        <Text>เลขบัญชี</Text> 
                        <Button style={{backgroundColor:"#FF2400"}} title='-' onPress={()=>this.handleDelete(key)} />
                      </View>
                      <TextInput key={key}  style={{borderWidth: .5, height: 40}}/>
                      <Text>ธนาคาร/ระบบ Wallet</Text>
                      <DropDownPicker
                        items={tifOptions}
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

  // Upload image
  onPressAddPhotoBtn = () => {
    this.ActionSheetSelectPhoto.show();
  };

  showActionSheet = index => {
    this.setState({
      selectedPhotoIndex: index
    });
    this.ActionSheet.show();
  };

  onDoUploadPress() {
    const { localPhotos } = this.state;
    if (localPhotos && localPhotos.length > 0) {
      /*
      let formData = new FormData();
      localPhotos.forEach((image) => {
        const file = {
          uri: image.path,
          name: image.filename || Math.floor(Math.random() * Math.floor(999999999)) + '.jpg',
          type: image.mime || 'image/jpeg'
        };
        formData.append('files', file);
      });

      axios
        .post('https://api.tradingproedu.com/api/v1/fileupload', formData)
        .then(response => {
          this.setState({ logs: JSON.stringify(response.data) });
        })
        .catch(error => {
          alert(JSON.stringify(error));
        });
        */

      console.log('onDoUploadPress')
      console.log(localPhotos)
    } else {
      alert('No photo selected');
    }
  }

  onActionDeleteDone = index => {
    if (index === 0) {
      const array = [...this.state.localPhotos];
      array.splice(this.state.selectedPhotoIndex, 1);
      this.setState({ localPhotos: array });
    }
  };

  onActionSelectPhotoDone = index => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({}).then(image => {
          this.setState({
            localPhotos: [...this.state.localPhotos, image]
          });
        });
        break;
      case 1:
        ImagePicker.openPicker({
          multiple: true,
          maxFiles: 10,
          mediaType: 'photo'
        }).then(images => {
          images.forEach((image) => {
            this.setState({
              localPhotos: [...this.state.localPhotos, image]
            });
          });
        }).catch(error => {
          alert(JSON.stringify(error));
        });
        break;
      default:
        break;
    }
  };

  renderListPhotos = localPhotos => {
    const photos = localPhotos.map((photo, index) => (
      <TouchableOpacity key={index}
        onPress={() => {
          this.showActionSheet(index);
        }}
      >
        <Image style={styles.photo} source={{ uri: photo.path }} />
      </TouchableOpacity>
    ));

    return photos;
  };

  renderSelectPhotoControl = localPhotos => {
    return (
      <View style={styles.sectionContainer}>
        
        <ScrollView style={styles.photoList} horizontal={true}>
          {this.renderListPhotos(localPhotos)}
          <TouchableOpacity onPress={this.onPressAddPhotoBtn.bind(this)}>
            <View style={{alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#3399cc',
                          width: 40,
                          height: 40,
                          borderRadius: 5}}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  // Upload image

  // onDateTimePickerChange

  onDateTimePickerChange = (event, selectedDate) => {
    const currentDate = selectedDate// || date;
    // setShow(Platform.OS === 'ios');
    // setDate(currentDate);
    console.log('onDateTimePickerChange')
    console.log(currentDate)

    this.setState({currentDateTimePicker: currentDate})

    // this.setState({showDateTimePicker:Platform.OS === 'ios'})
  };

  handleDatepicker = () =>{
    // showMode('date');
    this.setState({showDateTimePicker:true})
  }
  
  render(){
    return (
      <SafeAreaView >
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleDatepicker}>
            <Text>Show date picker</Text>
          </TouchableOpacity>
          {/* {this.state.showDateTimePicker && 
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.currentDateTimePicker}
            mode={'date'}
            is24Hour={true}
            display="spinner"
            onChange={this.onDateTimePickerChange}
          />}
           */}
          
          <Text>Detail</Text>
          <TextInput
            style={{height: 40,
                    borderWidth: .5,
                    height: 150,
                    textAlignVertical: 'top'}}
            // multiline={true}
            multiline numberOfLines={10}
            ref= {(el) => { this.detail = el; }}
            onChangeText={(detail) => this.setState({detail})}
            value={this.state.detail}
            underlineColorAndroid={'transparent'}
            autoCorrect={true} 
            // autoFocus={true}
            autoCapitalize={'sentences'}/>

          <View style={{ flexDirection:"row", marginTop:10}}>
            <Text>บัญชีธนาคารคนขาย</Text>
            <Button style={{height:5}} title='+' onPress={() => this.addTextInput(this.state.textInput.length)} />
          </View>
          
          {this.state.textInput.map((value, index) => {
            return value
          })}

          {/*  */}
          
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {/* <Header /> */}
            {/* <Image style={{ width: 143, height: 30 }} source={{ uri: 'https://tuanitpro.com/wp-content/uploads/2015/04/logo.png' }} /> */}
            <View style={styles.body}>
              <Text style={styles.sectionTitle}>รูปภาพประกอบ</Text>
              {this.renderSelectPhotoControl(this.state.localPhotos)}
              {/* <View style={styles.sectionContainer}> */}
                {/* <TouchableOpacity style={styles.button} onPress={this.onDoUploadPress}>
                  <Text>Upload now</Text>
                </TouchableOpacity> */}
              {/* </View> */}
              {/* <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Logs</Text>
                <TextInput multiline numberOfLines={10} style={{ height: 250, borderColor: 'gray', borderWidth: 1 }}
                  value={this.state.logs}
                />
              </View> */}
            </View>
          </ScrollView>
          {/*  */}

          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={'Confirm delete photo'}
            options={['Confirm', 'Cancel']}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={index => {
              this.onActionDeleteDone(index);
            }}/>

          <ActionSheet
            ref={o => (this.ActionSheetSelectPhoto = o)}
            title={'Select photo'}
            options={['Take Photo...', 'Choose from Library...', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={index => {
              this.onActionSelectPhotoDone(index);
            }}/>

          <TouchableOpacity
            style={styles.button}
            onPress={this.handleAdd}>
            <Text>ADD</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: '600',
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

  photo: {
    marginRight: 10,
    width: 70,
    height: 70,
    borderRadius: 10
  },

  photoList: {
    height: 70,
    marginTop: 15,
    marginBottom: 15,
    marginRight: 10
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 30
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3399cc'
  },
});

export default AddBanlistScreen;
