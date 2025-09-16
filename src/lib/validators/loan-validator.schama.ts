import * as yup from 'yup';
import { LoanRepaymentFrequency } from "../../typings/enums";

const LoanValidationSchema = {
  RequestLoan: yup.object({
    amount: yup.number().positive().required(),
    start_date: yup.date().required(),
    end_date: yup.date().required(),
    repayment_frequency: yup.mixed<LoanRepaymentFrequency>().oneOf(Object.values(LoanRepaymentFrequency)).required(),
    purpose: yup.string().trim().required().min(10).max(255)
  })
};

export default LoanValidationSchema;
