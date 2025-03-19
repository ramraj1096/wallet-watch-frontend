const API_BASE_URL = "https://wallet-watch-backend-b5uz.onrender.com";

export const sendOtpApi = `${API_BASE_URL}/api/otp/sendOTP`;
export const verifyOtpApi = `${API_BASE_URL}/api/otp/verifyOtp`;
export const registerApi = `${API_BASE_URL}/api/user/register`;

export const loginApi = `${API_BASE_URL}/api/user/login`;

export const resetPasswordApi = `${API_BASE_URL}/api/user/resetPassword`;

export const createTransactionApi = `${API_BASE_URL}/api/transaction/create`;
export const getTransactionsApi = `${API_BASE_URL}/api/transaction/getAllTransaction`;
export const updateTransactionApi = `${API_BASE_URL}/api/transaction/updateById`;
export const deleteTransactionApi = `${API_BASE_URL}/api/transaction/deleteById`;
export const getAllTransactionByUserIdApi = `${API_BASE_URL}/api/transaction/getAllTransactionByUserId`;
