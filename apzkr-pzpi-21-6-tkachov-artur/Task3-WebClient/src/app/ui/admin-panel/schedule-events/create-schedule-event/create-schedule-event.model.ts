import { currentDate } from "../../../../helpers"

export class POSTValues {
  medicalScheduleId: number = 0
  medicationTime: string = currentDate()
  missedDose: boolean = false
}
