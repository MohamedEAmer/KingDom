import { useKeenSlider } from "keen-slider/react"
import { useRef } from "react"
import "keen-slider/keen-slider.min.css"
import { CircleCheck } from "lucide-react"

export default function BattlePassSlider({ missions }) {
  const timer = useRef()
  const mouseOver = useRef(false)

  // Autoplay plugin
  function autoplay(slider) {
    const speed = 2000

    function run() {
      if (!mouseOver.current) {
        timer.current = setTimeout(() => {
          slider.next()
        }, speed)
      }
    }

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver.current = true
        clearTimeout(timer.current)
      })

      slider.container.addEventListener("mouseout", () => {
        mouseOver.current = false
        run()
      })

      run()
    })

    slider.on("dragStarted", () => clearTimeout(timer.current))
    slider.on("animationEnded", run)
    slider.on("updated", run)
  }

  // KeenSlider hook
  const [ref] = useKeenSlider(
    {
      loop: true,
      mode: "free",
      slides: {
        perView: 2, // small screens
        spacing: 30,
      },
      breakpoints: {
        "(min-width: 640px)": { slides: { perView: 3, spacing: 30 } },
        "(min-width: 768px)": { slides: { perView: 5, spacing: 30 } },
        "(min-width: 1024px)": { slides: { perView: 6, spacing: 30 } },
        "(min-width: 1280px)": { slides: { perView: 8, spacing: 40 } },
      },
    },
    [autoplay]
  )

  return (
    <div className="mt-10">
      <h2 className="text-white text-xl font-bold mb-4 text-center">
        BattlePass Missions
      </h2>

      <div
        ref={ref}
        className="keen-slider py-6 rounded-2xl bg-gray-700"
      >
        {missions.map((m, index) => (
          <div
            key={index}
            className="keen-slider__slide bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-between"
          >
            {/* Mission Title */}
            <span className="text-sm font-semibold mb-2 text-yellow-300">
              Mission Name : {index + 1}
            </span>

            {/* Mission Image */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden shadow-inner">
              <img
                src="/mission.jpg"
                alt={`Mission ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <CircleCheck
                className="absolute inset-0 w-full h-full text-red-900 opacity-90 z-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
            </div>


            {/* Mission Status */}
            <span className="text-xs text-gray-300 my-3 uppercase tracking-wide">
              Mission Status: <span className="text-green-400 font-semibold">Running</span>
            </span>
            <span className="text-xs text-gray-300 my-3 uppercase tracking-wide">
              Mission Status: <span className="text-red-400 font-semibold">Done</span>
            </span>
            
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold  py-1 px-3 rounded-full transition duration-300 shadow-md hover:shadow-lg">
              Get Reward
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
