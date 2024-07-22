package com.example.medireminder

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val token: String, val userId: String)

data class UserInfo(
    val id: String,
    val name: String,
    val email: String,
    val role: String
)

data class RegisterRequest (
    val userName: String,
    val firstName: String?,
    val lastName: String?,
    val middleName: String?,
    val email: String,
    val password: String,
    val phoneNumber: String
)

data class RegisterRequestPatient (
    val userName: String,
    val firstName: String?,
    val lastName: String?,
    val middleName: String?,
    val email: String,
    val password: String,
    val confirmPassword: String,
    val phoneNumber: String,
    val gender: String,
    val address: String,
    val age: Int
)
data class RegisterResponse(val message: String)