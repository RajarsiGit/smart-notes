import { PenLine } from 'lucide-react'

export default function EmptyState({ mobileView, onBack }) {
  return (
    <main
      className={`flex-col overflow-hidden bg-white ${
        mobileView === 'list' ? 'hidden md:flex md:flex-1' : 'flex flex-1'
      }`}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f0fdfa] border-2 border-[#ccfbf1] flex items-center justify-center mx-auto mb-5">
            <PenLine size={22} className="text-[#0d9488]" />
          </div>
          <p className="font-['Syne'] text-lg font-semibold text-[#4a4741]">
            Select a note or create a new one
          </p>
          <p className="text-sm text-[#b0aca6] font-['Manrope'] mt-2">Your thoughts, organized</p>
        </div>
      </div>
    </main>
  )
}
