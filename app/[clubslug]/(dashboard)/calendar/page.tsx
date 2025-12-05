import { ClubCalendar } from "@/components/calendar"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface Props {
  params: { clubslug: string }
}

export default async function CalendarPage({ params }: Props) {
  const supabase = await createClient()
  const resolvedParams = await params
  const { clubslug } = resolvedParams

  const { data: club, error } = await supabase
    .from("club")
    .select("id")
    .eq("slug", clubslug)
    .single()

  if (error || !club) {
    console.log("Club not found:", clubslug, error)
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ClubCalendar />
    </div>
  )
}
