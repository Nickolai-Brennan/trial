interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div
      className="prose-content max-w-none text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
