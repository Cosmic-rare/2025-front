import { useState, useEffect } from "react"
import { APIget } from "@/util/api"
import { Card, Checkbox } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import getClass from "@/util/cl"
import Head from "next/head"
import { places } from "./schedule/[targetGrade]/[targetClass]"

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

export async function getStaticProps() {

  return {
    props: {
      
    },
    revalidate: 10
  };
}

const Index = ({ }: any) => {
  return (
    <div>
      <Head>
        <title>スポーツ大会2025公式</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>スポーツ大会2025</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24 }}
        >
          <h3>開催まで{Math.ceil((new Date(2025, 6, 15).valueOf() - Date.now()) / 1000 / 60 / 60 / 24)}日</h3>
          <p>開催日程は未定</p>
        </Card>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24 }}
        >
          <ul style={{ paddingLeft: 20 }}>
            <li>
              このアプリでは、「試合結果」の他に「自分のクラスのこれからの試合」や「要項・ルール」、「試合毎の優勝準優勝クラス」などを確認することができます
            </li>
            <li>
              生徒会では機械,プログラミング,オーディオ機材を弄れる80期生を募集しています
            </li>
            <li>
            アプリやデータの<a href="https://docs.google.com/forms/d/e/1FAIpQLSe8LzNwL_zPftBPcKGbGB_F70-q4U-B4k1sbI0RZqFvwhCpSw/viewform?usp=sf_link">不具合を報告</a>
            </li>
          </ul>
        </Card>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24 }}
        >
          <h3>種目毎優勝・準優勝クラス</h3>
          
        </Card>
      </div>
    </div>
  )
}

export default Index