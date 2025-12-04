import Image from "next/image"
import Link from "next/link"

const mockTeams = [
  {
    id: 1,
    name: "FC Kuressaare U10",
    logo: "/images/kure_asendus.png",
  },
  {
    id: 2,
    name: "FC Kuressaare U12",
    logo: "/images/kure_asendus.png",
  },
  {
    id: 3,
    name: "FC Kuressaare U8",
    logo: "/images/kure_asendus.png",
  },
]

export default function SwitchTeamPage() {
  return (
    <div className="flex flex-col items-center pt-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Switch Team
      </h1>

      <p className="text-gray-500 mb-8 text-center">
        Choose which team you want to manage
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
        {mockTeams.map(team => (
          <Link
            key={team.id}
            href={`/dashboard?team=${team.id}`}
            className="
              group flex flex-col items-center cursor-pointer
              transition-transform hover:scale-105
            "
          >
            <div
              className="
                relative h-28 w-28 sm:h-32 sm:w-32 rounded-xl overflow-hidden 
                border-2 border-transparent group-hover:border-blue-500
                transition
              "
            >
              <Image
                src={team.logo}
                fill
                alt={team.name}
                className="object-cover"
              />
            </div>

            <p
              className="
                mt-3 text-sm sm:text-base font-medium text-gray-800
                group-hover:text-blue-600 transition
              "
            >
              {team.name}
            </p>
          </Link>
        ))}
      </div>

      {/* <Link
        href="/dashboard"
        className="mt-10 text-blue-600 hover:underline text-sm"
      >
        ← Back to dashboard
      </Link> */}
    </div>
  )
}