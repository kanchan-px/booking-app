import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR" | "INFO";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    },5000);
    return ()=>{
      clearTimeout(timer);
    }
  },[onClose]);

  const styles = type === "SUCCESS" ? "fixed top-4 right-4 z-50 px-3 py-2 rounded-md bg-green-600 text-white w-fit" :
  "fixed top-4 right-4 z-50 px-3 py-2 rounded-md bg-red-600 text-white w-fit";

  return(
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}

export default Toast;