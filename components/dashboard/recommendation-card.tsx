import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockRecommendations } from '@/lib/mock-data'
import { Clock, ArrowRight } from 'lucide-react'

export default function RecommendationCard() {
  const recommendation = mockRecommendations[0]

  return (
    <Card className="p-6 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <h3 className="text-lg font-semibold text-foreground mb-3">Recommended</h3>

      <div className="rounded-lg overflow-hidden mb-3">
        <img
          src={recommendation.image}
          alt={recommendation.title}
          className="w-full h-32 object-cover"
        />
      </div>

      <h4 className="font-semibold text-foreground mb-1">{recommendation.title}</h4>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {recommendation.description}
      </p>

      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          {recommendation.duration}
        </div>
        <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs font-semibold">
          {recommendation.difficulty}
        </span>
      </div>

      <Link href="/recommendations">
        <Button className="w-full bg-primary hover:bg-primary/90 h-9">
          Learn More
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </Link>
    </Card>
  )
}
