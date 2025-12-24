/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';

const AddStudent = () => {
  const [aridNo, setAridNo] = useState('12345');
  const [studentName, setStudentName] = useState('ALI');
  const [fatherName, setFatherName] = useState('Ahmed');
  const [section, setSection] = useState('A');
  const [degree, setDegree] = useState('BSSE');
  const [semester, setSemester] = useState('7');
  const [city, setCity] = useState('ISL');
  const [password, setpassword] = useState('12345678');
  const [confirmpassword, setconfirmpassword] = useState('12345678');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.7,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setProfileImage(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    if (!aridNo || !studentName || !fatherName) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    const data = {
      arid_no: aridNo,
      full_name: studentName,
      father_name: fatherName,
      degree: degree,
      section: section,
      semester: semester,
      city: city,
      user_type: 'student',
      password: password,
    };
    if (profileImage) {
      formData.append('image', {
        uri: profileImage.uri,
        type: profileImage.type,
        name: profileImage.fileName,
      });
    }
    formData.append('user', JSON.stringify(data));
    try {
      const response = await fetch('http://10.0.2.2/lms/api/users/addUser', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Student added successfully.');
        // Reset form
        setAridNo('');
        setStudentName('');
        setFatherName('');
        setSection('');
        setDegree('');
        setSemester('');
        setCity('');
        setProfileImage(null);
      } else {
        Alert.alert('Error', result.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // Reusable input component
  const Input = ({ placeholder, value, onChangeText }) => (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#999"
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Student</Text>

      {/* Upload Profile Placeholder */}
      <TouchableOpacity style={styles.uploadBox} onPress={handleChoosePhoto}>
        {profileImage ? (
          <Image source={{ uri: profileImage.uri }} style={styles.imagePreview} />
        ) : (
          <>
            <Icon name="camera-plus-outline" size={40} color="#777" />
            <Text style={styles.uploadText}>Upload Profile Picture</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Form Fields */}
      <Input placeholder="ARID No" value={aridNo} onChangeText={setAridNo} />
      <Input placeholder="Student Name" value={studentName} onChangeText={setStudentName} />
      <Input placeholder="Father Name" value={fatherName} onChangeText={setFatherName} />
      <Input placeholder="Section" value={section} onChangeText={setSection} />
      <Input placeholder="Degree" value={degree} onChangeText={setDegree} />
      <Input placeholder="Semester" value={semester} onChangeText={setSemester} />
      <Input placeholder="City" value={city} onChangeText={setCity} />
      <Input placeholder="Password" value={password} onChangeText={setpassword} />
      <Input placeholder="Confirm Password" value={confirmpassword} onChangeText={setconfirmpassword} />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Student</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddStudent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F6F8',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  uploadBox: {
    height: 140,
    backgroundColor: '#E6E6E6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2F5BFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
