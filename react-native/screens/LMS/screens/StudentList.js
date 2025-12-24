/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
} from 'react-native';

const StudentList = ({ navigation }) => {
    const [students, setStudents] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://10.0.2.2//lms/api/student/getallstudents')
            .then((response) => response.json())
            .then((data) => {
                setStudents(data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load students');
                setLoading(false);
            });
    }, []);
    const renderStudentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
        >
            <Image
                source={{ uri: `http://10.0.2.2/lms${item?.profile_pic}` }}
                style={{ height: 200, width: '100%' }}
            />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>ARID: {item.arid_no}</Text>
            <Text style={styles.detail}>Father: {item.father_name}</Text>
            <Text style={styles.detail}>Section: {item.section}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2F5BFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }
    const filteredStudent = students.filter((s) => s.full_name.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student List</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Search students..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#888"
            />

            <FlatList
                data={filteredStudent}
                keyExtractor={(item) => item.user_id.toString()}
                renderItem={renderStudentItem}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No students found</Text>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default StudentList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
        textAlign: 'center',
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    detail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 32,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
