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
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

// import DatePicker from 'react-native-datepicker'
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';

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
                  localPhotos: []};
  
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
        <Text style={styles.sectionTitle}>Select photos</Text>
        <ScrollView style={styles.photoList} horizontal={true}>
          {this.renderListPhotos(localPhotos)}
          <TouchableOpacity onPress={this.onPressAddPhotoBtn.bind(this)}>
            <View style={[styles.addButton, styles.photo]}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  // Upload image
  
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

              {/*  */}
              <SafeAreaView>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>
                {/* <Header /> */}
                {/* <Image style={{ width: 143, height: 30 }} source={{ uri: 'https://tuanitpro.com/wp-content/uploads/2015/04/logo.png' }} /> */}
                <View style={styles.body}>
                  {this.renderSelectPhotoControl(this.state.localPhotos)}
                  <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={this.onDoUploadPress}>
                      <Text style={styles.sectionTitle}>Upload now</Text>
                    </TouchableOpacity>
                  </View>
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
                  console.log('ActionSheetSelectPhoto');
                  this.onActionSelectPhotoDone(index);
                }}/>
              </SafeAreaView>

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
