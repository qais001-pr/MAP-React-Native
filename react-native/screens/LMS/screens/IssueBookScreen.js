/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
/* eslint-disable handle-callback-err */
/* eslint-disable comma-dangle */
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const IssueBookScreen = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [issueDate, setIssueDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)); // 14 days from now

    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');
    const [bookSearch, setBookSearch] = useState('');

    const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
    const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);

    const [students, setStudents] = useState([]);
    const [books, setBooks] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingBooks, setLoadingBooks] = useState(true);

    useEffect(() => {
        fetch('http://10.0.2.2/lms/api/student/getallstudents')
            .then(res => res.json())
            .then(data => setStudents(data))
            .catch(err => Alert.alert('Error', 'Failed to fetch students'))
            .finally(() => setLoadingStudents(false));
    }, []);
    useEffect(() => {
        fetch('http://10.0.2.2/lms/api/books/getallbooks')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => Alert.alert('Error', 'Failed to fetch books'))
            .finally(() => setLoadingBooks(false));
    }, []);
    console.log(students);

    const filteredStudents = students.filter(student =>
        student.full_name.toLowerCase().includes(studentSearch.toLowerCase()));

    const filteredBooks = books.filter(book =>
        book.book_title.toLowerCase().includes(bookSearch.toLowerCase())
    );

    const onIssueDateChange = (event, selectedDate) => {
        setShowIssueDatePicker(Platform.OS === 'ios');
        if (selectedDate) setIssueDate(selectedDate);
    };

    const onReturnDateChange = (event, selectedDate) => {
        setShowReturnDatePicker(Platform.OS === 'ios');
        if (selectedDate) setReturnDate(selectedDate);
    };

    const handleIssueBook = async () => {
        if (!selectedStudent || !selectedBook) {
            Alert.alert('Validation', 'Please select both student and book');
            return;
        }

        const issueData = {
            userid: selectedStudent.user_id,
            bookid: selectedBook.book_id,
            issuedate: issueDate.toISOString().split('T')[0],
            returndate: returnDate.toISOString().split('T')[0],
            status: 'issued',
            Fine: 0,
        };
        console.log(issueData);
        await fetch('http://10.0.2.2/lms/api/books/issuedBook',  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueData)
        })
            .then(res => res.json())
            .then(resData => {
                Alert.alert('Success', `Book "${selectedBook.title}" issued to ${selectedStudent.name}`);
                setSelectedStudent(null);
                setSelectedBook(null);
            })
            .catch(err => Alert.alert('Error', 'Failed to issue book'));
    };

    const formatDate = (date) =>
        date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    const renderStudentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                setSelectedStudent(item);
                setShowStudentModal(false);
                setStudentSearch('');
            }}
        >
            <Text style={styles.modalItemText}>{item.full_name} ({item.arid_no})</Text>
        </TouchableOpacity>
    );

    const renderBookItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                setSelectedBook(item);
                setShowBookModal(false);
                setBookSearch('');
            }}
        >
            <Text style={styles.modalItemText}>{item.book_title} ({item.isbn})</Text>
        </TouchableOpacity>
    );

    if (loadingStudents || loadingBooks) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.headerTitle}>Issue Book Screen</Text>

                {/* Student Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Student</Text>
                    <TouchableOpacity
                        style={styles.selectionButton}
                        onPress={() => setShowStudentModal(true)}
                    >
                        <Text style={selectedStudent ? styles.selectedText : styles.placeholderText}>
                            {selectedStudent ? `${selectedStudent.full_name} (${selectedStudent.arid_no})` : 'Tap to select student...'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Book Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Book</Text>
                    <TouchableOpacity
                        style={styles.selectionButton}
                        onPress={() => setShowBookModal(true)}
                    >
                        <Text style={selectedBook ? styles.selectedText : styles.placeholderText}>
                            {selectedBook ? `${selectedBook.book_title} (${selectedBook.isbn})` : 'Tap to select book...'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Issue Date */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Issue Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowIssueDatePicker(true)}
                    >
                        <Text style={styles.dateText}>{formatDate(issueDate)}</Text>
                    </TouchableOpacity>
                    {showIssueDatePicker && (
                        <DateTimePicker
                            value={issueDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onIssueDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                </View>

                {/* Return Date */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Return Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowReturnDatePicker(true)}
                    >
                        <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
                    </TouchableOpacity>
                    {showReturnDatePicker && (
                        <DateTimePicker
                            value={returnDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onReturnDateChange}
                            minimumDate={issueDate}
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.issueButton, (!selectedStudent || !selectedBook) && styles.disabledButton]}
                    onPress={handleIssueBook}
                    disabled={!selectedStudent || !selectedBook}
                >
                    <Text style={styles.issueButtonText}>Issue Book</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modals */}
            <Modal visible={showStudentModal} animationType="none" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.modalSearchInput}
                            placeholder="Search student..."
                            value={studentSearch}
                            onChangeText={setStudentSearch}
                            autoFocus
                        />
                        <FlatList
                            data={filteredStudents}
                            renderItem={renderStudentItem}
                            keyExtractor={(item) => item.user_id.toString()}
                        />
                        <TouchableOpacity onPress={() => setShowStudentModal(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={showBookModal} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.modalSearchInput}
                            placeholder="Search book..."
                            value={bookSearch}
                            onChangeText={setBookSearch}
                            autoFocus
                        />
                        <FlatList
                            data={filteredBooks}
                            renderItem={renderBookItem}
                            keyExtractor={(item) => item.book_id.toString()}
                        />
                        <TouchableOpacity onPress={() => setShowBookModal(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Keep the same styles from your original component
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollView: { flex: 1, padding: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 30, textAlign: 'center' },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 20, fontWeight: '600', color: '#34495e', marginBottom: 5 },
    selectionButton: { backgroundColor: '#fff', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#dfe6e9' },
    placeholderText: { fontSize: 16, color: '#bdc3c7', fontStyle: 'italic' },
    selectedText: { fontSize: 16, color: '#2c3e50', fontWeight: '500' },
    dateButton: { backgroundColor: '#fff', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#dfe6e9' },
    dateText: { fontSize: 16, color: '#2c3e50' },
    issueButton: { backgroundColor: '#3498db', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 20, marginBottom: 30 },
    disabledButton: { backgroundColor: '#bdc3c7' },
    issueButtonText: { fontSize: 18, fontWeight: '600', color: '#fff' },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', paddingBottom: 20 },
    modalSearchInput: { backgroundColor: '#f5f7fa', borderRadius: 8, padding: 12, fontSize: 16, color: '#2c3e50', margin: 10 },
    modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
    modalItemText: { fontSize: 16, color: '#34495e' },
    modalCloseButton: { padding: 18, alignItems: 'center' },
    modalCloseButtonText: { fontSize: 16, color: '#e74c3c', fontWeight: '500' }
});

export default IssueBookScreen;
