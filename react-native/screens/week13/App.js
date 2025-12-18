/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Modal,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
// import URL from './config.js';
export default function MyApp() {
global.URL = 'http://192.168.100.75/fypwebapi/api/Student/'
    const [students, setStudents] = useState([]);
    const [imageUri, setImageUri] = useState(null);
    const [imagetype, setimagetype] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const getStudents = async () => {
        try {
            const response = await fetch(URL + 'getStudents');
            const data = await response.json();
            setStudents(data.studentList || []);
        } catch (error) {
            console.log('connected');
            console.error(error);
        }
    };

    const getImage = () => {
        launchCamera({ mediaType: 'photo' }, response => {
            if (!response.didCancel && !response.errorCode) {
                setImageUri(response.assets[0].uri);
                setimagetype(response.assets[0].type);
                setPreviewVisible(true);
            }
        });
    };

    const addStudent = async () => {
        const st = {
            aridno: 7800,
            name: 'nothing',
            fathername: 'nothing',
            section: 'A',
            degree: 'BSSE',
            city: 'KLR',
            semester: 2,
        };

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            name: 'profile.jpg',
            type: imagetype,
        });
        formData.append('student', JSON.stringify(st));

        try {
            const response = await fetch(URL + 'AddStudent', {
                method: 'POST',
                body: formData,
            });
            await response.text();
            setPreviewVisible(false);
            setImageUri(null);
            getStudents();
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: 'http://192.168.100.75/fypwebapi/images/' + item.Profileimage }}
                style={styles.avatar}
            />
            <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subText}>Arid No: {item.aridno}</Text>
                <Text style={styles.subText}>Father: {item.fathername}</Text>
                <View style={styles.row}>
                    <Text style={styles.tag}>{item.degree}</Text>
                    <Text style={styles.tag}>Sem {item.semester}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Students</Text>
                <Text style={styles.headerSubtitle}>Management Dashboard</Text>
            </View>

            <FlatList
                data={students}
                keyExtractor={item => item.aridno.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.primaryBtn} onPress={getStudents}>
                    <Text style={styles.btnText}>Load</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn} onPress={getImage}>
                    <Text style={styles.btnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.successBtn} onPress={addStudent}>
                    <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={previewVisible} transparent animationType="slide">
                <View style={styles.previewOverlay}>
                    <View style={styles.previewCard}>
                        <Text style={styles.previewTitle}>Image Preview</Text>
                        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
                        <View style={styles.previewActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setPreviewVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.successBtn} onPress={addStudent}>
                                <Text style={styles.btnText}>Upload</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#1e3a8a',
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#c7d2fe',
        marginTop: 4,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        elevation: 4,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    subText: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    row: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 8,
    },
    tag: {
        backgroundColor: '#e0e7ff',
        color: '#1e3a8a',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: '600',
    },
    bottomBar: {
        flexDirection: 'row',
        padding: 12,
        gap: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#e5e7eb',
    },
    primaryBtn: {
        flex: 1,
        backgroundColor: '#1e3a8a',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryBtn: {
        flex: 1,
        backgroundColor: '#475569',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    successBtn: {
        flex: 1,
        backgroundColor: '#16a34a',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    previewOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewCard: {
        backgroundColor: '#fff',
        width: '85%',
        borderRadius: 16,
        padding: 16,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    previewImage: {
        width: '100%',
        height: 250,
        borderRadius: 12,
    },
    previewActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#dc2626',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
});