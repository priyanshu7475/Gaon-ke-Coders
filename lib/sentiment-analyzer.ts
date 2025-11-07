import type { Feedback } from "./feedback-store"

const POSITIVE_WORDS = [
  "excellent",
  "great",
  "amazing",
  "outstanding",
  "fantastic",
  "wonderful",
  "love",
  "polite",
  "helpful",
  "fast",
  "fresh",
  "delicious",
  "competitive",
  "perfect",
  "good",
  "best",
  "friendly",
  "on time",
  "quality",
]

const NEGATIVE_WORDS = [
  "bad",
  "terrible",
  "awful",
  "horrible",
  "disappointing",
  "late",
  "delay",
  "rude",
  "cold",
  "mediocre",
  "expensive",
  "slow",
  "disappointed",
  "frustrating",
  "frustrated",
  "wait",
  "worst",
  "poor",
  "unfriendly",
]

export function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  const lowerText = text.toLowerCase()
  let score = 0

  POSITIVE_WORDS.forEach((word) => {
    if (lowerText.includes(word)) score += 1
  })

  NEGATIVE_WORDS.forEach((word) => {
    if (lowerText.includes(word)) score -= 1
  })

  if (score > 0) return "positive"
  if (score < 0) return "negative"
  return "neutral"
}

export function getThemes(text: string): string[] {
  const lowerText = text.toLowerCase()
  const themes: string[] = []

  const themeKeywords: Record<string, string[]> = {
    delivery: ["delivery", "delivery", "on time", "late", "delay", "late", "fast"],
    service: ["staff", "service", "polite", "rude", "friendly", "helpful"],
    taste: ["taste", "taste", "delicious", "food", "flavor", "mediocre"],
    pricing: ["price", "pricing", "expensive", "competitive", "value", "cost"],
    quality: ["quality", "fresh", "cold", "condition"],
    wait_time: ["wait", "waiting", "long", "slow"],
  }

  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    keywords.forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        themes.push(theme)
        return
      }
    })
  })

  return [...new Set(themes)]
}

export function calculateSentimentStats(feedback: Feedback[]) {
  const total = feedback.length
  const positive = feedback.filter((f) => f.sentiment === "positive").length
  const negative = feedback.filter((f) => f.sentiment === "negative").length
  const neutral = feedback.filter((f) => f.sentiment === "neutral").length

  return {
    total,
    positive,
    negative,
    neutral,
    positivePercent: ((positive / total) * 100).toFixed(1),
    negativePercent: ((negative / total) * 100).toFixed(1),
    neutralPercent: ((neutral / total) * 100).toFixed(1),
    headline: positive > negative ? "Mostly Positive" : negative > positive ? "Needs Attention" : "Mixed",
  }
}

export function extractTopThemes(feedback: Feedback[], sentiment?: "positive" | "negative") {
  const themeCount: Record<string, number> = {}
  let filteredFeedback = feedback

  if (sentiment) {
    filteredFeedback = feedback.filter((f) => f.sentiment === sentiment)
  }

  filteredFeedback.forEach((item) => {
    item.tags.forEach((tag) => {
      themeCount[tag] = (themeCount[tag] || 0) + 1
    })
  })

  return Object.entries(themeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([theme, count]) => ({ theme, count }))
}

export function calculateKPIs(feedback: Feedback[]) {
  const ratings = feedback.filter((f) => f.rating !== undefined).map((f) => f.rating!)
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "N/A"

  const negativeThemes = extractTopThemes(feedback, "negative")
  const positiveThemes = extractTopThemes(feedback, "positive")

  const mostCommonComplaint = negativeThemes[0]?.theme || "None"
  const mostPraisedAspect = positiveThemes[0]?.theme || "None"

  return {
    avgRating,
    mostCommonComplaint,
    mostPraisedAspect,
    totalFeedback: feedback.length,
  }
}

export function getActionItems(feedback: Feedback[]): { theme: string; count: number; suggestion: string }[] {
  const negativeThemes = extractTopThemes(feedback, "negative")

  const suggestions: Record<string, string> = {
    delivery: "Improve delivery speed — focus on logistics and route optimization",
    service: "Enhance staff training — implement customer service excellence program",
    wait_time: "Reduce wait times — consider additional capacity during peak hours",
    quality: "Improve product quality — review production standards and QA processes",
    taste: "Improve taste/flavor — gather detailed feedback on recipe improvements",
    pricing: "Review pricing strategy — consider value-based pricing adjustments",
  }

  return negativeThemes.map((theme) => ({
    ...theme,
    suggestion: suggestions[theme.theme] || `Address concerns about ${theme.theme.replace("_", " ")}`,
  }))
}
