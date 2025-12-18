/* eslint-disable jsx-quotes */
/* eslint-disable eol-last */
/* eslint-disable semi */
import { Button, View, Text, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'

export default function App() {
    const [name, setname] = useState('')

    const [regno, setregno] = useState('')

    const [cgpa, setcgpa] = useState(0.0)
    const [studentList, setStudentList] = useState([])
    global.URL = 'http://10.0.2.2:9000/api/Students/'

    let addStudent = async () => {
        const res = await new fetch(URL + 'addStudent', {
            method: 'POST',
            headers: { 'content-Type': 'application-json' },
            body: {
                name: name,
                regno: regno,
                cgpa: cgpa,
            },
        })
        console.log(res)
    }

    let getStudent = async () => {
        const res = await new fetch(URL + 'getAllStudents', {
            method: 'GET',
        })
        console.log(res)
        const dt = await res.json()
        console.log(dt)
        setStudentList(dt?.data || [])
    }
    return (
        <View>
            <View>
                <Text>Student Form</Text>
            </View>
            <View>
                <TextInput
                    placeholder='Enter name'
                    value={name}
                    onChangeText={setname} />
            </View>
            <View>
                <TextInput
                    placeholder='Enter Regno'
                    value={regno}
                    onChangeText={setregno} />
            </View>
            <View>
                <TextInput
                    placeholder='Enter CGPA'
                    value={cgpa}
                    onChangeText={setcgpa}
                />
            </View>
            <View>
                <Button title='Add Data' onPress={addStudent} />
            </View>
            <View>
                <Button title='Get Data' onPress={getStudent} />
            </View>
            <FlatList
                data={studentList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <Text>Data Exists</Text>
                            <Text>{item?.name || ''}</Text>
                        </View>
                    )
                }}
            />

        </View>
    )
}