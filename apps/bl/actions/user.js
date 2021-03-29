const axios = require('axios');

import {_fetchData} from './app'

import {API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID, API_URL_SOCKET_IO} from "../constants"
import { USER_LOGIN, USER_LOGOUT, FETCH_PROFILE, FOLLOW_UP, FETCH_MY_APPS, ADD_HISTORY, DELETE_HISTORY } from '../constants/app';

const _dataUserLogin = data => ({
  type: USER_LOGIN,
  data,
});

const _dataUserLogout = data => ({
  type: USER_LOGOUT,
  data,
});


const _fetchProfile = data => ({
  type: FETCH_PROFILE,
  data,
});

const _dataFollowup = data => ({
  type: FOLLOW_UP,
  data,
});

const _fetchMyApps = data => ({
  type: FETCH_MY_APPS,
  data,
});

const _addHistory = data => ({
  type: ADD_HISTORY,
  data,
});

const _deleteHistory = data => ({
  type: DELETE_HISTORY,
  data,
});


export const userLogin = (data) => dispatch => {
  // axios.get('https://jsonplaceholder.typicode.com/users')
  //   .then((response) => {
  //    //  console.log('fetchDataAll >>>> ' , response.data)
  //     dispatch(dataFetch([{'1': '2'}]));
  //   })
  dispatch(_dataUserLogin(data));
}

export const userLogout = () => dispatch => {
  dispatch(_dataUserLogout({}))
}

export const fetchProfile = (basic_auth) => dispatch =>{
  axios.post(`${API_URL}/api/fetch_profile?_format=json`, {}, {
    headers: { 
      'Authorization': `Basic ${basic_auth}` 
    }
  })
  .then(function (response) {
    let results = response.data

    console.log('updateProfile : ', results)
    if(results.result){
      let {profile} = results
      // dispatch(_fetchProfile(profile));
    }
  })
  .catch(function (error) {
    console.log(error)
  });
}

export const followUp = (data) => dispatch => {
  dispatch(_dataFollowup(data));
}

export const fetchMyApps = (basic_auth) => dispatch => {
  axios.post(`${API_URL}/api/fetch_mypost?_format=json`, {}, {
    headers: { 
      'Authorization': `Basic ${basic_auth}` 
    }
  })
  .then(function (response) {
    let results = response.data
    if(results.result){
      let {datas} = results
      dispatch(_fetchMyApps(datas.map(function (my_app) {return my_app.id})));
    }
  })
  .catch(function (error) {
    console.log(error)
  });
}

export const addHistory = (data) => dispatch => {
  dispatch(_addHistory(data));
}

export const deleteHistory = (data) => dispatch => {
  dispatch(_deleteHistory(data));
}