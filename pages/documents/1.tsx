import { Card } from "@mui/material"
import Head from "next/head"
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

const Documents = () => {
  return (
    <div>
      <Head>
        <title>ルール：全体</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>ルール：全体</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>



          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">

            <Viewer 
              fileUrl="/main.pdf"
              defaultScale={1.5}
            />
          </Worker>

      </div>
    </div>
  )
}

export default Documents