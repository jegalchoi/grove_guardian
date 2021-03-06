import React, { useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import { Link, useHistory, useParams } from 'react-router-dom'
import { GroveContext } from '../../context'
import { plantsReducer } from './usePlants'
import { useCookies } from 'react-cookie'
import { config } from '../../Constants'

export const PlantDetail = () => {
  const [{ userId }, dispatch] = useContext(GroveContext)
  const [cookies] = useCookies(['plantId'])
  const plantId = cookies.plantId

  const [
    {
      loading,
      id,
      name,
      notes,
      water,
      hidden,
      image,
      imageId,
      imagePublicId,
      ownerId,
      errors,
    },
    plantDetailDispatch,
  ] = useReducer(plantsReducer, {
    loading: true,
    id: plantId,
    name: '',
    notes: '',
    water: '',
    hidden: '',
    image: '',
    imageId: '',
    imagePublicId: '',
    ownerId: '',
    errors: null,
  })

  useEffect(() => {
    // console.log('fetching plant detail')

    const urlPlantGet = config.url.API_URL_PLANT_GET + `${plantId}`
    axios
      .get(urlPlantGet, { withCredentials: true })
      .then((response) => {
        // console.log(response.data)
        plantDetailDispatch({
          type:
            response.data.status !== 400 ||
            response.data.status !== 500
              ? 'PLANT_DETAIL_FETCH_SUCCESS'
              : 'PLANT_ERRORS',
          payload: response.data,
        })
      })
    // .catch((errors) =>
    //   // console.log('PlantDetail/useEffect api errors:', errors)
    // )
  }, [])

  const deletePlant = () => {
    const confirmation = confirm(
      'Are you sure you want to delete this plant?'
    )

    if (confirmation) {
      // console.log('deleting plant from plant detail')

      plantDetailDispatch({ type: 'PLANT_START_LOADING' })

      const urlPlantDestroy =
        config.url.API_URL_PLANT_DESTROY +
        `${userId}/plants/${plantId}`
      axios
        .delete(urlPlantDestroy, { withCredentials: true })
        .then((response) => {
          // console.log(response.data)
          if (response.data.status === 'destroyed') {
            dispatch({
              type: 'PLANT_NEED_REFRESH',
            })
            history.push('/')
            if (imageId !== null) {
              deleteImage(imageId)
            }
          }
        })
      // .catch((error) =>
      //   // console.log('PlantDetail/deletePlant api errors:', error)
      // )
    }
  }

  const deleteImage = (imageId) => {
    // console.log('deleting image from plant detail')

    const urlImageDestroy =
      config.url.API_URL_IMAGE_DESTROY + `${imageId}`
    axios
      .delete(urlImageDestroy, { withCredentials: true })
      .then((response) => {
        // console.log(response.data)
        if (response.data.status === 'destroyed') {
          // console.log('image deleted from plant detail')
        } else {
          plantDetailDispatch({
            type: 'IMAGE_ERRORS',
            payload: response.data,
          })
        }
      })
    // .catch((error) =>
    //   // console.log('PlantDetail/deleteImage api errors:', error)
    // )
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

  const formatNotes = (plantNotes) => {
    // console.log(plantNotes)

    return plantNotes === '' ? (
      <div>
        <p>none</p>
      </div>
    ) : (
      <div>
        <ul className='p-0'>
          {plantNotes.split(',').map((note) => (
            <li
              key={note}
              className='list-group-item text-break text-wrap'
            >
              {note}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const getWeekDay = (date) => {
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const day = date.getDay()
    return weekdays[day]
  }

  // console.log('plant detail')

  return (
    <React.Fragment>
      {errors || loading ? null : (
        <div className='container'>
          {/* {title} */}
          <div className='row'>
            <div className='col-10 mx-auto text-center my-5'>
              <h1 className='text-break text-wrap'>{name}</h1>
            </div>
          </div>
          {/* {plant info} */}
          <div className='row'>
            <div className='col-10 mx-auto col-md-6 my-3'>
              <img src={image} alt={name} className='img-fluid' />
            </div>
            <div className='col-10 mx-auto col-md-6 text-center'>
              {userId === ownerId &&
                (water !== null ? (
                  <h4>
                    <strong>
                      last watered {getWeekDay(new Date(water))},{' '}
                      {new Date(water).toLocaleDateString()}
                    </strong>
                  </h4>
                ) : (
                  <h4>
                    <strong>never been watered</strong>
                  </h4>
                ))}
              {userId === ownerId && (
                <React.Fragment>
                  <p className='font-weight-bold mt-3 mb-0 text-capitalize'>
                    notes:
                  </p>
                  <div>{formatNotes(notes)}</div>
                  <p>
                    <strong className='text-muted text-capitalize'>
                      {hidden ? 'private' : 'public'}
                    </strong>
                    <br />
                    <small className='text-muted'>
                      {hidden
                        ? 'Only you can view this plant.'
                        : 'Everyone can view this plant.'}
                    </small>
                  </p>
                </React.Fragment>
              )}
              {/* {buttons} */}
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
                  {userId === ownerId && (
                    <React.Fragment>
                      <div className='row justify-content-center'>
                        <Link to='/edit'>
                          <button
                            placeholder='edit'
                            className='btn-success btn-lg mt-3 text-capitalize'
                            style={{ width: '200px' }}
                          >
                            <strong>edit plant</strong>
                          </button>
                        </Link>
                      </div>
                      <div className='row justify-content-center'>
                        <button
                          placeholder='delete'
                          className='btn-danger btn-lg mt-3 text-uppercase'
                          onClick={deletePlant}
                          style={{ width: '200px' }}
                        >
                          <strong>delete plant</strong>
                        </button>
                      </div>
                    </React.Fragment>
                  )}
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
          </div>
        </div>
      )}
      <div>{errors && handleErrors()}</div>
    </React.Fragment>
  )
}
