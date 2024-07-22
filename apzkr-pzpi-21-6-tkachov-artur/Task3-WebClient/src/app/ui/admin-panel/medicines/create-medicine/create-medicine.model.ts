import { currentDate } from "../../../../helpers"

export class POSTValues {
  name: string = ''
  description: string = ''
  dosage: number = 0
  patientId: number = 0
  expirationDate: string = currentDate()
  instruction: string = ''
  quantity: number = 0
}
