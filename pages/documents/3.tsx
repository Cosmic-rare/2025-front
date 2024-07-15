import { Card } from "@mui/material"
import Head from "next/head"

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

const Documents = () => {
  return (
    <div>
      <Head>
        <title>ルール：バドミントン</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>ルール：バドミントン</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24, lineHeight: 2.1 }}
        >
          <ul style={{ paddingLeft: 20 }}>
            <li>ダブルス→シングルス→ダブルスの計3ゲーム。</li>
            <li>場所:第2体育館</li>
            <li>15点1ゲーム(デュースなし)として計3ゲーム行い、2ゲーム先取で勝ちとする。なお、決勝以外は、2ゲーム終了時点で勝利チームが確定していた場合にも3ゲーム目を行う。決勝は2ゲーム終了時点で勝利チームが確定していた場合は3ゲーム目を行わない。</li>
            <li>ラケットは持参しても生徒会から貸し出すものを使用してもよい。</li>
            <li>サービスのルールをよく確認してくること。</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default Documents