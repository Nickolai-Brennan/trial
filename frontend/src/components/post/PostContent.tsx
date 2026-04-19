import DOMPurify from 'dompurify'

interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  const sanitized = DOMPurify.sanitize(content)
  return (
    <div
      className="prose-content max-w-none text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}
