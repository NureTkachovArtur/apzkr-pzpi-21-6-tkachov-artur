package com.example.medireminder

import android.os.Bundle
import android.view.MenuItem
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class NotificationsActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: NotificationAdapter
    private lateinit var authService: AuthService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notifications)

        setSupportActionBar(findViewById(R.id.toolbar))
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        recyclerView = findViewById(R.id.notificationsRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)

        authService = AuthService(this)
        loadNotifications()


    }

    private fun loadNotifications() {
        authService.getNotifications { result ->
            runOnUiThread {
                result.onSuccess { notifications ->
                    adapter = NotificationAdapter(notifications.toMutableList(), authService)
                    recyclerView.adapter = adapter
                }.onFailure { error ->
                    Toast.makeText(this, "Помилка завантаження повідомлень: ${error.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            finish()
            return true
        }
        return super.onOptionsItemSelected(item)
    }
}