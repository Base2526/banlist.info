import React, {Component, } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Linking, 
    Alert,
    StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
  
import SettingsList from 'react-native-settings-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';

import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';

import {API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID} from "./constants"
import { ValidateEmail, isEmpty, logout } from './Utils'

import ModalLogin from './ModalLogin'
  
class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {showModalLogin: false, 
                      laps: ['1', '2', '3', '4']}
    }

    componentDidMount() {
        const { route, navigation, my_apps } = this.props;
        // console.log('my_apps : ', my_apps)
        navigation.setOptions({
            headerLeft: () => (
              <TouchableOpacity
                // onPress={() => console.log('Button is Pressed!') }
                >
                <Text style={{ fontSize: 20, paddingLeft:10}}>Setting</Text>
              </TouchableOpacity>
            )
        })

        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            iosClientId: IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });
    }

    onUpdateState = data => {
        this.setState(data);
    }

    handleLoginWithFacebook= () =>{
        console.log('handleLoginWithFacebook')

        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithPermissions(["public_profile"]).then(
            function(result) {
            console.log(result)
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
    
    handleLoginWithGoogle = async () => {
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

    sleep(timeout) {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    }

    async openLink(url) {
        let statusBarStyle=  'dark-content';
        try {
          if (await InAppBrowser.isAvailable()) {
            // A delay to change the StatusBar when the browser is opened
            const animated = true;
            const delay = animated && Platform.OS === 'ios' ? 400 : 0;
            setTimeout(() => StatusBar.setBarStyle('light-content'), delay);
            const result = await InAppBrowser.open(url, {
              // iOS Properties
              dismissButtonStyle: 'cancel',
              preferredBarTintColor: '#453AA4',
              preferredControlTintColor: 'white',
              readerMode: true,
              animated,
              modalPresentationStyle: 'fullScreen',
              modalTransitionStyle: 'flipHorizontal',
              modalEnabled: true,
              enableBarCollapsing: true,
              // Android Properties
              showTitle: false,
              toolbarColor: '#6200EE',
              secondaryToolbarColor: 'black',
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: false,
              // Specify full animation resource identifier(package:anim/name)
              // or only resource name(in case of animation bundled with app).
              animations: {
                startEnter: 'slide_in_right',
                startExit: 'slide_out_left',
                endEnter: 'slide_in_left',
                endExit: 'slide_out_right',
              },
              headers: {
                'my-custom-header': 'my custom header value',
              },
              hasBackButton: true,
              browserPackage: null,
              showInRecents: false
            });
            // A delay to show an alert when the browser is closed
            await this.sleep(800);
            // Alert.alert('Response', JSON.stringify(result));
          } else {
            Linking.openURL(url);
          }
        } catch (error) {
          console.error(error);
        //   Alert.alert(error.message);
        } finally {
          // Restore the previous StatusBar of the App
          StatusBar.setBarStyle(statusBarStyle);
        }
    }

    myInfo() {
        let { navigation, user, my_apps, ___follow_ups, notifications } = this.props;

        ___follow_ups = ___follow_ups.filter(itm=>itm.follow_up)

        // console.log('notifications : ', notifications)

        let infos = [{'id': 0, 'title': 'Account', 'icon_name': "person-outline", 'color': 'gray', 'info': ''}, 
                    {'id': 1, 'title': 'My post', 'icon_name': "add-circle-outline", 'color': 'gray', 'info': (!isEmpty(my_apps) ? String(my_apps.length) : '') },
                    {'id': 2, 'title': 'My follow up', 'icon_name': "shield-checkmark-outline", 'color': 'gray', 'info':(!isEmpty(___follow_ups) ? String(___follow_ups.length) : '')   },
                    {'id': 3, 'title': 'Notification', 'icon_name': "notifications-outline", 'color': 'gray', 'info': (!isEmpty(notifications) ? String(notifications.length) : '') }
                ]

        if(!isEmpty(user)){
            return infos.map((data) => {
                return (<SettingsList.Item
                            key={data.id}
                            icon={
                                <View style={styles.imageStyle}>
                                    <Ionicons name={data.icon_name} size={20} color={data.color} />
                                </View>
                            }
                            title={data.title} 
                            itemWidth={70}
                            titleStyle={{color:'black', fontSize: 16}}
                            hasNavArrow={false}
                            titleInfo= {data.info}
                            titleInfoStyle={{fontSize:16}}
                            onPress={()=>{
                            switch(data.id){
                                case 0:{
                                    navigation.navigate('profile')
                                    break;
                                }

                                case 1:{
                                    if( !isEmpty(data.info) ){
                                        navigation.navigate('mypost')
                                    }
                                    break;
                                }

                                case 2:{
                                    if( !isEmpty(data.info) ){
                                        navigation.navigate('myfollowups')
                                    }
                                    
                                    break;
                                }

                                case 3:{
                                    navigation.navigate('notification')
                                    break;
                                }
                            }
                            }}/>)
            })
        }
    }

    render() {
        let { navigation, user } = this.props;   
        let { showModalLogin } = this.state     
        return (
        <View style={{backgroundColor:'#f6f6f6',flex:1}}>
            <SettingsList borderColor='#d6d5d9' defaultItemSize={50}>
                <SettingsList.Item
                    hasNavArrow={false}
                    title= { isEmpty(user) ? 'Login' : 'My Info' } 
                    titleStyle={{color:'#009688', marginBottom:10, fontWeight:'bold'}}
                    itemWidth={70}
                    borderHide={'Both'}
                    onPress={()=>{
                        if(isEmpty(user)){
                            this.setState({showModalLogin: true})
                        }
                    }}/>
                {  !isEmpty(user)  && this.myInfo() }
                <SettingsList.Header headerStyle={{marginTop:-5}}/>
                <SettingsList.Item
                    hasNavArrow={false}
                    title='Info'
                    titleStyle={{color:'#009688', marginBottom:10, fontWeight:'bold'}}
                    itemWidth={70}
                    borderHide={'Both'} />
                <SettingsList.Item
                    icon={
                        <View style={styles.imageStyle}>
                            <Ionicons name="bug-outline" size={20} color={'grey'} />
                        </View>
                    }
                    title='For developer'
                    itemWidth={70}
                    titleStyle={{color:'black', fontSize: 16}}
                    hasNavArrow={false}
                    onPress={()=>{
                        // navigation.navigate('inappbrowser')
                        this.openLink('http://banlist.info/node/151')
                    }}/>
                <SettingsList.Item
                    icon={
                        <View style={styles.imageStyle}>
                            <Ionicons name="terminal-outline" size={20} color={'grey'} />
                        </View>
                    }
                    title='Terms of service'
                    itemWidth={70}
                    titleStyle={{color:'black', fontSize: 16}}
                    hasNavArrow={false}
                    onPress={()=>{
                        // navigation.navigate('inappbrowser')
                        this.openLink('http://banlist.info/node/149')
                    }}/>
                <SettingsList.Item
                    icon={
                        <View style={styles.imageStyle}>
                            <Ionicons name="information-outline" size={20} color={'grey'} />
                        </View>
                    }
                    hasNavArrow={false}
                    itemWidth={70}
                    titleStyle={{color:'black', fontSize: 16}}
                    title='About'
                    onPress={()=>{
                        this.openLink('http://banlist.info/node/150')
                    }}/>

                {/* <SettingsList.Item
                    icon={
                        <View style={styles.imageStyle}>
                            <Ionicons name="information-outline" size={20} color={'grey'} />
                        </View>
                    }
                    hasNavArrow={false}
                    itemWidth={70}
                    titleStyle={{color:'black', fontSize: 16}}
                    title='Test function'
                    onPress={()=>{
                        navigation.navigate('test')
                    }}/> */}
            </SettingsList>    
            {/* {this.modalLogin()} */}
            { 
                isEmpty(user)  
                && <ModalLogin {...this.props } showModalLogin={showModalLogin} updateState={this.onUpdateState} />
            }
        </View>
        )
    }
}
  
const styles = StyleSheet.create({
    imageStyle:{
        marginLeft:15,
        marginRight:20,
        alignSelf:'center',
        width:20,
        height:24,
        justifyContent:'center'
    }
})

const mapStateToProps = state => {
    return{
      data: state.app.data,
      user: state.user.data,
    //   follow_ups: state.user.follow_ups,
      my_apps: state.user.my_apps,

      ___follow_ups: state.user.___follow_ups,


      notifications: state.user.notifications
    }
}

export default connect(mapStateToProps, null)(SettingsScreen)