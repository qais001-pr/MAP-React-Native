/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Signup({ navigation }) {
    const [aridno, setaridno] = useState('');
    const [fullname, setfullname] = useState('');
    const [fathername, setfathername] = useState('');
    const [degree, setdegree] = useState('');
    const [section, setsection] = useState('');
    const [semester, setsemester] = useState('');
    const [city, setcity] = useState('');
    const [password, setpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [profile, setprofile] = useState(null);
    const [loading, setloading] = useState(false);

    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert('Error', response.errorMessage);
                return;
            }
            setprofile(response.assets[0]);
        });
    };
    const onSignup = async () => {
        if (
            !aridno || !fullname || !fathername || !degree ||
            !section || !semester || !city || !password || !confirmpassword
        ) {
            Alert.alert('Validation Error', 'All fields are required');
            return;
        }

        if (password !== confirmpassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        const formData = new FormData();
        formData.append('aridNo', aridno);
        formData.append('fullName', fullname);
        formData.append('fatherName', fathername);
        formData.append('degree', degree);
        formData.append('section', section);
        formData.append('semester', semester);
        formData.append('city', city);
        formData.append('password', password);

        if (profile) {
            formData.append('profileImage', {
                uri: profile.uri,
                type: profile.type,
                name: profile.fileName || 'profile.jpg',
            });
        }

        try {
            setloading(true);

            const response = await fetch(
                'http://10.0.2.2/api/users/signup',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            Alert.alert('Success', 'Account created successfully');
            navigation.navigate('login');

        } catch (error) {
            Alert.alert('Signup Failed', error.message);
        } finally {
            setloading(false);
        }
    };


    const inputStyle = {
        backgroundColor: '#EDEDED',
        width: '90%',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 15,
        color: '#000',
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 28, fontWeight: '800' }}>
                    Create Account
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 20 }}>
                    Library Management System
                </Text>

                {/* Profile Image */}
                <TouchableOpacity
                    onPress={pickImage}
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: 70,
                        backgroundColor: '#CCC',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}
                >
                    {profile ? (
                        <Image
                            source={{ uri: profile.uri }}
                            style={{ width: 140, height: 140, borderRadius: 70 }}
                        />
                    ) : (
                        <Text>Upload Profile Pic</Text>
                    )}
                </TouchableOpacity>

                <TextInput placeholder="ARID No" style={inputStyle} onChangeText={setaridno} />
                <TextInput placeholder="Full Name" style={inputStyle} onChangeText={setfullname} />
                <TextInput placeholder="Father Name" style={inputStyle} onChangeText={setfathername} />
                <TextInput placeholder="Degree" style={inputStyle} onChangeText={setdegree} />
                <TextInput placeholder="Section" style={inputStyle} onChangeText={setsection} />
                <TextInput placeholder="Semester" style={inputStyle} onChangeText={setsemester} />
                <TextInput placeholder="City" style={inputStyle} onChangeText={setcity} />

                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={inputStyle}
                    onChangeText={setpassword}
                />
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry
                    style={inputStyle}
                    onChangeText={setconfirmpassword}
                />

                <TouchableOpacity
                    onPress={onSignup}
                    disabled={loading}
                    style={{
                        backgroundColor: '#1E90FF',
                        width: '90%',
                        padding: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 10,
                    }}
                >
                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
                        {loading ? 'Creating...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('login')}
                    style={{ marginTop: 15, marginBottom: 40 }}
                >
                    <Text>
                        Already have an account?
                        <Text style={{ color: '#1E90FF', fontWeight: '700' }}> Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
