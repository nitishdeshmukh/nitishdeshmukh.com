import { LogosCarousel } from "@/components/logos-carousel"
import { SPONSORS } from "@/features/sponsor/data"

import { Panel } from "./panel"

export function SponsorsCarousel() {
  if (SPONSORS.length === 0) {
    return null
  }

  return (
    <Panel className="@container screen-line-bottom-none screen-line-top-none">
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[calc(1px+1rem+1px)] -z-1 grid grid-cols-3 *:border-r *:border-dashed *:border-line @2xl:grid-cols-4">
        <div />
        <div />
        <div className="@max-2xl:hidden" />
      </div>

      <div className="flex justify-center">
        <div className="bg-background px-2 py-4">
          <h2 className="text-center text-sm/none font-medium text-muted-foreground">
            Proudly supported by
          </h2>
        </div>
      </div>

      <div className="screen-line-bottom h-px" />

      <ul className="sr-only">
        {SPONSORS.map((sponsor) => (
          <li key={sponsor.name}>{sponsor.name}</li>
        ))}
      </ul>

      <div
        className="grid grid-cols-3 py-2 text-muted-foreground @2xl:hidden"
        aria-hidden
      >
        {SPONSORS.map((sponsor) => (
          <sponsor.logo key={sponsor.name} className="h-auto w-full" />
        ))}
      </div>

      <div className="@max-2xl:hidden" aria-hidden>
        <LogosCarousel className="w-full py-4 text-muted-foreground [--column-count:4]">
          {SPONSORS.map((sponsor) => (
            <sponsor.logo key={sponsor.name} className="h-auto w-full" />
          ))}
        </LogosCarousel>
      </div>

      <div className="screen-line-bottom h-px" />
      <div className="h-4" />
      <div className="screen-line-bottom h-px screen-line-bottom-border" />
    </Panel>
  )
}

// import { LogosCarousel } from "@/components/logos-carousel"
// import { SPONSORS } from "@/features/sponsor/data"

// import { Panel } from "./panel"

// export function SponsorsCarousel() {
//   return (
//     <Panel className="@container screen-line-bottom-none screen-line-top-none relative">
//       <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[calc(1px+1rem+1px)] -z-1 grid grid-cols-3 *:border-r *:border-dashed *:border-line @2xl:grid-cols-4">
//         <div />
//         <div />
//         <div className="@max-2xl:hidden" />
//       </div>

//       <div className="flex justify-center">
//         <div className="bg-background px-2 py-4">
//           <h2 className="text-center text-sm/none font-medium text-muted-foreground">
//             Proudly supported by
//           </h2>
//         </div>
//       </div>

//       <div className="screen-line-bottom h-px" />

//       <ul className="sr-only">
//         {SPONSORS.map((sponsor) => (
//           <li key={sponsor.name}>{sponsor.name}</li>
//         ))}
//       </ul>

//       <div
//         className="grid grid-cols-3 py-2 text-muted-foreground @2xl:hidden"
//         aria-hidden
//       >
//         {SPONSORS.map((sponsor) => (
//           <sponsor.logo key={sponsor.name} className="h-auto w-full" />
//         ))}
//       </div>

//       <div className="@max-2xl:hidden" aria-hidden>
//         <LogosCarousel className="w-full py-4 text-muted-foreground [--column-count:4]">
//           {SPONSORS.map((sponsor) => (
//             <sponsor.logo key={sponsor.name} className="h-auto w-full" />
//           ))}
//         </LogosCarousel>
//       </div>

//       <div className="screen-line-bottom h-px" />
//       <div className="h-4" />
//       <div className="screen-line-bottom h-px screen-line-bottom-border" />
//     </Panel>
//   )
// }
