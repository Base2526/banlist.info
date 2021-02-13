/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component}  from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// 
import Ionicons from 'react-native-vector-icons/Ionicons';

const axios = require('axios');
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchScreen from './SearchScreen';
import ResultScreen from './ResultScreen';
import AddBanlistScreen from './AddBanlistScreen';

import MeScreen from './MeScreen'

import {API_URL, API_TOKEN} from "@env"

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

function HomeStackScreen({navigation, route}) {
  if(route.state && route.state.index > 0){
    navigation.setOptions({tabBarVisible: false})
  }else{
    navigation.setOptions({tabBarVisible: true})
  }
  return (
    <HomeStack.Navigator>
        <HomeStack.Screen
          name="search"
          component={SearchScreen}
          options={{ title: 'Banlist.info' }}
        />
        <HomeStack.Screen 
          name="result" 
          component={ResultScreen}
          // options={{ title: 'Result Search',  }}
          options={{
            tabBarVisible: false,
          }}
        />
        <HomeStack.Screen 
          name="add_banlist" 
          component={AddBanlistScreen} 
          options={{ title: 'Add Banlist' }}
        />
    </HomeStack.Navigator>
  );
}

function MeStackScreen({navigation, route}) {
  if(route.state && route.state.index > 0){
    navigation.setOptions({tabBarVisible: false})
  }else{
    navigation.setOptions({tabBarVisible: true})
  }
  return (
    <HomeStack.Navigator>
        <HomeStack.Screen 
          name="me" 
          component={MeScreen} 
          options={{ title: 'Me' }}
        />
    </HomeStack.Navigator>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {name: "", surname: "", bank_account: ""};
  }

  componentDidMount() {}

  handleSearch= () => {
    console.log(this.state.name);
    console.log(this.state.surname);
    console.log(this.state.bank_account);
  }

  render(){
    return(
      <NavigationContainer>
        <Tab.Navigator
         screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // if (route.name === 'Home') {
              iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
            // } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
            // }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
          <Tab.Screen name="Home" component={HomeStackScreen} />
          <Tab.Screen name="Me" component={MeStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    )
    // return (<NavigationContainer>
    //           <Stack.Navigator>
    //             <Stack.Screen
    //               name="search"
    //               component={SearchScreen}
    //               options={{ title: 'Banlist.info' }}
    //             />
    //             <Stack.Screen 
    //               name="result" 
    //               component={ResultScreen}
    //               options={{ title: 'Result Search' }}
    //             />
    //             <Stack.Screen 
    //               name="add_banlist" 
    //               component={AddBanlistScreen} 
    //               options={{ title: 'Add Banlist' }}
    //             />
    //           </Stack.Navigator>
    //         </NavigationContainer>)
  }
}

const styles = StyleSheet.create({
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
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default App;