package com.example.medireminder

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.tabs.TabItem
import com.google.android.material.tabs.TabLayout

class PatientProfileActivity : AppCompatActivity() {
    private lateinit var userInfo: UserInfo
    private lateinit var authService: AuthService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_patient_profile)

        findViewById<Button>(R.id.btnLogout).setOnClickListener {
            logout()
        }
        val tabLayout: TabLayout = findViewById(R.id.tabLayout)
        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                when (tab?.position) {
                    2 -> showNotifications()
                }
            }

            override fun onTabUnselected(tab: TabLayout.Tab?) {}
            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })

        authService = AuthService(this)
        userInfo = authService.getCurrentUser() ?: throw IllegalStateException("User info is required")
    }

    private fun showNotifications() {
        val intent = Intent(this, NotificationsActivity::class.java)
        startActivity(intent)
    }

    private fun logout() {
        AuthService(this).logout()
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}