package com.example.medireminder

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView

class NotificationAdapter(
    private val notifications: MutableList<Notification>,
    private val authService: AuthService
) : RecyclerView.Adapter<NotificationAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val titleTextView: TextView = view.findViewById(R.id.titleTextView)
        val contentTextView: TextView = view.findViewById(R.id.contentTextView)
        val dateTextView: TextView = view.findViewById(R.id.dateTextView)
        val deleteButton: Button = view.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.notification_item, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val notification = notifications[position]
        holder.titleTextView.text = notification.title
        holder.contentTextView.text = notification.content
        holder.dateTextView.text = notification.date
        holder.deleteButton.setOnClickListener {
            authService.deleteNotification(notification.id) { result ->
                result.onSuccess {
                    notifications.removeAt(position)
                    notifyItemRemoved(position)
                }
                result.onFailure { error ->
                    Toast.makeText(holder.itemView.context, "Error deleting notification: ${error.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun getItemCount() = notifications.size
}

data class Notification(
    val id: Int,
    val title: String,
    val content: String,
    val date: String
)

data class ApiNotification(
    val messageId: Int,
    val messageTypeId: Int,
    val patientId: Int,
    val receiverId: String,
    val text: String,
    val createdAt: String,
    val isReceived: Boolean,
    val isRead: Boolean
)
