// @ts-ignore
const { writeFile } = require('fs');
// @ts-ignore
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
// @ts-ignore
const environment = argv.environment;
const isProduction = environment === 'prod';
// @ts-ignore
const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.dev.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
  production: ${ isProduction },
  APP_NAME: "${ process.env['APP_NAME'] }",
  APP_VERSION: "${ process.env['APP_VERSION'] }",
};
`;
//
// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err: Error) => {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${ targetPath }`);
});
