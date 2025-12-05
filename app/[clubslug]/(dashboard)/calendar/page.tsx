import { ClubCalendar } from "@/components/calendar"
import { createClient } from "@/lib/supabase/server"

interface Props {
  params: { clubslug: string }
}

export default async function CalendarPage({ params }: Props) {
  const supabase = await createClient()

  const resolvedParams = await params
  const { clubslug } = resolvedParams

  const { data: club, error } = await supabase
    .from("club")
    .select("id, name")
    .eq("slug", clubslug)
    .maybeSingle()

  if (error) {
    console.error("[CalendarPage] error loading club by slug:", error)
  }

  if (!club) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
          <h1 className="mb-2 text-lg font-semibold text-red-800">
            Club not found
          </h1>
          <p className="text-sm text-red-700">
            The club you tried to access doesn&apos;t exist or is no longer
            available. Please check the URL or switch to another team.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ClubCalendar clubId={club.id} />
    </div>
  )
}
