export const domainUrl = 'http://10.0.2.2:3000'

export const Api = {
    sendOtp: `${domainUrl}/user/auth/initiate`,
    validateOtp: `${domainUrl}/user/auth/verify`,
    register: `${domainUrl}/register`,
    getUserDetails: `${domainUrl}/user/profile`,
    address: `${domainUrl}/address`
}