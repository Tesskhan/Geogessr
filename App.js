import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/Welcome';
import ResultScreen from './screens/ResultScreen';
import Map from './screens/Map';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
                <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
