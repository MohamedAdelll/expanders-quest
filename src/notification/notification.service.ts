import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  sendMatchEmail(vendorEmail: string, projectId: number, score: number) {
    // Mock email sending
    console.log(
      `📧 Email sent to ${vendorEmail}: You were matched with project ${projectId} (score: ${score})`,
    );
  }
}
