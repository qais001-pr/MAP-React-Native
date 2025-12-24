/* eslint-disable comma-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-quotes */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eol-last */
/* eslint-disable semi */
import { ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FlatList, Text, TextInput } from 'react-native-gesture-handler'

export default function ReturnBook() {
    const [st, setstudent] = useState()
    const [student, setstudents] = useState([])
    const [books, setBooks] = useState([])
    const [book, setBook] = useState([])
    const [name, setname] = useState('')
    let fetchStudents = async () => {
        const response = await fetch('http://10.0.2.2/lms/api/student/getallstudents', { method: 'GET' })
        if (response.ok) {
            const result = await response.json()
            setstudents(result)
        }
    }
    useEffect(() => {
        fetchStudents()
    }, [])

    let fetchBooks = async () => {
        const response = await fetch(`http://10.0.2.2/lms/api/books/getBooksByusingStudentID?studentid=${st?.user_id}`, { method: 'GET' })
        if (response.ok) {
            const result = await response.json()
            setBooks(result)
        }
    }
    useEffect(() => {
        fetchBooks()
    }, [st])
    console.log(books)
    const filteredStudent = student.filter((student) => student.full_name.toLowerCase().includes(name.toLowerCase()))


    let returnBook = async () => {
        const data = {
            userid: st.user_id,
            bookid: book.bookid,
        }
        console.log(data)
        const response = await fetch('http://10.0.2.2/lms/api/books/returnBook', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            ToastAndroid.show('Book Returned Successfully')
            setname('')
            setBook('')
        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View>
                <Text style={{ padding: 10, fontSize: 20, fontWeight: '900' }}>Select Student</Text>
            </View>
            <View>
                <TextInput
                    placeholder='Enter Student Name'
                    style={{ padding: 10, borderRadius: 10, borderColor: 'black', borderWidth: 2, margin: 9 }}
                    value={name}
                    onChangeText={setname} />
            </View>
            <View>
                <FlatList
                    data={filteredStudent}
                    renderItem={({ item }) => {
                        if (name) {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        setstudent(item)
                                        setname('')
                                    }}
                                    style={{ padding: 10 }}>
                                    <Text style={{ padding: 10, backgroundColor: '#4b10d4ff', color: 'white' }}>{item?.full_name}({item?.arid_no})</Text>
                                </TouchableOpacity>
                            )
                        }
                    }}
                />
            </View>
            {
                st &&
                <View>
                    <Text style={{ fontSize: 20, padding: 10, fontWeight: '900' }}>
                        Selected Student {st.arid_no} {st.full_name}
                    </Text>
                </View>
            }
            {
                book &&
                <View style={{ padding: 10, backgroundColor: '#dddd' }}>
                    <Text style={{ color: 'black', fontSize: 18 }}>
                        {book?.isbn} {book?.bookname}
                    </Text>
                    <Text style={{ color: 'black', fontSize: 18 }}>
                        Issued Date:  {book?.issuedate || ''}
                    </Text>
                    <Text style={{ color: 'black', fontSize: 18 }}>
                        Return Date:  {book?.returndate || ''}
                    </Text>
                </View>
            }
            {
                books &&
                <View>
                    <Text style={{
                        color: 'black', fontSize: 20, padding: 10,
                    }}>
                        Select Book
                    </Text>
                    <FlatList
                        data={books}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => setBook(item)}
                                    style={{
                                        backgroundColor: '#055bc5ff',
                                        padding: 10,
                                    }}>
                                    <Text style={{ color: 'white', fontSize: 18 }}>
                                        {item?.isbn} {item?.bookname}
                                    </Text>
                                    <Text style={{ color: 'white', fontSize: 18 }}>
                                        Issued Date:  {item?.issuedate.split('T')[0]}
                                    </Text>
                                    <Text style={{ color: 'white', fontSize: 18 }}>
                                        Return Date:  {item?.returndate.split('T')[0]}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>}
            {
                (st && book) &&
                <TouchableOpacity
                    onPress={returnBook}
                    style={{
                        margin: 10,
                        borderRadius: 10,
                        padding: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#0449dcdd',
                    }}>
                    <Text style={{ color: 'white', fontSize: 18 }}> Return Book </Text>
                </TouchableOpacity>
            }
        </View >
    )
}