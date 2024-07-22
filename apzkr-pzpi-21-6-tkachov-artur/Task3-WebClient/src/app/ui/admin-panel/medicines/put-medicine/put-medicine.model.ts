import { currentDate } from "../../../../helpers"

export class PUTValues {
  medicineId: number = 0
  name: string = ''
  description: string = ''
  dosage: number = 0
  patientId: number = 0
  expirationDate: string = currentDate()
  instruction: string = ''
  quantity: number = 0
}
