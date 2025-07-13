import { Card } from "@mui/material"
import Head from "next/head"
import { useState, useEffect } from "react"

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

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

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24, lineHeight: 2.1 }}
        >
          



          
        </Card>
      </div>
    </div>
  )
}

export default Documents