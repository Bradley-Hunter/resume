export default function JobEntry({ title, company, dates, location, duties }) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
        <div>
          <h3 className="font-semibold text-white dark:text-white">{title}</h3>
          <p className="text-gray-300 dark:text-gray-400 italic">{company}</p>
        </div>
        <div className="text-sm text-gray-300 dark:text-gray-400 sm:text-right shrink-0">
          <p>{dates}</p>
          {location && <p>{location}</p>}
        </div>
      </div>
      <ul className="mt-2 space-y-1 list-disc list-inside text-gray-200 dark:text-gray-300 text-sm">
        {duties.map((duty, i) => (
          <li key={i}>{duty}</li>
        ))}
      </ul>
    </div>
  )
}
