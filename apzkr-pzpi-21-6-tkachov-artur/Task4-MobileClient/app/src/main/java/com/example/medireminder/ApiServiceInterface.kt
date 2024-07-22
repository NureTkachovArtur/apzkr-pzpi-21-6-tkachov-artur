package com.example.medireminder

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiServiceInterface {
    @POST("Accounts/login")
    fun login(@Body loginRequest: LoginRequest): Call<LoginResponse>

    @POST("Accounts/register-patient")
    fun registerPatient(@Body registerRequest: RegisterRequestPatient): Call<RegisterResponse>

    @POST("Accounts/register-doctor")
    fun registerDoctor(@Body registerRequest: RegisterRequest): Call<RegisterResponse>

    @POST("Accounts/register-trustee")
    fun registerTrustee(@Body registerRequest: RegisterRequest): Call<RegisterResponse>

    @GET("Messages/user/{patientId}")
    fun getNotifications(@Path("patientId") patientId: String): Call<List<ApiNotification>>

    @DELETE("Messages/{messageId}")
    fun deleteNotification(@Path("messageId") messageId: Int): Call<Unit>
}