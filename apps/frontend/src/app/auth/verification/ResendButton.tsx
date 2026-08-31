<<<<<<< HEAD
'use client'
=======
"use client"
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

import { sendMailAgain } from "@/actions/auth"
import { toast } from "sonner"

export default function ResendButton({ email }: { email: string }) {
  const handleAction = async () => {
    const result = await sendMailAgain(email);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Письмо отправлено!");
    }
  };

  return (
    <form action={handleAction} className="inline ml-1">
<<<<<<< HEAD
      <button type="submit" className="text-blue-500 hover:underline font-medium hover:cursor-pointer">
=======
      <button type="submit" className="text-blue-500 hover:underline font-medium">
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
        Отправить еще раз
      </button>
    </form>
  );
}