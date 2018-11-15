const environments = {};

//default environment is staging

environments.staging = {
    'port': 3000,
    'envName': 'staging'
};

environments.production = {
    'port': 5000,
    'envName': 'production'
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ?
process.env.NODE_ENV.toLowerCase() : '';

var environmentToExport;
if(environments[currentEnvironment]){
    environmentToExport = environments[currentEnvironment];
} else {
    environmentToExport = environments.staging;
}

module.exports = environmentToExport;