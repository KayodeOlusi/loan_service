import * as yup from 'yup';
import { RepaymentStatus } from "../../typings/enums";

const RepaymentValidatorSchema = {
  UpdateRepayment: yup.object({
    status: yup.mixed<RepaymentStatus>().oneOf(Object.values(RepaymentStatus)).required()
  })
};

export default RepaymentValidatorSchema;
