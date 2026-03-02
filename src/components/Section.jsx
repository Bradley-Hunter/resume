export default function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        {title}
      </h2>
      {children}
    </section>
  )
}
