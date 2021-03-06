import React, { useReducer, createContext, useEffect } from 'react'
import axios from 'axios'
import { config } from './Constants'
export const GroveContext = createContext()

const initialState = {
  formIsLoading: false,
  permissions: 'LOADING',
  userId: '',
  username: '',
  userEmail: '',
  plantsPublic: [],
  plantsUser: [],
  displayUserPlants: false,
  plantsNeedRefresh: false,
  errors: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'FORM_START_LOADING':
      return {
        ...state,
        formIsLoading: true,
      }
    case 'AUTH_LOGGED_IN':
      return {
        ...state,
        formIsLoading: false,
        permissions: 'LOGGED_IN',
        userId: action.payload.user.id,
        username: action.payload.user.username,
        userEmail: action.payload.user.email,
      }
    case 'AUTH_NOT_LOGGED_IN':
      return {
        ...state,
        formIsLoading: false,
        permissions: 'NOT_LOGGED_IN',
      }
    case 'AUTH_LOGOUT':
      return {
        ...state,
        formIsLoading: false,
        permissions: 'NOT_LOGGED_IN',
        userId: '',
        username: '',
        userEmail: '',
        plantsUser: [],
        displayUserPlants: false,
        plantsNeedRefresh: true,
        errors: null,
      }
    case 'PLANTS_PUBLIC_FETCH_SUCCESS':
      return {
        ...state,
        plantsPublic: action.payload.plants,
        plantsNeedRefresh: false,
      }
    case 'PLANTS_USER_FETCH_SUCCESS':
      return {
        ...state,
        plantsUser: action.payload.plants,
        plantsNeedRefresh: false,
      }
    case 'PLANT_FETCH_FAILURE':
      return {
        ...state,
        plantsPublic: [],
        plantsUser: [],
        plantsNeedRefresh: false,
        errors: action.payload.errors,
      }
    case 'PLANT_DISPLAY_TOGGLE':
      return {
        ...state,
        displayUserPlants: action.payload,
      }
    case 'PLANT_NEED_REFRESH':
      return {
        ...state,
        formIsLoading: false,
        plantsNeedRefresh: true,
      }
    default:
      return state
  }
}

export const GroveProvider = (props) => {
  // console.log('context')

  const [state, dispatch] = useReducer(reducer, initialState)
  const { userId, displayUserPlants, plantsNeedRefresh } = state

  const fetchLoginStatus = () => {
    // console.log('fetching login status')

    const urlLoginStatus = config.url.API_URL_LOGIN_STATUS
    axios
      .get(urlLoginStatus, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data)
        const authStatus = response.data.logged_in
        dispatch({
          type: authStatus ? 'AUTH_LOGGED_IN' : 'AUTH_NOT_LOGGED_IN',
          payload: response.data,
        })
        fetchPlants()
      })
    // .catch((errors) =>
    //   // console.log('fetch login api errors:', errors)
    // )
  }

  const fetchPlants = () => {
    // console.log('fetching plants')

    const urlUserPlants =
      config.url.API_URL_USER_PLANTS + `${userId}/plants/`
    const urlAllPlants = config.url.API_URL_ALL_PLANTS
    const urlPlantsGet = displayUserPlants
      ? urlUserPlants
      : urlAllPlants
    // console.log(urlPlantsGet)
    axios
      .get(urlPlantsGet, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data)
        dispatch({
          type:
            response.statusText === 'OK'
              ? displayUserPlants
                ? 'PLANTS_USER_FETCH_SUCCESS'
                : 'PLANTS_PUBLIC_FETCH_SUCCESS'
              : 'PLANTS_FETCH_FAILURE',
          payload: response.data,
        })
      })
    // .catch((errors) =>
    //   // console.log('fetch plants api errors:', errors)
    // )
  }

  useEffect(() => {
    fetchLoginStatus()
  }, [plantsNeedRefresh, displayUserPlants])

  return (
    <GroveContext.Provider value={[state, dispatch]}>
      {props.children}
    </GroveContext.Provider>
  )
}
