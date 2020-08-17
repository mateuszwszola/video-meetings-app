import * as firebase from 'firebase/app';

import 'firebase/auth';

import config from './firebaseConfig';

const firebaseConfig = { ...config };

firebase.initializeApp(firebaseConfig);

export default firebase;
