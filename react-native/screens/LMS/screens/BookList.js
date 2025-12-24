/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

const BookList = ({ navigation, route }) => {
    const [searchText, setSearchText] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://10.0.2.2/lms/api/books/getallbooks')
            .then((response) => response.json())
            .then((data) => {
                setBooks(data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load books.');
                setLoading(false);
            });
    }, []);

    console.log(books);

    const filteredBooks = books.filter(
        (book) =>
            book.book_title.toLowerCase().includes(searchText.toLowerCase()));

    const renderBookItem = ({ item }) => (
        <TouchableOpacity
            style={styles.bookCard}
            onPress={() => navigation.navigate('booksimple', { item })}
        >
            <Image
                source={{ uri: `http://10.0.2.2/lms/bookimages/${item?.image}` }}
                style={{ height: 200, width: '100%' }}
            />
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookIsbn}>ISBN: {item.isbn}</Text>
            <Text style={styles.bookIsbn}>Book Title: {item.book_title}</Text>
            <Text style={styles.bookIsbn}>Price: {item.price}</Text>
            <Text style={styles.bookIsbn}>Quantity: {item.quantity}</Text>
            <Text style={styles.bookIsbn}>Publish Date: {item.publish_date.split('T')[0]}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search books..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#888"
                />
            </View>

            <FlatList
                data={filteredBooks}
                renderItem={renderBookItem}
                keyExtractor={(item) => item.book_id.toString()}
                contentContainerStyle={styles.bookList}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No books found</Text>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    searchInput: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    bookList: {
        padding: 16,
    },
    bookCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    bookIsbn: {
        fontSize: 14,
        color: '#888',
        fontFamily: 'monospace',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 32,
    },
});

export default BookList;
