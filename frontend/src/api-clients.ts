
import type { SignInFormData } from "./pages/SignIn";
import type { RegisterFormData } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(import.meta.env.VITE_API_BASE_URL);

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`,{
    method: 'POST',
    credentials: "include",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })

  const responseBody = await response.json();

  if(!response.ok){
    throw new Error(responseBody.message || "Failed to register");
  }
  console.log("register() completed successfully!")
  return responseBody;
}

export const signIn = async (formData:SignInFormData ) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`,{
    method: 'POST', 
    credentials: "include",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  }); 

  const body = await response.json();
  if(!response.ok){
    throw new Error(body.message || "Failed to sign in");
  }
}
export const validateToken = async ()=>{
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
    credentials: "include",
  })

  if(!response.ok){
    throw new Error("Token validation failed");
  }
  return response.json();
}
