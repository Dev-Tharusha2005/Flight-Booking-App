# Flight Booking App (React Native)

A **React Native mobile application** for booking flights, with user authentication and flight search powered by the **Sky Scrapper API** via RapidAPI. Users can sign up, sign in, search for flights, and view flight results.

---

## Features

- **User Authentication**
  - Sign Up with first name, last name, email, and password.
  - Sign In to access flight booking features.
  - Persistent login using AsyncStorage.

- **Flight Search**
  - Search for flights by departure and arrival airports or cities.
  - Auto-suggestions for popular airports/cities.
  - Select departure date, class (Economy, Business, First), and number of passengers.
  - View search results with airline, departure/arrival times, duration, and price.

- **Booking Interface**
  - Display flight details in a clean card layout.
  - Option to “Book Now” (UI only, no payment integration yet).

---

## Screens
<img width="1280" height="720" alt="Hi," src="https://github.com/user-attachments/assets/fd7bdb46-2878-4feb-bb85-e8a43c7b3a93" />


1. **Welcome Screen**  
   Landing page with app logo and "Get Started" button.

2. **Sign Up Screen**  
   Allows new users to create an account.

3. **Sign In Screen**  
   Allows existing users to log in.

4. **Home Screen**  
   Flight search form with auto-suggestions, date picker, flight class, and passenger selection.

5. **Search Results Screen**  
   Displays flight options fetched from Sky Scrapper API.

---

## Tech Stack

- **Frontend:** React Native with Expo
- **Navigation:** React Navigation (Stack Navigator)
- **Storage:** AsyncStorage for persistent login
- **API:** Sky Scrapper API via RapidAPI
- **UI Components:** Picker, DateTimePickerModal, ScrollView, TouchableOpacity

