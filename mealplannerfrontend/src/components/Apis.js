const BASE_URL = "https://healthybitesbackend.onrender.com";

export default {
  SIGN_UP: `${BASE_URL}/user/sign-up`,
  SIGN_IN: `${BASE_URL}/user/sign-in`,
  VERIFY_OTP: `${BASE_URL}/user/verify-otp`,
  RESEND_OTP: `${BASE_URL}/user/resend-otp`,
  RESET_PASSWORD: `${BASE_URL}/user/forgot-password`,
  SET_PREFERENCES: `${BASE_URL}/user/setPreferences`,
  LOGOUT: `${BASE_URL}/user/logout`,
  GET_PROFILE: `${BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${BASE_URL}/user/update-profile`,
  GENERATE_MEAL_PLAN: `${BASE_URL}/user/generate-meal-plan`,
}
