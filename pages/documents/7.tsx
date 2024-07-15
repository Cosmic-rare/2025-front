import Head from "next/head"
import { useState, useEffect } from "react"

const resize = () => {
  const height = window.innerHeight
  const width = window.innerWidth
  return { height: height, width: width }
}

const Documents = () => {
  const [innerSize, setInnerSize] = useState({ height: 0, width: 0 })
  const handleResize = () => {
    setInnerSize(resize())
  }
  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)
  }, [])

  return (
    <div style={{ height: "100%" }}>
      <Head>
        <title>要項</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center", height: "100%", flexDirection: "column" }}>
        <h2>要項</h2>

        <div style={{ height: "100%" }}>
          <iframe src="https://drive.google.com/file/d/112bkuRukZd6haFROvDp-If67C1QtppoZ/preview" width="100%" style={{ height: `${innerSize.height - 160}px` }} allow="autoplay"></iframe>
        </div>

      </div>
    </div>
  )
}

export default Documents