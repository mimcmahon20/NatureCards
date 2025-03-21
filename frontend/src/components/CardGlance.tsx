import Image from "next/image"
import { Star } from "lucide-react"

interface CardGlanceProps {
  name: string
  image: string
  rating?: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

export function CardGlance({ name, image, rating, rarity }: CardGlanceProps) {
  // Determine colors based on rarity
  const getColors = () => {
    switch (rarity) {
      case "common":
        return {
          border: "border-[#1a4e8c]", // Blue border
          bg: "bg-[#d8e6f3]", // Light blue background
          star: "text-[#1a4e8c]", // Blue stars
          header: "bg-[#d8e6f3]", // Light blue header
          rarityLevel: 1, // 1 star filled
        }
      case "rare":
        return {
          border: "border-[#2e7d32]", // Green border
          bg: "bg-[#e8f5e9]", // Light green background
          star: "text-[#2e7d32]", // Green stars
          header: "bg-[#e8f5e9]", // Light green header
          rarityLevel: 2, // 2 stars filled
        }
      case "epic":
        return {
          border: "border-[#6a4c93]", // Purple border
          bg: "bg-[#e7e0f4]", // Light purple background
          star: "text-[#6a4c93]", // Purple stars
          header: "bg-[#e7e0f4]", // Light purple header
          rarityLevel: 3, // 3 stars filled
        }
      case "legendary":
        return {
          border: "border-[#8b5a2b]", // Brown/gold border
          bg: "bg-[#f9f3e0]", // Light cream/gold background
          star: "text-[#8b5a2b]", // Brown/gold stars
          header: "bg-[#f9f3e0]", // Light cream/gold header
          rarityLevel: 4, // 4 stars filled
        }
      default:
        return {
          border: "border-gray-300",
          bg: "bg-gray-50",
          star: "text-gray-400",
          header: "bg-gray-50",
          rarityLevel: 0,
        }
    }
  }

  const colors = getColors()

  return (
    <div className={`rounded-lg border-2 ${colors.border} overflow-hidden w-full max-w-full`}>
      <div className={`p-1 sm:p-2 ${colors.border} ${colors.header}`}>
        <h3 className="text-xs sm:text-sm font-medium truncate">{name}</h3>
      </div>
      <div className="relative aspect-square">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className={`flex justify-center p-1 sm:p-2 ${colors.bg}`}>
        {[1, 2, 3, 4].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${colors.star} ${star <= colors.rarityLevel ? "fill-current" : "fill-transparent"}`}
          />
        ))}
      </div>
    </div>
  )
}

