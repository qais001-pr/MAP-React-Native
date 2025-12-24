/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Dashboard = ({ navigation, route }) => {
  const Card = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Icon name={icon} size={36} color="#4A90E2" />
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.grid}>
        <Card icon="book" label="Books" onPress={() => navigation.navigate('allbooks')} />
        <Card icon="book-plus" label="Add Book" onPress={() => navigation.navigate('addbooks')} />

        <Card icon="account-school" label="Students" onPress={() => navigation.navigate('allstudents')} />
        <Card icon="account-plus" label="Add Student" onPress={() => navigation.navigate('addstudent')} />

        <Card icon="upload" label="Issue Book" onPress={() => navigation.navigate('issuebook')} />
        <Card icon="download" label="Return Book" onPress={() => navigation.navigate('returnbook')} />

        <Card icon="file-document-outline" label="Borrowed Books" onPress={() => navigation.navigate('borrowbook')} />
        <Card icon="cash-multiple" label="Fine Summary" />
      </View>

      <TouchableOpacity style={styles.profileCard}>
        <Icon name="account-circle" size={40} color="#4A90E2" />
        <Text style={styles.cardText}>My Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F4F6F8',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
