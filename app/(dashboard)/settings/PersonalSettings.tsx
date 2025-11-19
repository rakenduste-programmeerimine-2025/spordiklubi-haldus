import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function PersonalSettings() {
  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full name</label>
              <input
                className="input"
                defaultValue="Sarah Johnson"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email address</label>
              <input
                className="input"
                defaultValue="sarah.johnson@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="password"
              className="input"
              placeholder="Current password"
            />
            <input
              type="password"
              className="input"
              placeholder="New password"
            />
            <input
              type="password"
              className="input"
              placeholder="Confirm password"
            />
          </div>
        </CardContent>

        <CardFooter>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md">
            Save Changes
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
