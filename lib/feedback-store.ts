"use client"

import { useState, useEffect, useCallback } from "react"

export interface Feedback {
  id: string
  text: string
  rating?: number
  customer?: string
  date: Date
  sentiment: "positive" | "negative" | "neutral"
  tags: string[]
}

const STORAGE_KEY = "feedback-dashboard-data"

export function useFeedbackStore() {
  const [feedback, setFeedback] = useState<Feedback[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setFeedback(
          data.map((item: any) => ({
            ...item,
            date: new Date(item.date),
          })),
        )
      } catch {
        console.error("Failed to load feedback from storage")
      }
    } else {
      // Load demo data on first visit
      setFeedback(getDemoFeedback())
    }
  }, [])

  // Save to localStorage whenever feedback changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback))
  }, [feedback])

  const addFeedback = useCallback((newFeedback: Omit<Feedback, "id">) => {
    const id = Date.now().toString()
    setFeedback((prev) => [
      ...prev,
      {
        ...newFeedback,
        id,
      },
    ])
  }, [])

  const clearAll = useCallback(() => {
    setFeedback([])
  }, [])

  return { feedback, addFeedback, clearAll }
}

function getDemoFeedback(): Feedback[] {
  return [
    {
      id: "1",
      text: "The delivery was fast and the service staff was incredibly polite and helpful!",
      rating: 5,
      customer: "Sarah M.",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      sentiment: "positive",
      tags: ["delivery", "service"],
    },
    {
      id: "2",
      text: "Food quality was great but delivery was late by 30 minutes",
      rating: 3,
      customer: "John D.",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      sentiment: "neutral",
      tags: ["delivery", "taste"],
    },
    {
      id: "3",
      text: "The staff was rude and we had to wait way too long. Very disappointed.",
      rating: 1,
      customer: "Emily T.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sentiment: "negative",
      tags: ["service", "wait_time"],
    },
    {
      id: "4",
      text: "Excellent value for money! The pricing is very competitive and the taste is outstanding.",
      rating: 5,
      customer: "Mike R.",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      sentiment: "positive",
      tags: ["pricing", "taste"],
    },
    {
      id: "5",
      text: "Delivery on time but the food was cold and taste was mediocre",
      rating: 2,
      customer: "Lisa K.",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sentiment: "negative",
      tags: ["delivery", "taste", "quality"],
    },
    {
      id: "6",
      text: "Great experience overall! Polite staff, tasty food, and fair prices.",
      rating: 4,
      customer: "David C.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sentiment: "positive",
      tags: ["service", "taste", "pricing"],
    },
    {
      id: "7",
      text: "Waited 45 minutes for delivery. Extremely frustrated with the delay.",
      rating: 1,
      customer: "Angela P.",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      sentiment: "negative",
      tags: ["delivery", "wait_time"],
    },
    {
      id: "8",
      text: "Perfect order! Everything was fresh and delicious. Will order again!",
      rating: 5,
      customer: "Tom B.",
      date: new Date(),
      sentiment: "positive",
      tags: ["taste", "quality"],
    },
  ]
}
