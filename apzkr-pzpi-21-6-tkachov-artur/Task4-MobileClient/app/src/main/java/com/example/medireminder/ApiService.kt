package com.example.medireminder

import android.content.Context
import android.content.SharedPreferences
import com.auth0.android.jwt.JWT
import okhttp3.*
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


class AuthService(context: Context) {
    private val BASE_URL = "https://8jqhq5mq-7027.euw.devtunnels.ms/api/"
    private val apiService: ApiServiceInterface
    private val sharedPreferences: SharedPreferences

    init {
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)

        val client = OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(client)
            .build()

        apiService = retrofit.create(ApiServiceInterface::class.java)
        sharedPreferences = context.getSharedPreferences("AuthPrefs", Context.MODE_PRIVATE)
    }

    fun getCurrentUser(): UserInfo? {
        val token = getAuthToken() ?: return null
        val jwt = JWT(token)
        return UserInfo(
            id = jwt.getClaim("nameid").asString() ?: "",
            name = jwt.getClaim("name").asString() ?: "",
            email = jwt.getClaim("email").asString() ?: "",
            role = jwt.getClaim("role").asString() ?: ""
        )
    }

    fun login(email: String, password: String, callback: (Result<UserInfo>) -> Unit) {
        val loginRequest = LoginRequest(email, password)
        apiService.login(loginRequest).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful) {
                    val loginResponse = response.body()
                    loginResponse?.let {
                        saveAuthToken(it.token)
                        val userInfo = getCurrentUser()
                        userInfo?.let { user ->
                            callback(Result.success(user))
                        } ?: callback(Result.failure(Exception("Failed to parse user info")))
                    }
                } else {
                    callback(Result.failure(Exception("Login failed")))
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                callback(Result.failure(t))
            }
        })
    }

    fun registerPatient(registerRequest: RegisterRequestPatient, callback: (Result<RegisterResponse>) -> Unit) {
        apiService.registerPatient(registerRequest).enqueue(object : retrofit2.Callback<RegisterResponse> {
            override fun onResponse(call: Call<RegisterResponse>, response: retrofit2.Response<RegisterResponse>) {
                if (response.isSuccessful) {
                    val registerResponse = response.body()
                    registerResponse?.let {
                        callback(Result.success(it))
                    }
                } else {
                    callback(Result.failure(Exception("Registration failed")))
                }
            }

            override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                callback(Result.failure(t))
            }
        })
    }

    fun getNotifications(callback: (Result<List<Notification>>) -> Unit) {
        var types : Map<Int, String> = mapOf(1 to "Skipped Dose", 2 to "Dose Reminder", 3 to "Few Medicines Left");

        val patientId = "87e4fc8c-ffd2-4008-afcb-16e08e373d63"
        apiService.getNotifications(patientId).enqueue(object : Callback<List<ApiNotification>> {
            override fun onResponse(call: Call<List<ApiNotification>>, response: Response<List<ApiNotification>>) {
                if (response.isSuccessful) {
                    val apiNotifications = response.body()
                    apiNotifications?.let {
                        val notifications = it.map { apiNotification ->
                            Notification(
                                id = apiNotification.messageId,
                                title = types.get(apiNotification.messageTypeId)!!, // або інший відповідний заголовок, якщо є
                                content = apiNotification.text,
                                date = apiNotification.createdAt
                            )
                        }
                        callback(Result.success(notifications))
                    } ?: callback(Result.failure(Exception("No notifications found")))
                } else {
                    callback(Result.failure(Exception("Failed to fetch notifications")))
                }
            }

            override fun onFailure(call: Call<List<ApiNotification>>, t: Throwable) {
                callback(Result.failure(t))
            }
        })
    }

    fun deleteNotification(messageId: Int, callback: (Result<Unit>) -> Unit) {
        val call = apiService.deleteNotification(messageId)
        call.enqueue(object : Callback<Unit> {
            override fun onResponse(call: Call<Unit>, response: Response<Unit>) {
                if (response.isSuccessful) {
                    callback(Result.success(Unit))
                } else {
                    callback(Result.failure(Exception("Failed to delete notification")))
                }
            }

            override fun onFailure(call: Call<Unit>, t: Throwable) {
                callback(Result.failure(t))
            }
        })
    }

    fun registerTrustee(registerRequest: RegisterRequest, callback: (Result<RegisterResponse>) -> Unit) {
        apiService.registerTrustee(registerRequest).enqueue(object : retrofit2.Callback<RegisterResponse> {
            override fun onResponse(call: Call<RegisterResponse>, response: retrofit2.Response<RegisterResponse>) {
                if (response.isSuccessful) {
                    val registerResponse = response.body()
                    registerResponse?.let {
                        callback(Result.success(it))
                    }
                } else {
                    callback(Result.failure(Exception("Registration failed")))
                }
            }

            override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                callback(Result.failure(t))
            }
        })
    }

    fun registerDoctor(registerRequest: RegisterRequest, callback: (Result<RegisterResponse>) -> Unit) {
        apiService.registerDoctor(registerRequest).enqueue(object : retrofit2.Callback<RegisterResponse> {
            override fun onResponse(call: Call<RegisterResponse>, response: retrofit2.Response<RegisterResponse>) {
                if (response.isSuccessful) {
                    val registerResponse = response.body()
                    registerResponse?.let {
                        callback(Result.success(it))
                    }
                } else {
                    callback(Result.failure(Exception("Registration failed")))
                }
            }

            override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                callback(Result.failure(t))
            }
        })
    }

    fun logout() {
        clearAuthToken()
    }

    fun isLoggedIn(): Boolean {
        return getAuthToken() != null
    }

    private fun saveAuthToken(token: String) {
        sharedPreferences.edit().putString("auth_token", token).apply()
    }

    private fun getAuthToken(): String? {
        return sharedPreferences.getString("auth_token", null)
    }

    private fun clearAuthToken() {
        sharedPreferences.edit().remove("auth_token").apply()
    }
}