/**
 * Files in the tools folder are not meant to be included into the
 * website directly as they contain ancillary code used by Node.
 */

export const NODE_ENV = 'NODE_ENV';
export const NODE_DEV = 'development';
export const NODE_PROD = 'production';

const isArgSet = (value) => {
  const count = process.argv ? process.argv.length : 0;
  let result = false;

  // skip through the first two indexes since they don't contain extra arguments
  for (let index = 2; index < count; index++) {
    let argument = process.argv[index].trim().toLowerCase();
    if (argument === value) { result = true; break; }
  }

  return result;
};

const isEnvSetToValue = (variable, value) => {
  // we can't use the process.env.MY_VAR syntax for this, also keep
  // in mind environment variables are always stored as a string
  return (process.env && (process.env[variable] === value.toString())) ? true : false;
};

// development mode is the default, so anything not set to production is considered true
export function isDevMode() {
  return !isProdMode();
}

// we can set production mode via the command line or environment variables
export function isProdMode() {
  // the command line argument will take priority over the environment variable
  return isArgSet(NODE_PROD) || isEnvSetToValue(NODE_ENV, NODE_PROD);
}
