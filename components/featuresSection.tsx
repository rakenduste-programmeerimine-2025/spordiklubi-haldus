import { motion } from "framer-motion"
import { CheckCircle, Users, Calendar } from "lucide-react"
import { GlassPanel } from "./ui/glasspanel"

export default function FeaturesSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center snap-start">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <GlassPanel className="mt-10 pt-10 h-[180px] min-h-0 text-center justify-center items-center w-[500vw] max-w-4xl">
          <h2 className="text-6xl font-semibold text-white">
            Powerful Features
          </h2>
        </GlassPanel>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Feature 1 */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <GlassPanel className="bg-gradient-to-br from-blue-700/60 via-purple-500/50 to-pink-400/40 backdrop-blur-[20px] w-64 h-48 flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-white mb-3" />
              <h3 className="text-xl text-white font-semibold mb-2">
                Team Management
              </h3>
              <p className="text-white/80 text-sm">
                Manage players, roles, and team communications effortlessly.
              </p>
            </GlassPanel>
          </motion.div>

          {/* Feature 2 */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <GlassPanel className="bg-gradient-to-br from-pink-700/60 via-green-500/50 to-green-400/40 backdrop-blur-[20px] w-64 h-48 flex flex-col items-center justify-center">
              <Calendar className="h-10 w-10 text-white mb-3" />
              <h3 className="text-xl text-white font-semibold mb-2">
                Smart Scheduling
              </h3>
              <p className="text-white/80 text-sm">
                Schedule matches and training sessions
              </p>
            </GlassPanel>
          </motion.div>

          {/* Feature 3 */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <GlassPanel className="bg-gradient-to-br from-green-700/60 via-yellow-500/50 to-blue-400/40 backdrop-blur-[20px] w-64 h-48 flex flex-col items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white mb-3" />
              <h3 className="text-3xl font-semibold mb-2 text-white">
                Performance Tracking
              </h3>
            </GlassPanel>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
