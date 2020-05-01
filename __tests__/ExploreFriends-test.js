/**
 * @format
 */

import 'react-native';
import React from 'react';
import ExploreFriends from '../components/ExploreFriends';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<ExploreFriends />);
});
