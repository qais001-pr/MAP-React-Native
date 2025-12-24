/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

const BookListSimple = ({ route }) => {
    const { item } = route.params;

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.card}>
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
                </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#222',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 20,
        marginBottom: 30,
        elevation: 3,
        alignItems: 'center',
    },
    bookImage: {
        width: 150,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    row: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 13,
        color: '#888',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
});

export default BookListSimple;
