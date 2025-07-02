export const domainUrl = 'https://zjdndszbaj.execute-api.us-east-2.amazonaws.com/Prod/'

export const Api = {
    sendOtp: `${domainUrl}/user/auth/initiate`,
    validateOtp: `${domainUrl}/user/auth/verify`,
    register: `${domainUrl}/register`,
    getUserDetails: `${domainUrl}/user/profile`
}