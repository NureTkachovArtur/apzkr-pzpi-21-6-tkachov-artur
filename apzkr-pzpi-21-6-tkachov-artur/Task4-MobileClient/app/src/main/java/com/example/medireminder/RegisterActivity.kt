package com.example.medireminder

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class RegisterActivity : AppCompatActivity() {

    private lateinit var authService: AuthService
    private lateinit var spinnerUserType: Spinner
    private lateinit var layoutPatientForm: LinearLayout
    private lateinit var spinnerGender: Spinner
    private lateinit var btnRegister: Button

    private lateinit var etAddress: EditText
    private lateinit var etFirstName: EditText
    private lateinit var etAge: EditText
    private lateinit var etNickname: EditText
    private lateinit var etLastName: EditText
    private lateinit var etMiddleName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var etConfirmPassword: EditText
    private lateinit var etPhoneNumber: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        authService = AuthService(this)

        val btnLogin = findViewById<Button>(R.id.btnLoginHeader)
        val btnRegisterHeader = findViewById<Button>(R.id.btnRegisterHeader)
        val medireminderText = findViewById<TextView>(R.id.medireminderText)

        btnLogin.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
        btnRegisterHeader.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
        medireminderText.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        spinnerUserType = findViewById(R.id.spinnerUserType)
        layoutPatientForm = findViewById(R.id.layoutPatientForm)
        spinnerGender = findViewById(R.id.spinnerGender)
        btnRegister = findViewById(R.id.btnRegister)

        etAddress = findViewById(R.id.etAddress)
        etFirstName = findViewById(R.id.etFirstName)
        etAge = findViewById(R.id.etAge)
        etNickname = findViewById(R.id.etNickname)
        etLastName = findViewById(R.id.etLastName)
        etMiddleName = findViewById(R.id.etMiddleName)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        etConfirmPassword = findViewById(R.id.etConfirmPassword)
        etPhoneNumber = findViewById(R.id.etPhoneNumber)

        setupUserTypeSpinner()
        setupGenderSpinner()
        setupRegisterButton()
    }

    private fun setupUserTypeSpinner() {
        val userTypes = arrayOf("Пацієнт", "Лікар", "Довірена особа")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, userTypes)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerUserType.adapter = adapter

        spinnerUserType.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View, position: Int, id: Long) {
                when (position) {
                    0 -> layoutPatientForm.visibility = View.VISIBLE
                    else -> layoutPatientForm.visibility = View.GONE
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
    }

    private fun setupGenderSpinner() {
        val genders = arrayOf("Оберіть Вашу стать", "Чоловіча", "Жіноча")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, genders)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerGender.adapter = adapter
    }

    private fun onRegisterSuccess() {
        Toast.makeText(this, "Успішна реєстрація", Toast.LENGTH_SHORT).show()
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }

    private fun registerPatient() {
        var genderCHAR = ""
        if (spinnerGender.selectedItem.toString() == "Чоловіча") {
            genderCHAR = "m"
        } else {
            genderCHAR = "f"
        }

        val registerRequest = RegisterRequestPatient(
            userName = etNickname.text.toString(),
            firstName = etFirstName.text.toString(),
            lastName = etLastName.text.toString(),
            middleName = etMiddleName.text.toString(),
            gender = genderCHAR,
            address = etAddress.text.toString(),
            age = etAge.text.toString().toInt(),
            email = etEmail.text.toString(),
            password = etPassword.text.toString(),
            confirmPassword = etConfirmPassword.text.toString(),
            phoneNumber = etPhoneNumber.text.toString()
        )

        if ((registerRequest.email.isNotEmpty() &&
            registerRequest.password.isNotEmpty() &&
            registerRequest.userName.isNotEmpty() &&
            registerRequest.gender.isNotEmpty() &&
            registerRequest.address.isNotEmpty() &&
            registerRequest.age > 0 &&
            registerRequest.phoneNumber.isNotEmpty()) ||
            (registerRequest.password != etConfirmPassword.text.toString())) {
            authService.registerPatient(registerRequest) { result ->
                result.onSuccess { registerResponse ->
                    Toast.makeText(this, "Успішна реєстрація", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, MainActivity::class.java)
                    startActivity(intent)
                }.onFailure { error ->
                    Toast.makeText(this, "Помилка реєстрації: ${error.message}", Toast.LENGTH_SHORT).show()
                }
            }
            Toast.makeText(this, "Реєстрація...", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Будь ласка, заповніть всі поля", Toast.LENGTH_SHORT).show()
        }
    }

    private fun registerDoctor() {

    }

    private fun registerTrustee() {

    }

    private fun setupRegisterButton() {
        btnRegister.setOnClickListener {
            if (spinnerUserType.selectedItem == "Пацієнт") {
                registerPatient()
            } else if (spinnerUserType.selectedItem == "Лікар") {
                registerDoctor()
            } else if (spinnerUserType.selectedItem == "Довірена особа") {
                registerTrustee()
            }
        }
    }
}