package com.example.medireminder

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class LoginActivity : AppCompatActivity() {

    private lateinit var authService: AuthService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        authService = AuthService(this)

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)

        val btnLoginHeader = findViewById<Button>(R.id.btnLoginHeader)
        val btnRegister = findViewById<Button>(R.id.btnRegisterHeader)
        val medireminderText = findViewById<TextView>(R.id.medireminderText)

        btnLoginHeader.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
        btnRegister.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
        medireminderText.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        btnLogin.setOnClickListener {
            val email = etEmail.text.toString()
            val password = etPassword.text.toString()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                authService.login(email, password) { result ->
                    result.onSuccess { _ ->
                        Toast.makeText(this, "Успішний вхід", Toast.LENGTH_SHORT).show()
                        val intent = Intent(this, PatientProfileActivity::class.java);
                        startActivity(intent)
                        finish()
                    }.onFailure { error ->
                        Toast.makeText(this, "Помилка входу: ${error.message}", Toast.LENGTH_SHORT).show()
                    }
                }
                Toast.makeText(this, "Виконується вхід...", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Будь ласка, заповніть всі поля", Toast.LENGTH_SHORT).show()
            }
        }
    }
}