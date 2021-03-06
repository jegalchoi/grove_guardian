import React, { useContext, useReducer } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import { GroveContext } from '../../context'
import { registrationsReducer } from './useRegistrations'
import { ContainerWrapper } from '../ContainerWrapper'
import { config } from '../../Constants'

export const Signup = () => {
  const [{}, dispatch] = useContext(GroveContext)

  const [
    {
      username,
      email,
      password,
      passwordConfirmation,
      loading,
      errors,
    },
    signupDispatch,
  ] = useReducer(registrationsReducer, {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    loading: false,
    errors: null,
  })

  const handleSubmit = (e) => {
    // console.log('signing up')

    signupDispatch({ type: 'AUTH_START_LOADING' })

    let user = {
      username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }
    const urlSignup = config.url.API_URL_SIGNUP
    axios
      .post(urlSignup, { user }, { withCredentials: true })
      .then((response) => {
        // console.log(response.data)
        if (response.data.status === 'created') {
          dispatch({
            type: 'AUTH_LOGGED_IN',
            payload: response.data,
          })
          history.push('/')
        } else {
          signupDispatch({
            type: 'AUTH_FAILURE',
            payload: response.data,
          })
        }
      })
    // .catch((error) => console.log('Signup api errors:', error))

    e.preventDefault()
  }

  const history = useHistory()

  const handleErrors = () => {
    // console.log('rendering errors')
    return (
      <div className='text-center'>
        <ul className='p-0'>
          {errors.map((error) => {
            return (
              <li key={error}>
                <strong>{error}</strong>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  // console.log('signup')

  return (
    <ContainerWrapper>
      <h1 className='text-capitalize text-center'>
        <strong>sign up</strong>
      </h1>
      <form onSubmit={handleSubmit}>
        <div className='container'>
          <div className='row justify-content-center form-group form-control-lg'>
            <input
              type='text'
              placeholder='Username'
              disabled={loading}
              value={username}
              onChange={(e) =>
                signupDispatch({
                  type: 'field',
                  fieldName: 'username',
                  payload: e.target.value,
                })
              }
              required={!loading}
            />
          </div>
          <div className='row justify-content-center form-group form-control-lg'>
            <input
              type='email'
              placeholder='Email'
              disabled={loading}
              value={email}
              onChange={(e) =>
                signupDispatch({
                  type: 'field',
                  fieldName: 'email',
                  payload: e.target.value,
                })
              }
              required={!loading}
            />
          </div>
          <div className='row justify-content-center form-group input-group-lg form-control-lg'>
            <input
              type='password'
              placeholder='Password'
              disabled={loading}
              value={password}
              onChange={(e) =>
                signupDispatch({
                  type: 'field',
                  fieldName: 'password',
                  payload: e.target.value,
                })
              }
              required={!loading}
            />
          </div>
          <div className='row justify-content-center form-group input-group-lg form-control-lg'>
            <input
              type='password'
              placeholder='Confirm Password'
              disabled={loading}
              value={passwordConfirmation}
              onChange={(e) =>
                signupDispatch({
                  type: 'field',
                  fieldName: 'passwordConfirmation',
                  payload: e.target.value,
                })
              }
              required={!loading}
            />
          </div>
          {loading ? (
            <div className='row justify-content-center'>
              <button
                disabled
                className='btn-success btn-lg mt-3 text-capitalize'
                style={{ width: '200px' }}
              >
                processing
              </button>
            </div>
          ) : (
            <React.Fragment>
              <div className='row justify-content-center'>
                <button
                  type='submit'
                  placeholder='submit'
                  className='btn-success btn-lg mt-3 text-capitalize'
                  style={{ width: '200px' }}
                >
                  <strong>create account</strong>
                </button>
              </div>
              <div className='row justify-content-center'>
                <Link to='/login'>
                  <button
                    placeholder='login'
                    className='btn-secondary btn-lg mt-3 text-capitalize'
                    style={{ width: '200px' }}
                  >
                    <strong>login</strong>
                  </button>
                </Link>
              </div>
              <div className='row justify-content-center'>
                <Link to='/'>
                  <button
                    placeholder='home'
                    className='btn-primary btn-lg mt-3 text-capitalize'
                    style={{ width: '200px' }}
                  >
                    <strong>home</strong>
                  </button>
                </Link>
              </div>
            </React.Fragment>
          )}
        </div>
      </form>
      <br />
      <div>{errors && handleErrors()}</div>
    </ContainerWrapper>
  )
}
