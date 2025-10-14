import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image
} from 'react-native';

const API_KEY = '0c94f30ea3msh79ee9fbdc0e2a4bp11f9ecjsn104982bda0d3';
const API_HOST = 'sky-scrapper.p.rapidapi.com';

const SearchResults = ({ route }) => {
  const {
    originSkyId,
    originEntityId,
    destinationSkyId,
    destinationEntityId,
    departDate,
    flightClass,
    passengers,
  } = route.params;

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const url = `https://${API_HOST}/api/v1/flights/searchFlights?originSkyId=${originSkyId}&destinationSkyId=${destinationSkyId}&originEntityId=${originEntityId}&destinationEntityId=${destinationEntityId}&date=${departDate}&cabinClass=${flightClass.toLowerCase()}&adults=${passengers}&sortBy=best&currency=USD&market=en-US&countryCode=US`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST,
        },
      });

      const result = await response.json();

      const itineraries = result?.data?.itineraries || [];
      const formattedFlights = itineraries.map((flight) => {
        const leg = flight.legs?.[0];
        return {
          id: flight.id,
          airlineName: leg?.carriers?.marketing?.[0]?.name || 'Unknown Airline',
          airlineLogo: leg?.carriers?.marketing?.[0]?.logoUrl || null,
          origin: leg?.origin?.displayCode || leg?.origin?.name || 'N/A',
          destination: leg?.destination?.displayCode || leg?.destination?.name || 'N/A',
          departureTime: formatTime(leg?.departure),
          arrivalTime: formatTime(leg?.arrival),
          duration: formatDuration(leg?.durationInMinutes),
          price: flight?.price?.raw ? flight.price.raw.toFixed(2) : null,
        };
      }).filter((f) => f.origin && f.destination && f.price); 

      setFlights(formattedFlights);
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '-';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const renderFlight = ({ item }) => (
    <View style={styles.flightCard}>
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.airlineLogo && (
            <Image
              source={{ uri: item.airlineLogo }}
              style={{ width: 30, height: 30, marginRight: 8 }}
            />
          )}
          <Text style={styles.airline}>{item.airlineName}</Text>
        </View>
        <Text style={styles.price}>${item.price}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.time}>{item.departureTime} → {item.arrivalTime}</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>

      <Text style={styles.route}>{item.origin} → {item.destination}</Text>

      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ED1B59" />
      </View>
    );
  }

  return (
    <FlatList
      data={flights}
      renderItem={renderFlight}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View style={styles.headerView}>
          <Text style={styles.header}>Flight Results</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.headerView}>
          <Text style={{ color: '#fff', fontSize: 18 }}>No flights found.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40, backgroundColor: '#001B4B', flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001B4B' },
  header: { fontSize: 35, fontWeight: 'bold', marginBottom: 15, color: '#fff' },
  flightCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  airline: { fontSize: 16, fontWeight: 'bold', color: '#001B4B' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#ED1B59' },
  time: { fontSize: 14, color: '#555' },
  duration: { fontSize: 14, color: '#555' },
  route: { fontSize: 14, color: '#777', marginBottom: 10 },
  bookButton: { backgroundColor: '#001B4B', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  bookText: { color: '#BAD0E3', fontWeight: 'bold', fontSize: 16 },
  headerView: { width: '100%', height: 70, justifyContent: 'center', alignItems: 'center' },
});

export default SearchResults;
