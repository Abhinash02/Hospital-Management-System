import { motion } from 'framer-motion';

export default function DashboardLayout({ title, subtitle, user, children }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-[2rem] bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-gray-200"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-medical-dark">{title}</h1>
              <p className="mt-2 text-gray-600 max-w-2xl text-sm sm:text-base">{subtitle}</p>
            </div>
            {user && (
              <div className="inline-flex items-center gap-3 rounded-full bg-medical-gray px-4 py-2 sm:px-5 sm:py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-medical-blue text-lg font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-medical-dark">{user.name}</p>
                  <p className="text-xs text-gray-500">Role: {user.role}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
