/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import StackNavigator from "./navigation/StackNavigator"

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <StackNavigator/>
  
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
