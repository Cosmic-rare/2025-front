import React, { useState, useEffect } from "react"
import { APIget } from "@/util/api"
import { Card, Checkbox } from "@mui/material"
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material'
import getClass from "@/util/cl"
import Head from "next/head"
import { places } from "./schedule/[targetGrade]/[targetClass]"

type Sex = 'male' | 'female' | 'mix'
type EventKey = 'volleyball' | 'badminton' | 'dodgeball' | 'soccer' | 'esport'

interface RowDef {
  label: string        // 行見出し
  sex: Sex
  event: EventKey
}

const ROWS: RowDef[] = [
  { label: '男バレー', sex: 'male', event: 'volleyball' },
  { label: '女バレー', sex: 'female', event: 'volleyball' },
  { label: '男バド', sex: 'male', event: 'badminton' },
  { label: '女バド', sex: 'female', event: 'badminton' },
  { label: '男ドッジ', sex: 'male', event: 'dodgeball' },   // 3年は存在しない
  { label: '女ドッジ', sex: 'female', event: 'dodgeball' },
  { label: '男サッカー', sex: 'male', event: 'soccer' },    // 1・2年は存在しない
  { label: 'eスポーツ', sex: 'mix', event: 'esport' },
]

const GRADES = [1, 2, 3]

// ----------------- ヘルパ -----------------
const pickFinalMatch = (matches: any[]): any | undefined => {
  // 「決勝」を特定するロジックは環境に合わせて調整
  // 例: order が最小、または matches.length === 1 ならそれ
  return matches.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]
}

// const championText = (match: any | undefined): { text: string; status: 'none' | 'pending' | 'decided' } => {
//   if (!match) return { text: '—', status: 'none' }

//   // getClass() は利用可能前提
//   // @ts-ignore - 型が any の場合に備え
//   const g = getClass(match, match.event)
//   const champ: number | null = g?.[6] ?? null
//   const ruCandidates: number[] = g?.[5] ?? []

//   if (champ == null) return { text: '未決定', status: 'pending' }

//   const runnerUp = ruCandidates.find((c) => c !== champ) ?? '?'
//   return { text: `${champ}/${runnerUp}`, status: 'decided' }
// }

const championText = (match: any | undefined): {
  content: JSX.Element
  status: 'none' | 'pending' | 'decided'
} => {
  if (!match) return { content: <>—</>, status: 'none' }

  // @ts-ignore
  const g = getClass(match, match.event)

  /** g[6] は [number|null] 形式なので中身を取り出す */
  const champRaw = g?.[6]            // 例: [3] または [null]
  const champ: number | null =
    Array.isArray(champRaw) ? champRaw[0] ?? null : champRaw ?? null

  /** g[5] は [[a,b]] 形式の場合があるので 1 段フラット化 */
  const finalistsRaw = g?.[5] ?? []  // 例: [[3,5]]
  const finalists: number[] =
    Array.isArray(finalistsRaw[0]) ? finalistsRaw[0] : finalistsRaw

  if (champ == null) {
    /* 試合あり・未決定 → -組/-組 */
    return {
      status: 'pending',
      content: (
        <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: '1rem' }}>-</span>
          <span style={{ fontSize: '0.8rem', color: 'gray', marginRight: 4 }}>組</span>
          <span style={{ fontSize: '1rem', margin: '0 2px' }}>/</span>
          <span style={{ fontSize: '1rem' }}>-</span>
          <span style={{ fontSize: '0.8rem', color: 'gray' }}>組</span>
        </span>
      )
    }
  }

  /* 準優勝＝決勝2チームのうち champ 以外 */
  const runnerUp = finalists.find((c) => c !== champ) ?? finalists[0] ?? '-'

  return {
    status: 'decided',
    content: (
      <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{champ}</span>
        <span style={{ fontSize: '0.8rem', color: 'gray', marginRight: 4 }}>組</span>
        <span style={{ fontSize: '1rem', margin: '0 2px' }}>/</span>
        <span style={{ fontSize: '1.2rem' }}>{runnerUp}</span>
        <span style={{ fontSize: '0.8rem', color: 'gray' }}>組</span>
      </span>
    )
  }
}

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

export async function getStaticProps() {
  const res = await APIget("/get/3", () => { }, () => { })

  return {
    props: {
      data: res.data
    },
    revalidate: 10
  };
}

const Index = ({ data }: any) => {


  const grouped = React.useMemo(() => {
    const m = new Map<string, any[]>()
    data.forEach((match: any) => {
      const key = `${match.gread}-${match.event}-${match.sex}`
      const arr = m.get(key) ?? []
      arr.push(match)
      m.set(key, arr)
    })
    return m
  }, [data])

  const cellStyle = (status: string) =>
    status === 'none'
      ? { backgroundColor: '#f5f5f5', color: '#999' }
      : status === 'pending'
        ? { backgroundColor: '#fff' }
        : undefined



  return (
    <div>
      <Head>
        <title>スポ大info</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>スポ大info</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24 }}
        >
{/*           <h3>開催まで{Math.ceil((new Date(2025, 6, 15).valueOf() - Date.now()) / 1000 / 60 / 60 / 24)}日</h3> */}
          <p>雨晴日程で開催(1日目)</p>
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

          <TableContainer component={Paper} sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Table>
              {/* ---------------- ヘッダ ---------------- */}
              <TableHead>
                <TableRow>
                  <TableCell />
                  {GRADES.map((g) => (
                    <TableCell align="center" key={g}>{g}年</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* ---------------- 本体 ---------------- */}
              <TableBody>
                {ROWS.map((row) => (
                  <TableRow key={row.label} sx={{ height: 72 /* ← 高さ増やす */ }}>
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>{row.label}</TableCell> */}
                    <TableCell>{row.label}</TableCell>
                    {GRADES.map((grade) => {
                      const matches = grouped.get(`${grade}-${row.event}-${row.sex}`) ?? []
                      const finalMatch = pickFinalMatch(matches)
                      const { content, status } = championText(finalMatch)

                      return (
                        <TableCell
                          key={grade}
                          align="center"
                          sx={cellStyle(status)}
                        >
                          {content}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        </Card>
      </div>
    </div>
  )
}

export default Index
