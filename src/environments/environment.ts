export const environment = {
    appVersion: require('../../package.json').version,
    production: false,
    captcha: false, // change true in environment.prod for final production relese
    baseUrl: 'http://localhost:8080/',
    releaseVersion: '1.0.0', // Need to update always from here
    buildVersion: "9.1.0"
};
