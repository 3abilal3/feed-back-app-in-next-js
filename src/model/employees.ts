import mongoose, { Schema, Document } from 'mongoose';

export interface Task extends Document {
  title: string;
  description: string;
  deadline: Date;
  status: string;
}

const TaskSchema: Schema<Task> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
});

export interface Employee extends Document {
  name: string;
  email: string;
  position: string;
  department: string;
  isPermanent: boolean;
  joiningDate: Date;
  tasks: Task[];
}

const EmployeeSchema: Schema<Employee> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
  },
  isPermanent: {
    type: Boolean,
    default: false,
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
  },
  tasks: [TaskSchema],
});

export const EmployeeModel =
  (mongoose.models.Employee as mongoose.Model<Employee>) ||
  mongoose.model<Employee>('Employee', EmployeeSchema);

export default mongoose.model<Task>('Task', TaskSchema);
