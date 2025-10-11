export interface IBooking {
  _id?: string;
  studentId: { name: string };
  teacherId: { name: string };
  courseId: { title: string };
  date: string;
  slot: { start: string; end: string };
  note: string;
  paymentOrderId?: string;
  status?: string;
  amount?: number;
}
