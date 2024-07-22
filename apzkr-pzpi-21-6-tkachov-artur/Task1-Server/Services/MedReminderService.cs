using medireminder.Interfaces;
using medireminder.Models;

public class MedReminderService : IHostedService, IDisposable
{
    private readonly IServiceProvider _serviceProvider;

    private Timer _timer;
    private readonly int _checkEveryNSeconds = 60;
    private readonly int _remindBeforeNMinutes = 15;
    private readonly int _tooLateNMinutes = 5;

    enum MessageTypes
    {
        SkippedDose = 1,
        Reminder = 2,
        FewMedicinesLeft = 3
    }

    public MedReminderService(IServiceProvider serviceProvider) {
        _serviceProvider = serviceProvider;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(_checkEveryNSeconds));
        return Task.CompletedTask;
    }

    private void DoWork(object state)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            IScheduleEventRepository _eventRepository = 
                scope.ServiceProvider.GetRequiredService<IScheduleEventRepository>();

            var events = _eventRepository.GetScheduleEventsOfToday();
            if (events.Count > 0)
            {
                foreach (var _event in events)
                {
                    var medTime = DateTimeToMinutes((DateTime)_event.MedicationTime);
                    var curTime = DateTimeToMinutes(DateTime.Now);

                    if (medTime - curTime == _remindBeforeNMinutes)
                    {
                        SendMessageReminder(scope, _event);
                    }
                    else if (curTime - medTime >= _tooLateNMinutes)
                    {
                        SendMessageMissedDose(scope, _event);
                    }
                }
            }
        }
    }

    private void SendMessageReminder(IServiceScope scope, ScheduleEvent _event)
    {
        IPatientRepository _patientRepository =
                scope.ServiceProvider.GetRequiredService<IPatientRepository>();
        IMedicineRepository _medicineRepository =
                scope.ServiceProvider.GetRequiredService<IMedicineRepository>();
        IMessageTypeRepository _messageTypeRepository =
                scope.ServiceProvider.GetRequiredService<IMessageTypeRepository>();
        IMessageRepository _messageRepository =
                scope.ServiceProvider.GetRequiredService<IMessageRepository>();

        var patient = _patientRepository.GetPatient(_event.MedicationSchedule.PatientId);
        var medicine = _medicineRepository.GetMedicine(_event.MedicationSchedule.MedicineId);
        var messageType = _messageTypeRepository.GetMessageType((int)MessageTypes.Reminder);

        var message = new Message
        {
            MessageId = 0,
            MessageType = messageType,
            MessageTypeId = (int)MessageTypes.Reminder,
            Patient = patient,
            PatientId = patient.PatientId,
            Receiver = patient.ApplicationUser,
            Text = $"Через 15 хвилин, Вам необхідно прийняти ліки: {medicine.Name}",
            CreatedAt = DateTime.UtcNow,
            IsReceived = false,
            IsRead = false
        };

        _messageRepository.CreateMessage(message);
    }

    private void SendMessageMissedDose(IServiceScope scope, ScheduleEvent _event)
    {
        IPatientRepository _patientRepository =
                scope.ServiceProvider.GetRequiredService<IPatientRepository>();
        IMedicineRepository _medicineRepository =
                scope.ServiceProvider.GetRequiredService<IMedicineRepository>();
        IMessageTypeRepository _messageTypeRepository =
                scope.ServiceProvider.GetRequiredService<IMessageTypeRepository>();
        IMessageRepository _messageRepository =
                scope.ServiceProvider.GetRequiredService<IMessageRepository>();
        IScheduleEventRepository _eventRepository =
                scope.ServiceProvider.GetRequiredService<IScheduleEventRepository>();

        var patient = _patientRepository.GetPatient(_event.MedicationSchedule.PatientId);
        var medicine = _medicineRepository.GetMedicine(_event.MedicationSchedule.MedicineId);
        var messageType = _messageTypeRepository.GetMessageType((int)MessageTypes.SkippedDose);
        var trustees = _patientRepository.GetTrusteesByPatient(_event.MedicationSchedule.PatientId);
        var doctors = _patientRepository.GetDoctorsByPatient(_event.MedicationSchedule.PatientId);

        var messages = new List<Message>();
        for (int i = 0; i < trustees.Count; i++)
        {
            var message = new Message
            {
                MessageId = 0,
                MessageType = messageType,
                MessageTypeId = (int)MessageTypes.SkippedDose,
                Patient = patient,
                PatientId = patient.PatientId,
                Receiver = trustees.ElementAt(i).ApplicationUser,
                Text = $"Користувач {patient.ApplicationUser.UserName} не прийняв ліки: {medicine.Name}",
                CreatedAt = DateTime.UtcNow,
                IsReceived = false,
                IsRead = false
            };
            messages.Add(message);
        }
        for (int i = 0; i < doctors.Count; i++)
        {
            var message = new Message
            {
                MessageId = 0,
                MessageType = messageType,
                MessageTypeId = (int)MessageTypes.SkippedDose,
                Patient = patient,
                PatientId = patient.PatientId,
                Receiver = doctors.ElementAt(i).ApplicationUser,
                Text = $"Пацієнт {patient.ApplicationUser.UserName} не прийняв ліки: {medicine.Name}",
                CreatedAt = DateTime.UtcNow,
                IsReceived = false,
                IsRead = false
            };
            messages.Add(message);
        }
        messages.Add(new Message
        {
            MessageId = 0,
            MessageType = messageType,
            MessageTypeId = (int)MessageTypes.SkippedDose,
            Patient = patient,
            PatientId = patient.PatientId,
            Receiver = patient.ApplicationUser,
            Text = $"Сьогодні Ви не прийняли ліки: {medicine.Name}",
            CreatedAt = DateTime.UtcNow,
            IsReceived = false,
            IsRead = false
        });

        for (int i = 0; i < messages.Count; i++)
        {
            _messageRepository.CreateMessage(messages[i]);
        }
        var oldEvent = _eventRepository.GetScheduleEvent(_event.ScheduleEventId);
        oldEvent.MissedDose = true;
        oldEvent.PastNeededTime = true;
        _eventRepository.UpdateScheduleEvent(oldEvent);
    }

    private int DateTimeToMinutes(DateTime dateTime)
    {
        return (dateTime.Hour * 60) + dateTime.Minute;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
