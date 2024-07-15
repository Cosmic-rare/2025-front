import { Card } from "@mui/material"
import Head from "next/head"

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

const Documents = () => {
  return (
    <div>
      <Head>
        <title>ルール：バレーボール</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>ルール：バレーボール</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24, lineHeight: 2.1 }}
        >
          <ul style={{ paddingLeft: 20 }}>
            <li>1ゲーム出場人数:6名</li>
            <li>場所:第1体育館</li>
            <li>ネットの高さ:【女子】2m15cm 【男子】2m35cm</li>
            <li>13点1セット(デュースなし)として計3セット行い、2セット先取で勝ちとする。2セット終了時点で勝利チームが確定していた場合、3セット目は行わない。</li>
            <li>各セットどちらかのチームが7点を取った時点でテクニカルタイムアウトとする。この時と各セット終了後に水分補給を認める。</li>
            <li>その他のルールについてはステップアップ高校スポーツ(体育の教科書)のバレーボールのルールに則る</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default Documents