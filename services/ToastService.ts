import { toast } from "react-toastify";

export class ToastService {
  public success(message: string) {
    toast.success(message);
  }
  public error(message: string) {
    toast.error(message);
  }
  public warn(message: string) {
    toast.warn(message);
  }
  public info(message: string) {
    toast.info(message);
  }
}
