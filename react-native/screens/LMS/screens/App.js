/* eslint-disable comma-dangle */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable jsx-quotes */
/* eslint-disable semi */
import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Login from './Login'
import Signup from './Signup'
import Dashboard from './Dashboard'
import BookList from './BookList'
import AddNewBook from './AddNewBook'
import BookListSimple from './BookListSimple'

import AddStudent from './AddStudent'
import StudentList from './StudentList'

import IssueBookScreen from './IssueBookScreen'
import ReturnBookScreen from './ReturnBook'
import BorrowedBook from './BorrowedBook'
const Stack = createStackNavigator()


export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='dashboard'>
                <Stack.Screen name='login' component={Login}
                    options={{ headerTitle: 'Login', headerTitleAlign: 'left' }} />

                <Stack.Screen name='signup' component={Signup}
                    options={{
                        headerTitle: 'Home', headerTitleAlign: 'left',
                        header: () => (
                            <View style={{ backgroundColor: 'white', elevation: 10, height: 50, justifyContent: 'center', paddingLeft: 20 }}>
                                <Text style={{ fontSize: 20, color: 'black', }}>Login</Text>
                            </View>
                        ),
                    }} />

                <Stack.Screen name='dashboard' component={Dashboard}
                    options={{ headerTitle: 'Dashboard', headerTitleAlign: 'left' }} />



                <Stack.Screen name='allbooks' component={BookList}
                    options={{ headerTitle: 'Book List', headerTitleAlign: 'left' }} />

                <Stack.Screen name='addbooks' component={AddNewBook}
                    options={{ headerTitle: 'Add New Book', headerTitleAlign: 'left' }} />

                <Stack.Screen name='booksimple' component={BookListSimple}
                    options={{ headerTitle: 'Book Details', headerTitleAlign: 'left' }} />

                <Stack.Screen name='addstudent' component={AddStudent}
                    options={{ headerTitle: 'Add Student', headerTitleAlign: 'left' }} />

                <Stack.Screen name='allstudents' component={StudentList}
                    options={{ headerTitle: 'Student List', headerTitleAlign: 'left' }} />


                <Stack.Screen name='issuebook' component={IssueBookScreen}
                    options={{ headerTitle: 'Issue Book', headerTitleAlign: 'left' }} />

                <Stack.Screen name='returnbook' component={ReturnBookScreen}
                    options={{ headerTitle: 'Return Book', headerTitleAlign: 'left' }} />


                <Stack.Screen name='borrowbook' component={BorrowedBook}
                    options={{ headerTitle: 'Borrow Book', headerTitleAlign: 'left' }} />


            </Stack.Navigator>
        </NavigationContainer>
    )
}

