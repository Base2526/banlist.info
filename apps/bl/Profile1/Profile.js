import React, { Component } from 'react'
import { Card, Icon } from 'react-native-elements'
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { connect } from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Email from './Email'
import Separator from './Separator'
import Tel from './Tel'

import contactData from '../profile/contact.json'

import { isEmpty } from '../Utils'
import { userLogout } from '../actions/user';

class Profile extends Component {
  // static propTypes = {
  //   avatar: PropTypes.string.isRequired,
  //   avatarBackground: PropTypes.string.isRequired,
  //   name: PropTypes.string.isRequired,
  //   address: PropTypes.shape({
  //     city: PropTypes.string.isRequired,
  //     country: PropTypes.string.isRequired,
  //   }).isRequired,
  //   emails: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       email: PropTypes.string.isRequired,
  //       id: PropTypes.number.isRequired,
  //       name: PropTypes.string.isRequired,
  //     })
  //   ).isRequired,
  //   tels: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       id: PropTypes.number.isRequired,
  //       name: PropTypes.string.isRequired,
  //       number: PropTypes.string.isRequired,
  //     })
  //   ).isRequired,
  // }

  constructor(props) {
    super(props);
    this.state = {contactData:{}}
  }

  componentDidMount() {
    let _this = this
    const { route, navigation, user} = this.props;

    console.log('user : ', user);

    navigation.setOptions({
        headerRight: () => (
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity 
              style={{ marginHorizontal: 10 }}
              onPress={()=>{
                Alert.alert(
                  "Comfirm",
                  "Are you sure logout?",
                  [
                      {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                      },
                      { text: "Logout", onPress: () => {
                        // logout().then(res => {
                        //     this.setState({isLogin: false})
                        // })
                        console.log('logout')

                        _this.props.userLogout();
                        navigation.pop();
                      }}
                  ]
                  );
              }}>
              <Ionicons name="log-out-outline" size={25} color={'grey'} />
            </TouchableOpacity>
          </View>
        )
    })

    this.setState({contactData})
    // console.log(contactData)
  }

  onPressPlace = () => {
    console.log('place')
  }

  onPressTel = number => {
    Linking.openURL(`tel://${number}`).catch(err => console.log('Error:', err))
  }

  onPressSms = () => {
    console.log('sms')
  }

  onPressEmail = email => {
    Linking.openURL(`mailto://${email}?subject=subject&body=body`).catch(err =>
      console.log('Error:', err)
    )
  }

  renderHeader = () => {

    let {email, image_url, name } = this.props.user
    // let {
    //   avatar,
    //   avatarBackground,
    //   name,
    //   address,
    //   // address: { city, country },
    // } = this.state.contactData

    // let { city, country } = address
    // console.log(avatar)
    // console.log(city, country)
    // return <View />
    // if(isEmpty(this.state.contactData)){
    //   return <View />
    // }

    // const {
    //   avatar,
    //   avatarBackground,
    //   name,
    //   address: { city, country },
    // } = this.state.contactData

    /*
    {"basic_auth": "c21pOjEyMzQ=", "email": "mr.simajarn@gmail.com", "image_url": "https://banlist.info/sites/default/files/02-27-2021_1019pm_1115734532.png", "name": "smi", "session": "VhgSAhZlPiV8dF7E-Ka2WaWAFYQ6TdQmYKZ18neqQ0A", "uid": "59"}
    */

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={{uri: ''}}
        >
          <View style={styles.headerColumn}>
            <Image
              style={styles.userImage}
              source={{uri: image_url}}
            />
            <Text style={styles.userNameText}>{name}</Text>
            <View style={styles.userAddressRow}>
              {/* <View>
                <Icon
                  name="place"
                  underlayColor="transparent"
                  iconStyle={styles.placeIcon}
                  onPress={this.onPressPlace}
                />
              </View> */}
              <View style={styles.userCityRow}>
                <Text style={styles.userCityText}>
                  {email}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderTel = () => (
    <FlatList
      contentContainerStyle={styles.telContainer}
      data={this.state.contactData.tels}
      renderItem={(list) => {
        const { id, name, number } = list.item

        return (
          <Tel
            key={`tel-${id}`}
            index={list.index}
            name={name}
            number={number}
            onPressSms={this.onPressSms}
            onPressTel={this.onPressTel}
          />
        )
      }}
    />
  )

  renderEmail = () => (
    <FlatList
      contentContainerStyle={styles.emailContainer}
      data={this.state.contactData.emails}
      renderItem={(list) => {
        const { email, id, name } = list.item

        return (
          <Email
            key={`email-${id}`}
            index={list.index}
            name={name}
            email={email}
            onPressEmail={this.onPressEmail}
          />
        )
      }}
    />
  )

  render() {
    if(isEmpty(this.state.contactData)){
      return <View />
    }
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Card containerStyle={styles.cardContainer}>
            {this.renderHeader()}
            {/* {this.renderTel()} */}
            {/* {Separator()} */}
            {/* {this.renderEmail()} */}

            {/* <View style={{padding:10}}>
              <Text style={{color:'gray', fontSize:20}}>
                  Status message
              </Text>
              <Text>
                  ddd
              </Text>
            </View> */}
          </Card>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
    backgroundColor:'gray'
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
})

// export default Profile
// export default MyPost;
const mapStateToProps = state => {
  return{
    user: state.user.data,
  }
}

const mapDispatchToProps = {
  userLogout
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
