'use server'

import { unstable_update } from "@/auth"

export async function verifyUser(token: string) {
  try {
    const response = await fetch(`${process.env.NEST_API_URL}/auth/verify?token=${token}`, {
      method: 'POST',
    });
    const data = await response.json();

    if (data.error) {
      return { error: data.error };
    }

    await unstable_update({
      user: {
        emailVerified: data.emailVerified
      }
    });

    return { success: true };
  } catch (err) {
    return { error: "Ошибка соединения с сервером" };
  }
}