"use client"

import {
  Children,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import dynamic from "next/dynamic"
import { useResizeObserver } from "@wojtekmaj/react-hooks"
import {
  RotateCw as ArrowClockwiseIcon,
  ExternalLink as ArrowSquareOutIcon,
  ChevronLeft as CaretLeftIcon,
  ChevronRight as CaretRightIcon,
  Download as DownloadIcon,
  ZoomOut as MagnifyingGlassMinusIcon,
  ZoomIn as MagnifyingGlassPlusIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

const Document = dynamic(() => import("react-pdf").then((m) => m.Document), {
  ssr: false,
})
const Page = dynamic(() => import("react-pdf").then((m) => m.Page), {
  ssr: false,
})

interface PdfContextValue {
  file: string
  downloadHref: string
  numPages: number | null
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  reload: () => void
  containerWidth: number
  loading: boolean
}

const PdfContext = createContext<PdfContextValue | null>(null)

export function usePdf() {
  const ctx = useContext(PdfContext)
  if (!ctx) throw new Error("Pdf components must be inside <PdfViewer>")
  return ctx
}

interface PdfViewerProps extends HTMLAttributes<HTMLDivElement> {
  file: string
  downloadHref?: string
  children?: ReactNode
  loader?: ReactNode
}

export const PdfViewer = forwardRef<HTMLDivElement, PdfViewerProps>(
  ({ file, downloadHref, children, loader, className, ...props }, ref) => {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [zoom, setZoom] = useState(1)
    const [docKey, setDocKey] = useState(0)
    const [loading, setLoading] = useState(true)

    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [workerReady, setWorkerReady] = useState(false)

    useEffect(() => {
      import("react-pdf").then(({ pdfjs }) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
        setWorkerReady(true)
      })
    }, [])

    const onResize = useCallback<ResizeObserverCallback>((entries) => {
      const entry = entries[0]
      if (entry) setContainerWidth(entry.contentRect.width)
    }, [])

    useResizeObserver(containerRef, {}, onResize)

    const reload = () => {
      setCurrentPage(1)
      setNumPages(null)
      setLoading(true)
      setDocKey((k) => k + 1)
    }

    const pageWidth = containerWidth > 0 ? containerWidth : null

    const childArray = Children.toArray(children)
    const toolbar = childArray[0]
    const footer =
      childArray.length > 1 ? childArray[childArray.length - 1] : null

    return (
      <PdfContext.Provider
        value={{
          file,
          downloadHref: downloadHref ?? file,
          numPages,
          currentPage,
          setCurrentPage,
          zoom,
          setZoom,
          reload,
          containerWidth,
          loading,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "relative flex h-full flex-col overflow-hidden border border-line",
            className
          )}
          {...props}
        >
          {toolbar}

          <div
            ref={setContainerRef}
            className="relative flex-1 overflow-auto bg-background"
          >
            {workerReady && pageWidth && (
              <Document
                key={docKey}
                file={file}
                loading={null}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages)
                  setLoading(false)
                }}
                onLoadError={() => setLoading(false)}
                className="flex flex-col items-center gap-4 py-4"
              >
                {Array.from({ length: numPages ?? 0 }, (_, i) => (
                  <Page
                    key={i + 1}
                    pageNumber={i + 1}
                    width={pageWidth - 2}
                    scale={zoom}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            )}

            {(loading || !workerReady) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                {loader ?? (
                  <div className="text-sm text-muted-foreground">
                    Loading document...
                  </div>
                )}
              </div>
            )}
          </div>
          {footer}
        </div>
      </PdfContext.Provider>
    )
  }
)

PdfViewer.displayName = "PdfViewer"

export const PdfViewerToolbar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 border-b border-line bg-background px-3 py-2 sm:px-4",
        className
      )}
      {...props}
    />
  )
})
PdfViewerToolbar.displayName = "PdfViewerToolbar"

export const PdfViewerFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border-t border-line bg-background px-4 py-2", className)}
      {...props}
    />
  )
})
PdfViewerFooter.displayName = "PdfViewerFooter"

export const PdfViewerFilename = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement> & { name?: string }
>(({ name, className, ...props }, ref) => {
  const { file } = usePdf()
  const label = name ?? file.split("/").pop() ?? file
  return (
    <span
      ref={ref}
      className={cn(
        "min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground",
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
})
PdfViewerFilename.displayName = "PdfViewerFilename"

export const PdfViewerControls = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center gap-1", className)} {...props} />
)

export const PdfViewerPagination = () => {
  const { currentPage, setCurrentPage, numPages } = usePdf()
  if (!numPages || numPages <= 1) return null

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="Page navigation"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Previous page"
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      >
        <CaretLeftIcon className="size-4" aria-hidden="true" />
      </Button>

      <span
        className="font-mono text-xs"
        aria-live="polite"
        aria-label={`Page ${currentPage} of ${numPages}`}
      >
        {currentPage}/{numPages}
      </span>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Next page"
        onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages!))}
      >
        <CaretRightIcon className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}

export const PdfViewerZoom = () => {
  const { zoom, setZoom } = usePdf()

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="Zoom controls"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom out"
        onClick={() => setZoom((z) => Math.max(+(z - 0.1).toFixed(1), 0.5))}
      >
        <MagnifyingGlassMinusIcon className="size-4" aria-hidden="true" />
      </Button>

      <span
        className="w-10 text-center font-mono text-xs"
        aria-live="polite"
        aria-label={`Zoom: ${Math.round(zoom * 100)}%`}
      >
        {Math.round(zoom * 100)}%
      </span>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom in"
        onClick={() => setZoom((z) => Math.min(+(z + 0.1).toFixed(1), 3))}
      >
        <MagnifyingGlassPlusIcon className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}

export const PdfViewerReload = () => {
  const { reload } = usePdf()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={reload}
      aria-label="Reload PDF"
    >
      <ArrowClockwiseIcon className="size-4" />
    </Button>
  )
}

export const PdfViewerOpen = () => {
  const { file } = usePdf()
  return (
    <a
      href={file}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open PDF in new tab"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <ArrowSquareOutIcon className="size-4" aria-hidden="true" />
    </a>
  )
}

export const PdfViewerDownload = ({ label }: { label?: string }) => {
  const { downloadHref } = usePdf()
  return (
    <a
      href={downloadHref}
      download
      aria-label={label ? `${label} — download as PDF` : "Download as PDF"}
      className={cn(buttonVariants({ size: "sm" }), "px-2 sm:px-3")}
    >
      <DownloadIcon className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline" aria-hidden="true">
        {label}
      </span>
    </a>
  )
}
