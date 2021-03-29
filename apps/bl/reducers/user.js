import { USER_LOGIN, USER_LOGOUT, FETCH_PROFILE, FOLLOW_UP, FETCH_MY_APPS, ADD_HISTORY, DELETE_HISTORY } from '../constants/app';

export const  mergeArrays = (...arrays) => {
  let jointArray = []

  arrays.forEach(array => {
      jointArray = [...jointArray, ...array]
  })
  const uniqueArray = jointArray.reduce((newArray, item) =>{
    if (newArray.includes(item)){
      return newArray
    } else {
      return [...newArray, item]
    }
  }, [])
  return uniqueArray
}

const initialState = {
  data: [],
  profile: [],
  follow_ups: [],
  my_apps: [],
  historys: []
}

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN:{
      console.log('Reduces > USER_LOGIN > ', action.data)
      return {...state, data: action.data}
    }
    
    case USER_LOGOUT: {
      console.log('Reduces > USER_LOGOUT > ', action.data)
      return initialState
    }

    case FETCH_PROFILE:{
      console.log('Reduces > FETCH_PROFILE > ', action.data)
      return {...state, profile: action.data}
    }

    case FOLLOW_UP: {
      console.log('Reduces > FOLLOW_UP > ', action.data)
      return {...state, follow_ups: action.data}
    }

    case FETCH_MY_APPS: {
      return {
        ...state, my_apps: action.data
      }
    }

    case ADD_HISTORY: {
      let historys = state.historys.filter((item)=>{ return item !== action.data })
      historys.splice(0, 0, action.data);
      return { ...state, historys }
    }

    case DELETE_HISTORY: {
      let historys = state.historys.filter((item)=>{ return item !== action.data })
      return { ...state, historys }
    }
   
    default:
      return state;
  }
}