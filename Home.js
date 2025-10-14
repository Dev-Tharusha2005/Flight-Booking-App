import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';

const API_KEY = '0c94f30ea3msh79ee9fbdc0e2a4bp11f9ecjsn104982bda0d3';
const API_HOST = 'sky-scrapper.p.rapidapi.com';

// Preloaded popular cities/airports to reduce API reads
const POPULAR_LOCATIONS = [
  { name: 'London Heathrow', code: 'LHR', type: 'AIRPORT', entityId: '123' },
  { name: 'New York JFK', code: 'JFK', type: 'AIRPORT', entityId: '456' },
  { name: 'Dubai DXB', code: 'DXB', type: 'AIRPORT', entityId: '789' },
  { name: 'Paris CDG', code: 'CDG', type: 'AIRPORT', entityId: '101' },
  { name: 'Singapore Changi', code: 'SIN', type: 'AIRPORT', entityId: '102' },
  { name: 'Tokyo Narita', code: 'NRT', type: 'AIRPORT', entityId: '103' },
];

const Home = ({ navigation }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [flightClass, setFlightClass] = useState('Economy');
  const [passengers, setPassengers] = useState('1');

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [fromSkyId, setFromSkyId] = useState('');
  const [toSkyId, setToSkyId] = useState('');
  const [fromEntityId, setFromEntityId] = useState('');
  const [toEntityId, setToEntityId] = useState('');

  const cache = useRef({});
  const debounceTimeout = useRef(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setDepartDate(date);
    hideDatePicker();
  };

  const handleSearch = (text, type) => {
    if (!text) {
      type === 'from' ? setFromSuggestions([]) : setToSuggestions([]);
      return;
    }

    const popularMatches = POPULAR_LOCATIONS.filter((loc) =>
      loc.name.toLowerCase().includes(text.toLowerCase())
    );
    if (popularMatches.length > 0) {
      type === 'from' ? setFromSuggestions(popularMatches) : setToSuggestions(popularMatches);
    }

    if (cache.current[text]) {
      type === 'from'
        ? setFromSuggestions(cache.current[text])
        : setToSuggestions(cache.current[text]);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://${API_HOST}/api/v1/flights/searchAirport?query=${encodeURIComponent(
            text
          )}&locale=en-US`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': API_HOST,
            },
          }
        );
        const result = await response.json();

        if (!result?.data) {
          console.warn('No data received from airport search API.');
          type === 'from' ? setFromSuggestions([]) : setToSuggestions([]);
          return;
        }

        const dataArray = Array.isArray(result.data)
          ? result.data
          : Object.values(result.data || {});

        const suggestions = dataArray.map((item) => ({
          name: item.presentation?.title || item.localizedName || '',
          type: item.navigation?.entityType || 'AIRPORT',
          code: item.relevantFlightParams?.skyId || '',
          entityId: item.navigation?.entityId || '',
          country:
            item.presentation?.subtitle ||
            item.navigation?.localizedName ||
            '',
        }));

        const uniqueSuggestions = Array.from(
          new Map(suggestions.map((i) => [i.code, i])).values()
        );

        cache.current[text] = uniqueSuggestions;
        type === 'from'
          ? setFromSuggestions(uniqueSuggestions)
          : setToSuggestions(uniqueSuggestions);
      } catch (err) {
        console.error('Error fetching airport suggestions:', err);
        type === 'from' ? setFromSuggestions([]) : setToSuggestions([]);
      }
    }, 400);
  };

  const handleSelect = (item, type) => {
    const value =
      item.type === 'CITY'
        ? `${item.name}, ${item.country}`
        : `${item.name} (${item.code})`;

    if (type === 'from') {
      setFrom(value);
      setFromSkyId(item.code);
      setFromEntityId(item.entityId);
      setFromSuggestions([]);
    } else {
      setTo(value);
      setToSkyId(item.code);
      setToEntityId(item.entityId);
      setToSuggestions([]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Book Your Flight</Text>
        <View style={styles.subContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.label}>From</Text>
            <TextInput
              style={styles.input}
              placeholder="Departure City or Airport"
              placeholderTextColor="#888"
              value={from}
              onChangeText={(text) => {
                setFrom(text);
                handleSearch(text, 'from');
              }}
            />
            {fromSuggestions.length > 0 && (
              <ScrollView style={styles.suggestionBox}>
                {fromSuggestions.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleSelect(item, 'from')}
                    style={styles.suggestionItem}
                  >
                    <Text>
                      {item.name}
                      {item.type === 'CITY'
                        ? ', ' + item.country
                        : ' (' + item.code + ')'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text style={styles.label}>To</Text>
            <TextInput
              style={styles.input}
              placeholder="Arrival City or Airport"
              placeholderTextColor="#888"
              value={to}
              onChangeText={(text) => {
                setTo(text);
                handleSearch(text, 'to');
              }}
            />
            {toSuggestions.length > 0 && (
              <ScrollView style={styles.suggestionBox}>
                {toSuggestions.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleSelect(item, 'to')}
                    style={styles.suggestionItem}
                  >
                    <Text>
                      {item.name}
                      {item.type === 'CITY'
                        ? ', ' + item.country
                        : ' (' + item.code + ')'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text style={styles.label}>Departure Date</Text>
            <TouchableOpacity style={styles.input} onPress={showDatePicker}>
              <Text style={{ color: departDate ? '#000' : '#888' }}>
                {departDate ? departDate.toDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Class</Text>
                <View style={styles.smallInput}>
                  <Picker selectedValue={flightClass} onValueChange={setFlightClass}>
                    <Picker.Item label="Economy" value="Economy" />
                    <Picker.Item label="Business" value="Business" />
                    <Picker.Item label="First Class" value="First" />
                  </Picker>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Passengers</Text>
                <View style={styles.smallInput}>
                  <Picker selectedValue={passengers} onValueChange={setPassengers}>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                  </Picker>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('SearchResults', {
                  originSkyId: fromSkyId,
                  originEntityId: fromEntityId,
                  destinationSkyId: toSkyId,
                  destinationEntityId: toEntityId,
                  departDate: departDate ? departDate.toISOString().split('T')[0] : '',
                  flightClass,
                  passengers,
                })
              }
            >
              <Text style={styles.buttonText}>Search Flights</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001B4B', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  headerText: { fontSize: 35, fontWeight: 'bold', color: '#BAD0E3', marginBottom: 50, textAlign: 'center' },
  subContainer: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 20, paddingVertical: 20, paddingHorizontal: 15, alignSelf: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  scrollContent: { alignItems: 'center' },
  input: { width: '100%', height: 55, backgroundColor: '#f2f2f2', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12, fontSize: 15, justifyContent: 'center' },
  smallInput: { height: 55, backgroundColor: '#f2f2f2', borderRadius: 12, justifyContent: 'center' },
  label: { width: '100%', fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: '#001B4B', textAlign: 'left' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, width: '100%' },
  button: { backgroundColor: '#001B4B', paddingVertical: 20, borderRadius: 12, alignItems: 'center', width: '100%', marginTop: 10 },
  buttonText: { color: '#BAD0E3', fontSize: 16, fontWeight: 'bold' },
  suggestionBox: { width: '100%', maxHeight: 150, backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

export default Home;
