import { Card } from "@mui/material"
import Head from "next/head"

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

const Documents = () => {
  return (
    <div>
      <Head>
        <title>ルール：サッカー</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>ルール：サッカー</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24, lineHeight: 2.1 }}
        >
          <ul style={{ paddingLeft: 20 }}>
            <li>1チーム出場人数:6名(うちGK1名)</li>
            <li>場所:校庭</li>
            <li>コート:55×35m(ゴールはサッカーのゴールを使用する。)</li>
            <li>10分ハーフ、ハーフタイム3分。</li>
            <li>各ハーフ5分で水分補給の時間をとる。</li>
            <li>オフサイドはとる。</li>
            <li>後半が終了した時点で同点の場合は4本目からサドンデスのPKとする。</li>
            <li>スパイクの着用は認めない。</li>
            <li>その他のルールについては日本サッカー協会競技規則に則る。</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default Documents