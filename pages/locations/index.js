import React, { Component } from 'react'
import Layout from '../../components/Layout'
import FilterBar from '../../components/FilterBar'
import LocationList from '../../components/LocationList'
import { fetchLocations } from '../../core/firebaseApi'

import { calculateAllDistances } from '../../core/distance'


const compose = (fn, ...rest) =>
  rest.length === 0 ?
    fn :
    (...args) => fn(compose(...rest)(...args))

function mergeLocationsAndDistances(locations, distances) {
  const zip = (e, index) => [locations[index], distances[index]]
  const merge = (location, distance) => {
    const locationAndDistance = location
    locationAndDistance.distance = distance // i hate this; it breaks the consistency of the whole app
    return locationAndDistance
  }
  return locations.map(compose(zip, merge))
}

export default class LocationsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showOpen: false,
      locations: [],
      currentLocation: null,
    }
  }

  componentWillMount() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(currentLocation => {
        this.setState({ currentLocation }, this.setLocations)
      }, () => this.setLocations)
    } else {
      this.setLocations()
    }
  }

  setLocations() {
    const { currentLocation } = this.state
    if (currentLocation) {
      let locationsCache
      fetchLocations()
        .then(locations => {
          locationsCache = locations
          return calculateAllDistances(locations, currentLocation)

          //const locationsWithDistance = mergeLocationsAndDistances(locationsCache, distances)
          //this.setState({ locations: locationsWithDistance })
        })
        .then(directions => {
          console.log(directions)
        })
    } else {
      fetchLocations()
        .then(locations => {
          this.setState({ locations })
        })
    }
  }

  handleToggleOpen() {
    this.setState({ showOpen: !this.state.showOpen })
  }

  render() {
    const { locations } = this.state
    return (
      <Layout>
        <FilterBar
          showOpen={this.state.showOpen}
          onToggleOpen={(e) => this.handleToggleOpen(e)}
        />
        <LocationList locations={locations} />
      </Layout>
    )
  }
}
