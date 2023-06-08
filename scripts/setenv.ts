// @ts-ignore
const {writeFile} = require("fs");
// @ts-ignore
const {argv} = require("yargs");
// read environment variables from .env file
require("dotenv").config();
// read the command line arguments passed with yargs
// @ts-ignore
const environment = argv.environment;
const isProduction = environment === "prod";
// @ts-ignore
const targetPath = isProduction
  ? `./src/environments/environment.production.ts`
  : `./src/environments/environment.development.ts`;

const envVars =
  Object.fromEntries(Object.entries(process.env)
    .filter(([key]) => key.startsWith("SH_"))
    .map(([key, value]) => [
      key.replace("SH_", ""),
      ["SH_APP_DEBUG", "SH_APP_OFFLINE", "SH_APP_LOCAL"].includes(key) ? value === "1" || value === "true" : value
    ])
  );

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
import {Environment} from "./environment.interface";
export const environment: Environment = ${JSON.stringify(envVars)};
`;

//
// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err: Error) => {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
