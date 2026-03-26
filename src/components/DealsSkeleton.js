export default function DealsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden px-4 mt-6">

      {[1,2,3].map(i => (
        <div
          key={i}
          className="min-w-[220px] h-[180px] rounded-2xl bg-gray-300 animate-pulse"
        />
      ))}

    </div>
  )
    }
