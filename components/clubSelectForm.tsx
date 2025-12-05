"use client"
import { useRouter } from "next/navigation"
import { MemberWithClub } from "@/types/clubs"

interface ClubSelectFormProps {
  clubs: MemberWithClub[]
}

export function ClubSelectForm({ clubs }: ClubSelectFormProps) {
  const router = useRouter()
  return (
    <ul>
      {clubs
        .filter(c => c.club)
        .map(c => (
          <li key={c.club!.slug}>
            <button onClick={() => router.push(`/${c.club!.slug}/dashboard`)}>
              {c.club!.name}
            </button>
          </li>
        ))}
    </ul>
  )
}
