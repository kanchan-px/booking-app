import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import type { RegisterFormData } from "../types";
import * as apiClient from "../api-clients";

// export type RegisterFormData = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };
const Register = () => {

  const { register,watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const mutation = useMutation({
  mutationFn: (data: RegisterFormData) => apiClient.register(data),
  onSuccess: () => {
    console.log("User registered successfully");
  },
  onError: (error: Error) => {
    console.error(error.message);
  },
});

  const onSubmit = handleSubmit((data)=>{
    mutation.mutate(data);
  })

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold"
      >Create an Account</h2>
      
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input className="border rounded w-full py-1 px-2 font-normal" {...register("firstName",{
            required: "First name is required",
          })}></input>
          {errors.firstName && (<span className="text-red-500 text-sm">{errors.firstName.message}</span>)}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input className="border rounded w-full py-1 px-2 font-normal" {...register("lastName",{
            required: "Last name is required",
          })}></input>
          {errors.lastName && (<span className="text-red-500 text-sm">{errors.lastName.message}</span>)}
        </label>
      </div>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input className="border rounded w-full py-1 px-2 font-normal" {...register("email",{
            required: "Email is required",
          })}></input>
          {errors.email && (<span className="text-red-500 text-sm">{errors.email.message}</span>)}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Password
          <input className="border rounded w-full py-1 px-2 font-normal" type="password" {...register("password",{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long"
            }
          })}></input>
          {errors.password && (<span className="text-red-500 text-sm">{errors.password.message}</span>)}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Confirm Password
          <input className="border rounded w-full py-1 px-2 font-normal" type="password" {...register("confirmPassword",{
            
            validate: (value) => {
              if(!value){
                return "Confirm Password is required";
              }else if(watch("password") !== value){
                return "Passwords do not match";
              }              
            }
          })}></input>
          {errors.confirmPassword && (<span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>)}
        </label>
        <span>
          <button type="submit" className="bg-blue-600 text-white p-2 font-bold rounded hover:bg-blue-600 text-xl">
            Create Account
          </button>
        </span>

    </form>

  );
};

export default Register;