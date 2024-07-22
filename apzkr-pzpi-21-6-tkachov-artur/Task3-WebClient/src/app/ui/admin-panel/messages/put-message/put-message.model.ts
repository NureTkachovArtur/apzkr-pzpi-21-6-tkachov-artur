import { currentDate } from "../../../../helpers"

export class PUTValues {
  messageId: number = 0
  messageTypeId: number = 0
  patientId: number = 0
  receiverId: string = ''
  text: string = ''
  createdAt: string = currentDate()
  isReceived: boolean = false
  isRead: boolean = false
}
