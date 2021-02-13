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

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const axios = require('axios');
var Buffer = require('buffer/').Buffer

import {API_URL, API_TOKEN} from "@env"

import SearchScreen from './SearchScreen';
import ResultScreen from './ResultScreen';

// const App: () => React$Node = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Step One</Text>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.js</Text> to change this
//                 screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      <TouchableOpacity
        title="Go to Details"
        onPress={() => navigation.push('Profile')}>
        <Text>Profile Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      <TouchableOpacity
        title="Go to Details"
        onPress={() => navigation.navigate('Home')}>
        <Text>Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {name: "", surname: "", bank_account: ""};
  }

  componentDidMount() {

    /*
    let username = 'admin';
    let password = 'Somkid058848391';
    const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
    */

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

  }

  handleSearch= () => {
    console.log(this.state.name);
    console.log(this.state.surname);
    console.log(this.state.bank_account);
  }

  render(){
    return (<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="search"
          component={SearchScreen}
          options={{ title: 'Search' }}
        />
        <Stack.Screen 
          name="result" 
          component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>)
  }
}

export default App;
