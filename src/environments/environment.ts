import { defaultConfig } from './common/default-config';
import { firebaseConfig } from './common/firebase-config';

export const environment = {
  ...defaultConfig,
  production: false,
  firebase: firebaseConfig,
};
