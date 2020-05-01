
import {NativeModules} from 'react-native';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';


// Mock the ImagePickerManager native module to allow us to unit test the JavaScript code
NativeModules.ImagePickerManager = {
  showImagePicker: jest.fn(),
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
};



NativeModules.RNGestureHandlerModule = {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    forceTouchAvailable: jest.fn(),
    State: {},
    Directions: {}
  };
  
  NativeModules.PlatformConstants = {
    forceTouchAvailable: false,
  };

  NativeModules.RNCGeolocation ={
    addListener: jest.fn(),
    getCurrentPosition: jest.fn(),
    removeListeners: jest.fn(),
    requestAuthorization: jest.fn(),
    setConfiguration: jest.fn(),
    startObserving: jest.fn(),
    stopObserving: jest.fn()
  
  };
  
  NativeModules.UIManager = {
    RCTView: () => ({
      directEventTypes: {},
    }),
  };

// Reset the mocks before each test

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);


jest.mock( 'react-native/Libraries/Utilities/NativePlatformConstantsIOS', () => ({ ...require.requireActual( 'react-native/Libraries/Utilities/NativePlatformConstantsIOS', ), getConstants: () => ({ forceTouchAvailable: false, interfaceIdiom: 'en', isTesting: false, osVersion: 'ios', reactNativeVersion: { major: 60, minor: 1, patch: 0, }, systemName: 'ios', }), }), )