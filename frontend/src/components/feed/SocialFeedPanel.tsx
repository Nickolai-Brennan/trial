import { Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react'

interface SocialEmbed {
  platform: 'twitter' | 'instagram' | 'youtube'
  embedId: string
  caption?: string
}

// TODO: Replace with real social media API integrations (Twitter/X, Instagram, YouTube)
const placeholderEmbeds: SocialEmbed[] = [
  { platform: 'twitter', embedId: 'sample-tweet', caption: 'Trending on X' },
  { platform: 'instagram', embedId: 'sample-post', caption: 'Featured post' },
  { platform: 'youtube', embedId: 'dQw4w9WgXcQ', caption: 'Watch now' },
]

const platformConfig = {
  twitter: { icon: Twitter, color: 'text-sky-500', label: 'X / Twitter', bg: 'bg-sky-50' },
  instagram: {
    icon: Instagram,
    color: 'text-pink-500',
    label: 'Instagram',
    bg: 'bg-pink-50',
  },
  youtube: { icon: Youtube, color: 'text-red-500', label: 'YouTube', bg: 'bg-red-50' },
}

function SocialCard({ embed }: { embed: SocialEmbed }) {
  const config = platformConfig[embed.platform]
  const Icon = config.icon

  return (
    <div className={`rounded-xl border border-gray-200 p-4 ${config.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${config.color}`} />
          <span className="text-xs font-semibold text-gray-700">{config.label}</span>
        </div>
        <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
      </div>
      {embed.platform === 'youtube' ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-200">
          <iframe
            src={`https://www.youtube.com/embed/${embed.embedId}`}
            title={embed.caption ?? 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="h-36 rounded-lg bg-white/60 flex items-center justify-center text-sm text-gray-400 border border-gray-200">
          {embed.caption}
        </div>
      )}
    </div>
  )
}

export default function SocialFeedPanel() {
  return (
    <aside className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Social Highlights
      </h2>
      {placeholderEmbeds.map((embed, i) => (
        <SocialCard key={i} embed={embed} />
      ))}
    </aside>
  )
}
