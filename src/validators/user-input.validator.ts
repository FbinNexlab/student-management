import * as Yup from "yup";
import { UserRole } from "../generated/graphql";

const UserInputSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required."),
  email: Yup.string().email("Email is not valid.").required("Email is required."),
  password: Yup.string().required("Password is required."),
  role: Yup.string().oneOf([UserRole.Lecturer, UserRole.Student]).required("Role is required."),
});

export { UserInputSchema };
