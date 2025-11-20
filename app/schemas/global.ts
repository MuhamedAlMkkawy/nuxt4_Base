import * as yup from 'yup';


export const globalSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  name: yup.string().required().min(3).max(30),
});