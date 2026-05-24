'use server'

import { db } from "@/db"
import { gifts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createGift(data: any) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return { success: false, error: "Вы должны быть авторизованы" }
    }

    const { 
      collection, 
      modelName, 
      symbol, 
      backdrop, 
      collectibleNumber, 
      description, 
      price, 
      categories 
    } = data

    const [newGift] = await db.insert(gifts).values({
      collection: String(collection),
      modelName: String(modelName),
      symbol: String(symbol),
      backdrop: String(backdrop || "default"),
      collectibleNumber: Number(collectibleNumber) || 1,
      description: String(description),
      price: parseFloat(price),
      categories: categories ? (Array.isArray(categories) ? categories : [categories]) : ["all"],
      sellerId: userId,
    }).returning()

    revalidatePath("/profile") 

    return { success: true, gift: newGift }
  } catch (error) {
    console.error("Ошибка при создании подарка:", error)
    return { success: false, error: "Не удалось создать товар" }
  }
}

export async function deleteGift(giftId: number) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    const [gift] = await db
      .select()
      .from(gifts)
      .where(eq(gifts.id, giftId))

    if (!gift || gift.sellerId !== userId) {
      return { success: false, error: "Нет прав на удаление" }
    }

    await db
      .delete(gifts)
      .where(eq(gifts.id, giftId))

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Ошибка при удалении" }
  }
}