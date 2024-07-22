import { currentDate } from "../../../../helpers"

export class POSTValues {
  patientId: number = 0
  medicineId: number = 0
  smartDeviceId: number = 0
  medicationStartDate: string = currentDate()
  dosesPerDay: number = 0
  medicationIntervalMinutes: number = 0
  everyNDay: number = 0
  daysLeft: number = 0
}
