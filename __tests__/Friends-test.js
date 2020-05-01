/**
 * @format
 */

import 'react-native';
import React from 'react';
import Friends from '../components/Friends';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Friends />);
});
