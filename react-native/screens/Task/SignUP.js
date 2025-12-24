/* eslint-disable react-native/no-inline-styles */
/* eslint-disable jsx-quotes */

import { View, Text, TextInput, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function USERFORM({ navigation }) {
    const [username, setUsername] = useState('Ali');
    const [password, setPassword] = useState('123');
    const [admin, setAdmin] = useState('');
    const [adminpass, setAdminPass] = useState('');
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const initializeData = async () => {
            try {
                const storedAdmin = await AsyncStorage.getItem('admin');
                if (!storedAdmin) {
                    const defaultAdmin = { username: 'admin', password: 'admin123' };
                    await AsyncStorage.setItem('admin', JSON.stringify(defaultAdmin));
                    setAdmin(defaultAdmin.username);
                    setAdminPass(defaultAdmin.password);
                } else {
                    const parsedAdmin = JSON.parse(storedAdmin);
                    setAdmin(parsedAdmin.username);
                    setAdminPass(parsedAdmin.password);
                }

                const storedUsers = await AsyncStorage.getItem('users');
                if (storedUsers) {
                    setUserList(JSON.parse(storedUsers));
                } else {
                    setUserList([]);
                }
            } catch (error) {
                console.log('Error initializing data:', error);
            }
        };
        initializeData();
    }, []);

    const login = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
        }

        if (username === admin && password === adminpass) {
            Alert.alert('Success', 'Admin logged in');
            navigation.navigate('welcome', { username });
            return;
        }

        const userFound = userList.find(u => u.username === username && u.password === password);
        if (userFound) {
            Alert.alert('Success', 'User logged in');
            navigation.navigate('welcome', { username });
        } else {
            Alert.alert('Error', 'Invalid username or password');
        }
    };

    const addNewUser = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
        }

        const userExists = userList.find(u => u.username === username);
        if (userExists) {
            Alert.alert('Error', 'User already exists');
            return;
        }

        const newUserList = [...userList, { username, password }];
        try {
            await AsyncStorage.setItem('users', JSON.stringify(newUserList));
            setUserList(newUserList);
            Alert.alert('Success', 'User added successfully');
            setUsername('');
            setPassword('');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to add user');
        }
    };

    return (
        <View style={{ gap: 20, flex: 1, backgroundColor: 'white', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Sign Up / Login</Text>

            <View style={{ width: '80%', borderColor: 'black', borderWidth: 2 }}>
                <TextInput placeholder='User name' value={username} onChangeText={setUsername} />
            </View>

            <View style={{ width: '80%', borderColor: 'black', borderWidth: 2 }}>
                <TextInput placeholder='Password' value={password} secureTextEntry onChangeText={setPassword} />
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button title='Login' onPress={login} />
                <Button title='Add New' onPress={addNewUser} />
            </View>
            <View style={{ width: '80%', borderColor: 'black', borderWidth: 2 }}>
                <TextInput placeholder='Admin ID' value={admin} editable={false} />
            </View>
            <View style={{ width: '80%', borderColor: 'black', borderWidth: 2 }}>
                <TextInput placeholder='Admin Password' value={adminpass} editable={false} secureTextEntry />
            </View>
        </View>
    );
}
