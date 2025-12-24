/* eslint-disable eol-last */
/* eslint-disable semi */
/* eslint-disable jsx-quotes */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import USERFORM from './SignUP'
import MapWelcome from './MapWelcome'
import { NavigationContainer } from '@react-navigation/native'
const Stack = createStackNavigator()
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='signup'>
                <Stack.Screen name='signup' component={USERFORM} />
                <Stack.Screen name='welcome' component={MapWelcome} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}