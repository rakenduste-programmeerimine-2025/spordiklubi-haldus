import SettingsPageClient from "./settingsServer"

export default async function SettingsPage({
  params,
}: {
  params: { clubslug: string }
}) {
  const resolvedParams = await params
  const { clubslug } = resolvedParams
  return <SettingsPageClient clubslug={clubslug} />
}
