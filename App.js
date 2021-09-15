import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { ListItem, Avatar } from 'react-native-elements'

export default function App() {

  const [loading, setLoading] = useState(true)
  const [dataList, setDataList] = useState([])
  const [error, setError] = useState({})

  var mapRef;

  const location = {
    lat: 13.8267133, 
    lng: 100.5465866
  }

  const getRestaurant = async () => {

    const locationStr = location.lat + ',' + location.lng
    const radius = 20 * 1000
    const type = 'restaurant'
    const key = 'AlzaSyBzwsOhJHzOzYUnA3H1mlJpnMn3ROYP3DM'

    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + locationStr + '&radius=' + radius + '&type=' + type + '&key=' + key)

    console.log(data.status)
    if(data.status == 'OK'){
      setDataList(data.results)
    } else {
      setError(data)
    }

    setLoading(false)

  }

  const setCenterMap = (lat, lng, map) => {
    mapRef.setCamera({
      center: {
          latitude: Number(lat),
          longitude: Number(lng),
      },
      pitch: 0,
      heading: 0,
      zoom: 18,
      altitude: 0,
  });
};

  useEffect(() => {
    getRestaurant()
  }, [])

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      {
        !loading && (
          <>
            <View style={{flex: 0.6, ...styles.container}}>
              <MapView
                ref={(ref) => mapRef = ref}
                style={styles.map}
                initialRegion={{
                  latitude: location.lat,
                  longitude: location.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                initialCamera={{
                  center: {
                    latitude: location.lat, 
                    longitude: location.lng
                  }, 
                  pitch: 0,
                  heading: 0, 
                  altitude: 0, 
                  zoom: 14
                }}
              >
                {
                  dataList.map((data, index) => (
                    <Marker key={index}
                      title={data.name}
                      coordinate={{
                        latitude: data.geometry.location.lat, 
                        longitude: data.geometry.location.lng
                      }}
                      image={{uri: data.icon}}
                    />
                  ))
                }
              </MapView>
            </View>
            <View style={{flex: 0.4}}>
                {
                  dataList.length > 0 ? (
                    <ScrollView>
                    {
                      dataList.map((data, index) => (
                        <ListItem key={index} bottomDivider onPress={() => setCenterMap(data.geometry.location.lat, data.geometry.location.lng, mapRef)}>
                          <Avatar source={{uri: data.icon}} />
                          <ListItem.Content>
                            <ListItem.Title>{data.name}</ListItem.Title>
                            <ListItem.Subtitle>{data.vicinity}</ListItem.Subtitle>
                          </ListItem.Content>
                        </ListItem>
                      ))
                    }
                    </ScrollView>
                  ) : (
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{textAlign: 'center'}}>{error.error_message}</Text>
                    </View>
                  )
                }
            </View>
          </>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });