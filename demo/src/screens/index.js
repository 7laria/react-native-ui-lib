import {Navigation} from 'react-native-navigation';
import './componentScreens';
import './componentScreenScreens';
import './listScreens';
import './styleScreens';
import './animationScreens';
import MainScreen from './MainScreen';

Navigation.registerComponent('example.MainScreen', () => MainScreen);
