import { motion } from "framer-motion"
import { CheckCircle, Users, Calendar } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center snap-start">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="border-2 border-white p-8 rounded-xl bg-black/40 text-center"
      >
        <h2 className="text-6xl font-semibold mb-4 text-white">
          Powerful Features
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="border border-white/50 bg-white/30 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center text-center"
          >
            <Users className="h-10 w-10 text-white mb-3" />
            <h3 className="text-xl font-semibold mb-2">Team Management</h3>
            <p className="text-white/80 text-sm">
              Manage players, roles, and team communications effortlessly.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="border border-white/50 bg-white/30 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center text-center"
          >
            <Calendar className="h-10 w-10 text-white mb-3" />
            <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-white/80 text-sm">
              Schedule matches and training sessions
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="border border-white/50 bg-black/30 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center text-center"
          >
            <CheckCircle className="h-10 w-10 text-white mb-3" />
            <h3 className="text-3xl font-semibold mb-2 text-white">
              Performance Tracking
            </h3>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
