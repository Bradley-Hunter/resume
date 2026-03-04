export default function ToolBadge({ name }) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-800 text-gray-200 dark:text-gray-300 border border-gray-600 dark:border-transparent">
      {name}
    </span>
  )
}
