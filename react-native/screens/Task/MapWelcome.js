/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapWelcome({ navigation, route }) {
    global.URL = 'http://172.20.160.1/fyp/api/Task/';

    const { username } = route.params || {};
    const [user, setUser] = useState(username || '');
    const [location, setLocation] = useState('Home');
    const [lat, setLat] = useState(33.64);
    const [lon, setLon] = useState(73.08);


    const handleClickMap = (event) => {
        const { coordinate } = event.nativeEvent;
        setLat(coordinate.latitude);
        setLon(coordinate.longitude);
        console.log(coordinate);
    };

    const saveData = async () => {
        console.log(lat);
        console.log(lon);
        console.log(user);
        console.log(location);
        if (!location || !lat || !lon) {
            Alert.alert('Error', 'Please enter a location name and select a point on the map.');
            return;
        }

        try {
            const response = await fetch(URL + 'addUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uname: user,
                    lat: lat,
                    lon: lon,
                    locName: location,
                }),
            });

            const data = await response.json();
            Alert.alert('Success', 'Data saved successfully!');
            console.log('Server response:', data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save data.');
        }
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>MapWelcome</Text>

            <MapView
                style={{ flex: 1, height: 500, marginBottom: 10 }}
                onPress={handleClickMap}
                initialRegion={{
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.02,
                }}
            >
                <Marker coordinate={{ latitude: lat, longitude: lon }}  />
            </MapView>

            <View style={{ borderWidth: 1, borderRadius: 5, marginBottom: 10, padding: 5 }}>
                <TextInput
                    placeholder="Enter User Location Name"
                    value={location}
                    onChangeText={setLocation}
                    style={{ padding: 5 }}
                />
            </View>

            <Button title="Save" onPress={saveData} />
        </View>
    );
}
