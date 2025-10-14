import { Textarea } from "@/components/ui/textarea"
import { useCallback, useEffect, useRef } from "react"

export function AutoResizeTextarea({
    minRows = 1,
    maxRows = 8,
    ...props
}) {
    const textareaRef = useRef(null)

    const resize = useCallback(() => {
        const ta = textareaRef.current
        if (!ta) return

        // reset height so scrollHeight works properly
        ta.style.height = "auto"
        // set height = scrollHeight, but possibly clamp with maxRows
        const style = window.getComputedStyle(ta)
        const lineHeight = parseFloat(style.lineHeight) || 20
        const paddingTop = parseFloat(style.paddingTop) || 0
        const paddingBottom = parseFloat(style.paddingBottom) || 0
        const borderTop = parseFloat(style.borderTopWidth) || 0
        const borderBottom = parseFloat(style.borderBottomWidth) || 0

        const minHeight = lineHeight * Math.max(1, minRows) + paddingTop + paddingBottom + borderTop + borderBottom
        const maxHeight = lineHeight * Math.max(minRows, maxRows) + paddingTop + paddingBottom + borderTop + borderBottom

        const scrollHeight = ta.scrollHeight
        const clamped = Math.max(minHeight, Math.min(scrollHeight, maxHeight))
        ta.style.height = clamped + "px"
        ta.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden"
    }, [minRows, maxRows])

    // Set up input listener and initial size
    useEffect(() => {
        const ta = textareaRef.current
        if (!ta) return
        resize()
        ta.addEventListener("input", resize)
        return () => {
            ta.removeEventListener("input", resize)
        }
    }, [resize])

    // Also resize when the value changes programmatically (e.g., after submit)
    useEffect(() => {
        resize()
    }, [props.value, resize])

    return <Textarea ref={textareaRef} rows={minRows} {...props} />
}
