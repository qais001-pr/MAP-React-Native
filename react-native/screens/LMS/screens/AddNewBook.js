/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
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
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const AddNewBook = () => {
    const [isbn, setIsbn] = useState('213');
    const [title, setTitle] = useState('abc');
    const [publishDate, setPublishDate] = useState('2000-12-01');
    const [price, setPrice] = useState('1000');
    const [quantity, setQuantity] = useState('12');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const Input = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#999"
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChangeText}
            style={styles.input}
        />
    );

    const pickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
            },
            response => {
                if (response.didCancel) return;

                if (response.errorCode) {
                    Alert.alert('Error', response.errorMessage);
                    return;
                }

                const asset = response.assets[0];
                setImage(asset);
            }
        );
    };

    const handleAddBook = async () => {
        if (!isbn || !title || !publishDate || !price || !quantity) {
            Alert.alert('Validation Error', 'All fields are required');
            return;
        }

        if (!image) {
            Alert.alert('Validation Error', 'Book image is required');
            return;
        }

        const formData = new FormData();

        const data = {
            isbn: isbn,
            book_title: title,
            publish_date: publishDate,
            quantity: parseInt(quantity, 10),
            price: parseFloat(price),
        };
        formData.append('book', JSON.stringify(data));
        formData.append('image', {
            uri: image.uri,
            name: 'book.jpg',
            type: 'image/jpeg',
        });
        try {
            setLoading(true);
            const response = await fetch('http://10.0.2.2/lms/api/books/addBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to add book');
            }

            Alert.alert('Success', 'Book added successfully');

            // Reset form
            setIsbn('');
            setTitle('');
            setPublishDate('');
            setPrice('');
            setQuantity('');
            setImage(null);

        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Book</Text>

            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                ) : (
                    <>
                        <Icon name="book-plus-outline" size={42} color="#777" />
                        <Text style={styles.uploadText}>Upload Book Image</Text>
                    </>
                )}
            </TouchableOpacity>

            <Input placeholder="ISBN" value={isbn} onChangeText={setIsbn} />
            <Input placeholder="Book Title" value={title} onChangeText={setTitle} />
            <Input
                placeholder="Publish Date (YYYY-MM-DD)"
                value={publishDate}
                onChangeText={setPublishDate}
            />
            <Input
                placeholder="Price"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
            />
            <Input
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
            />

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleAddBook}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Saving...' : 'Add Book'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddNewBook;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F4F6F8',
        flexGrow: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        color: '#222',
    },
    uploadBox: {
        height: 150,
        backgroundColor: '#E6E6E6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
    },
    uploadText: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
