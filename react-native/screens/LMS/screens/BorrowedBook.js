/* eslint-disable curly */
/* eslint-disable comma-dangle */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable semi */
import { View, Text, FlatList, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer'
import { Modal } from 'react-native-paper'

export default function BorrowedBook() {
    const [books, setbooks] = useState([])
    const [book, setbook] = useState()
    const [shown, setshown] = useState(false)
    let fetchStudents = async () => {
        const response = await fetch('http://10.0.2.2/lms/api/books/getAllIssuedBooksDetails', { method: 'GET' })
        const result = await response.json()
        console.log(result);
        setbooks(result)
    }
    useEffect(() => {
        fetchStudents()
    }, [])

    let returnBook = async () => {

        setshown(!shown)
        const data = {
            userid: book.userid,
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
            Alert.alert('Book Returned Successfully')
        }
        else
            Alert.alert('Something Went Wrong!!!')
    }
    return (
        <View style={{ flex: 1 }}>

            <FlatList
                data={books}
                keyExtractor={item => item.userid.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setshown(!shown)
                            setbook(item)
                        }}
                        style={{ padding: 10 }}>
                        <Text style={{ fontSize: 19, fontWeight: '800' }}>Student Details</Text>
                        <Text style={{ fontSize: 12 }}>Arid No{item.arid_no}</Text>
                        <Text style={{ fontSize: 12 }}>Father Name {item.father_name}</Text>
                        <Text style={{ fontSize: 12 }}>Full Name {item.full_name}</Text>
                        <Text style={{ fontSize: 12 }}>City {item.city}</Text>
                        <Text style={{ fontSize: 12 }}>Degree {item.degree}</Text>
                        <Text style={{ fontSize: 12 }}>Section {item.section}</Text>
                        <Text style={{ fontSize: 12 }}>Semester {item.semester}</Text>
                        <Text style={{ fontSize: 19, fontWeight: '800' }}>Book Details</Text>
                        <Text style={{ fontSize: 12 }}>Book Title {item.book_title}</Text>
                        <Text style={{ fontSize: 12 }}>ISBN: {item.isbn}</Text>
                        <Text style={{ fontSize: 12 }}>Issue Date {item.issuedate}</Text>
                        <Text style={{ fontSize: 12 }}>Return Date {item.returndate}</Text>
                        <Text style={{ fontSize: 12 }}>Status {item.status}</Text>
                    </TouchableOpacity>
                )}
            />


            <Modal visible={shown}>
                <View style={{

                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    margin: 20
                }}>
                    <TouchableOpacity
                        onPress={returnBook}
                        style={{
                            width: 150,
                            backgroundColor: '#046fdbff',
                            justifyContent: 'center',
                            borderRadius: 10,
                            padding: 10
                        }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: 'white' }}>
                            Return Book
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity

                        onPress={() => setshown(!shown)}
                        style={{
                            width: 150,
                            backgroundColor: '#db044fff',
                            justifyContent: 'center',
                            borderRadius: 10,
                            padding: 10
                        }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: 'black' }}>
                            Cancel
                        </Text>

                    </TouchableOpacity>
                </View>
            </Modal>
        </View>


    )
}
