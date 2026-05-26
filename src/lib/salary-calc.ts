import { SalaryType, AttendanceStatus } from "../generated/prisma/enums";
import { getWorkingDaysInMonth, getWorkingDaysInQuarter } from "./utils";

export interface SalaryCalculationInput {
  salaryType: SalaryType;
  salaryAmount: number;
  designatedLeaves: number;
  leaveCarryover: boolean;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  halfDayDays: number;
  currentDate: Date;
}

export interface SalaryCalculationOutput {
  allowedLeavesForPeriod: number;
  usedLeaves: number;
  remainingLeaves: number;
  deductibleAbsences: number;
  grossSalary: number;
  deduction: number;
  netSalary: number;
  workingDaysInPeriod: number;
}

export function calculateSalary(input: SalaryCalculationInput): SalaryCalculationOutput {
  const { salaryType, salaryAmount, designatedLeaves, presentDays, leaveDays, absentDays, currentDate } = input;

  let allowedLeavesForPeriod = 0;
  let workingDaysInPeriod = 0;
  let totalAbsences = absentDays; // Only ABSENT counts as absence for deduction

  // Calculate period based on salary type
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  const week = Math.ceil(currentDate.getDate() / 7);

  switch (salaryType) {
    case SalaryType.DAILY:
      // Daily salary: no period concept, leaves are tracked daily
      allowedLeavesForPeriod = designatedLeaves / 365;
      workingDaysInPeriod = 1;
      break;

    case SalaryType.WEEKLY:
      // Weekly salary: 5 work days per week
      allowedLeavesForPeriod = designatedLeaves / 52;
      workingDaysInPeriod = 5;
      break;

    case SalaryType.MONTHLY:
      // Monthly salary: working days in the month
      allowedLeavesForPeriod = designatedLeaves / 12;
      workingDaysInPeriod = getWorkingDaysInMonth(year, month);
      break;

    case SalaryType.QUARTERLY:
      // Quarterly salary: working days in the quarter
      allowedLeavesForPeriod = designatedLeaves / 4;
      workingDaysInPeriod = getWorkingDaysInQuarter(year, quarter);
      break;
  }

  // Calculate used and remaining leaves
  // ON_LEAVE status counts as using designated leaves
  const usedLeaves = leaveDays;
  const remainingLeaves = Math.max(0, allowedLeavesForPeriod - usedLeaves);

  // Calculate deductible absences
  // Deductible = Total absences - Allowed leaves
  const deductibleAbsences = Math.max(0, totalAbsences - allowedLeavesForPeriod);

  // Calculate gross salary based on salary type
  let grossSalary = salaryAmount;

  if (salaryType === SalaryType.DAILY) {
    // Daily: salary_amount × days_present
    grossSalary = salaryAmount * presentDays;
  } else {
    // Weekly/Monthly/Quarterly: salary_amount × (1 - deductible_absences / working_days)
    const deductionRate = workingDaysInPeriod > 0 ? deductibleAbsences / workingDaysInPeriod : 0;
    grossSalary = salaryAmount * Math.max(0, 1 - deductionRate);
  }

  // Calculate deduction amount
  const deduction = salaryAmount - grossSalary;
  const netSalary = grossSalary;

  return {
    allowedLeavesForPeriod: Math.round(allowedLeavesForPeriod * 100) / 100,
    usedLeaves: Math.round(usedLeaves * 100) / 100,
    remainingLeaves: Math.round(remainingLeaves * 100) / 100,
    deductibleAbsences: Math.round(deductibleAbsences * 100) / 100,
    grossSalary: Math.round(grossSalary * 100) / 100,
    deduction: Math.round(deduction * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
    workingDaysInPeriod,
  };
}

export function getAttendanceStats(attendanceRecords: Array<{ status: AttendanceStatus }>) {
  const stats = {
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    onLeave: 0,
  };

  attendanceRecords.forEach((record) => {
    switch (record.status) {
      case AttendanceStatus.PRESENT:
        stats.present++;
        break;
      case AttendanceStatus.ABSENT:
        stats.absent++;
        break;
      case AttendanceStatus.LATE:
        stats.late++;
        break;
      case AttendanceStatus.HALF_DAY:
        stats.halfDay++;
        break;
      case AttendanceStatus.ON_LEAVE:
        stats.onLeave++;
        break;
    }
  });

  return stats;
}
