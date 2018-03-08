// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAH_bFVGUVb63NoD-VrCVPP79i31ndI6S0",
    authDomain: "pick-up-and-play.firebaseapp.com",
    databaseURL: "https://pick-up-and-play.firebaseio.com",
    projectId: "pick-up-and-play",
    storageBucket: "pick-up-and-play.appspot.com",
    messagingSenderId: "905374247564"
  }
};
