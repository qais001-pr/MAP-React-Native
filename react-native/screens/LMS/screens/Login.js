/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'

export default function Login({ navigation, route }) {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const API_BASE_URL = 'http://10.0.2.2/api';

    const onlogin = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter email or ARID');
            return;
        }

        if (!password.trim()) {
            Alert.alert('Error', 'Please enter password');
            return;
        }


        try {
            const formData = new FormData();
            formData.append('credentials', JSON.stringify({
                email: email.trim(),
                password: password.trim(),
            }));

            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                Alert.alert('Success', 'Login successful!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (result.user.user_type === 'admin') {
                                navigation.navigate('AdminDashboard');
                            } else {
                                navigation.navigate('StudentDashboard');
                            }
                        },
                    },
                ]);
            } else {
                Alert.alert('Login Failed', result.message || 'Invalid credentials');
            }
        } catch (error) {
            console.log('Login error:', error);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#F5F5F5',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    width: '90%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 20,
                    elevation: 8,
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#000',
                        textAlign: 'center',
                        marginBottom: 20,
                    }}
                >
                    Login
                </Text>

                <TextInput
                    placeholder="Enter Email / ARID"
                    placeholderTextColor="#888"
                    style={{
                        borderWidth: 1,
                        borderColor: '#CCC',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 16,
                        color: '#000',
                        marginBottom: 15,
                    }}
                    value={email}
                    onChangeText={setemail}
                />

                <TextInput
                    placeholder="Enter Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    style={{
                        borderWidth: 1,
                        borderColor: '#CCC',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        fontSize: 16,
                        color: '#000',
                        marginBottom: 25,
                    }}
                    value={password}
                    onChangeText={setpassword}
                />

                <TouchableOpacity
                    style={{
                        backgroundColor: '#1E90FF',
                        borderRadius: 8,
                        paddingVertical: 12,
                        alignItems: 'center',
                    }}
                    onPress={onlogin}
                >
                    <Text
                        style={{
                            color: '#FFF',
                            fontSize: 16,
                            fontWeight: '600',
                        }}
                    >
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('signup')}
                    style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    <Text style={{ color: '#1E90FF' }}>Don't have an account? Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
