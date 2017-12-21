// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCB_aHreTcyaMiWIeNcjRSbC9aXTvsw6BY',
    authDomain: 'craigmyle-trucks.firebaseapp.com',
    databaseURL: 'https://craigmyle-trucks.firebaseio.com',
    projectId: 'firebase-craigmyle-trucks',
    storageBucket: 'firebase-craigmyle-trucks.appspot.com',
    messagingSenderId: '988778688785'
  },
  googleApi: {
    apiKey: 'AIzaSyATY3UAWjCc33LlP0hx2Jm5I-nSxj4_2M0'
  }

};
