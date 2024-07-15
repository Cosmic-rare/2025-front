import { Card } from "@mui/material"
import Head from "next/head"

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

const Documents = () => {
  return (
    <div>
      <Head>
        <title>ルール：ドッジボール</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>ルール：ドッジボール</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Card
          sx={{ width: width }}
          style={{ backgroundColor: "#eae9eb", borderRadius: 9, padding: 24, lineHeight: 2.1 }}
        >
          <ul style={{ paddingLeft: 20 }}>
            <li>1ゲーム出場人数:5人(うち競技開始時外野1名)</li>
            <li>場所:校庭・ミニ校庭</li>
            <li>コート:9×18m(内野)</li>
            <li>1ゲーム5分。5分終了時点でどちらのチームも内野が残っている場合、外野の人数が少ないクラスの勝ちとする。外野の人数が同じ場合は、先に外野が増えていたほうのクラスの負けとする。いずれも外野が増えていない場合はじゃんけんで勝敗を決める。</li>
            <li>ゲームマッチ。2ゲーム先取で勝ちとする。なお、2ゲーム終了時点で勝利チームが確定していた場合、3ゲーム目は行わない。</li>
            <li>試合開始後、外野になった選手は内野に戻れない(試合開始時外野の人も同様)。</li>
            <li>外野に出たボールが選手以外の障害物によって相手の内野に入ってしまった場合は外野ボールとして扱う。</li>
            <li>アウトが出た場合は、アウトが出た側のチームのボールとして再開する。</li>
            <li>投げ方の規定は設けない。</li>
            <li>サイドラインからの投球は認めない。</li>
            <li>ラインを踏んで投球した場合は反則となり、相手の内野ボールとなる。</li>
            <li>
              また、反則はとらないが、スポーツマンシップに則り以下のことを守ること。
              <ul style={{ paddingLeft: 20 }}>
                <li>必要以上にパス回しをしない。</li>
                <li>必要以上に長い時間ボールを持ったままでいない。</li>
              </ul>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default Documents