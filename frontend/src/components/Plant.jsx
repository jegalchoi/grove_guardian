import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
// import { PlantConsumer } from './context'

export class Plant extends Component {
  // formatDate = d => {
  //   const date = new Date(Date.parse(d));
  //   const YYYY = date.getFullYear();
  //   const MM = `0${date.getMonth() + 1}`.slice(-2);
  //   const DD = `0${date.getDate()}`.slice(-2);
  //   return `${YYYY}-${MM}-${DD}`
  // }

  // compareDates = date => {
  //   const today = new Date();
  //   const todayFormatted = this.formatDate(today);
  //   return (todayFormatted == this.formatDate(date))
  // }

  // handleWaterPlant = () => {
  //   const url = `http://localhost:3001/api/v1/users/${this.props.plant.user_id}/plants/${this.props.plant.id}`
  //   const body = {
  //     water: new Date()
  //   };

  //   fetch(url, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(body)
  //   })
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json()
  //       }
  //       throw new Error('Network response was not ok.')
  //     })
  //     .then(json => {
  //       this.props.getPlants()
  //     })
  //     .catch(error => console.log(error.message))
  // }

  render() {
    const {
      id,
      name,
      notes,
      water,
      hidden,
      image,
      user_id,
    } = this.props.plant

    return (
      <PlantWrapper className='col-9 mx-auto col-md-6 col-lg-3 my-3'>
        <div className='card'>
          <div
            className='img-container p-5'
            // onClick={() => value.handleDetail(id)}
          >
            <Link to='/details'>
              <img src={image} alt={name} className='card-img-top' />
            </Link>
            {/* <button
            className='water-btn'
            // disabled={water == null ? false : this.compareDates(water)}
            // onClick={() => this.handleWaterPlant()}
          >
            {water == null || !this.compareDates(water) ? (
              <span className='badge badge-info'>water plant</span>
            ) : (
                <p className='text-capitalize mb-0' disabled>
                  {' '}
            watered today
                </p>
            )}
          </button> */}
          </div>
          <div className='card-footer d-flex justify-content-between'>
            <p className='align-self-center mb-0'>{name}</p>
            {/* <h5 className='font-italic mb-0'>
            notes will go here
          </h5> */}
          </div>
        </div>
      </PlantWrapper>
    )
  }
}
const PlantWrapper = styled.div`
  .card {
    border-color: transparent;
    transition: all 1s linear;
  }
  .card-footer {
    background: transparent:
    border-top: transparent;
    transition: all 1s linear;
  }
  &:hover {
    .card {
      border: 0.04rem solid rgba(0,0,0,0.2);
      box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.2);
    }
    .card-footer {
      background: rgba(247, 247, 247);
    }
  }
  .img-container {
    position: relative;
    overflow: hidden;
  }
  .card-img-top {
    transition: all 1s linear;
  }
  .img-container:hover  .card-img-top {
    transform: scale(1.2);
  }
  .water-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.2rem 0.4rem;
    background: bg-info;
    border: none;
    color: bg-primary;
    font-size: 1.1rem;
    border-radius: 0.5rem 0 0 0;
    transform: translate(100%, 100%);
    transition: all 1s linear;
  }
  .img-container:hover .water-btn {
    transform: translate(0, 0);
  }
  .water-btn:hover {
    color: bg-primary;
    cursor: pointer;
  }
`