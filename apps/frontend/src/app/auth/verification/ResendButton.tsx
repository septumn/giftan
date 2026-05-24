"use client"

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
      <button type="submit" className="text-blue-500 hover:underline font-medium">
        Отправить еще раз
      </button>
    </form>
  );
}