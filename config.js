/* 
 * Create and export configuartion variables 
 *
 */

 // Container for all the environments
 let environments = {};

 // Create a Stagging (default) environment
 environments.stagging = {
    'httpPort' : 4000,
    'httpsPort' : 4001,
    'envName' : 'stagging',
 }

 // Create a Production environment
 environments.production = {
     'httpPort': 6000,
     'httpsPort': 6001,
     'envName': 'production',
 } 

 // Determine which environment was passed as a command-line argument
 let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';

 // check that the current enviroment is among environemnt set already
let enviromentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.stagging;

// Export the module
module.exports = enviromentToExport;