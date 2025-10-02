export type StatusFlag = "reviewed" | "in-revision" | "archived";

export interface SectionOverride {
  name?: string;
  summary?: string;
  source?: string;
  status?: StatusFlag;
  badges?: string[];
  order?: number;
}

export interface ChapterOverride {
  name?: string;
  summary?: string;
  order?: number;
  status?: StatusFlag;
  badges?: string[];
  sections?: Record<string, SectionOverride>;
}

export interface DepartmentOverride {
  name: string;
  shortName?: string;
  description?: string;
  order?: number;
  updatedAt?: string;
  status?: StatusFlag;
  badges?: string[];
  chapters?: Record<string, ChapterOverride>;
}

export const departmentOverrides: Record<string, DepartmentOverride> = {
  jin: {
    name: "腎臓",
    order: 60,
    chapters: {
      "1": {
        name: "腎の総論",
        sections: {
          "1": { name: "腎のオリエンテーション", summary: "" },
          "2": { name: "腎〜糸球体の解剖", summary: "" },
          "3": { name: "尿細管の解剖", summary: "" },
          "4": { name: "腎の生理", summary: "" },
          "5": { name: "尿検査", summary: "" },
          "6": { name: "血液浄化療法", summary: "" },
          "7": { name: "腎移植", summary: "" }
        }
      },
      "2": {
        name: "腎不全",
        sections: {
          "1": { name: "急性腎障害〈AKI〉", summary: "" },
          "2": { name: "慢性腎臓病〈CKD〉：概念", summary: "" },
          "3": { name: "慢性腎臓病〈CKD〉：治療", summary: "" },
          "4": { name: "尿毒症", summary: "" },
          "5": { name: "高カリウム血症の治療", summary: "" }
        }
      },
      "3": {
        name: "腎血管",
        sections: {
          "1": { name: "腎血管性高血圧概論", summary: "" },
          "2": { name: "動脈硬化による腎血管性高血圧", summary: "" },
          "3": { name: "線維筋性異形成〈FMD〉［⊿］", summary: "" },
          "4": { name: "腎硬化症", summary: "" }
        }
      },
      "4": {
        name: "糸球体",
        sections: {
          "1": { name: "糸球体腎炎概論", summary: "" },
          "2": { name: "急速進行性糸球体腎炎〈RPGN〉", summary: "" },
          "3": { name: "溶連菌感染後急性糸球体腎炎〈PSAGN〉", summary: "" },
          "4": { name: "IgA腎症", summary: "" },
          "5": { name: "膜性腎症〈MN〉", summary: "" },
          "6": { name: "膜性増殖性糸球体腎炎〈MPGN〉", summary: "" },
          "7": { name: "クリオグロブリン血症［⊿］", summary: "" },
          "8": { name: "微小変化群〈MC〉", summary: "" },
          "9": { name: "巣状分節性糸球体硬化症〈FSGS〉", summary: "" },
          "10": { name: "糖尿病と腎障害", summary: "" },
          "11": { name: "ループス腎炎", summary: "" },
          "12": { name: "アミロイド腎症", summary: "" }
        }
      },
      "5": {
        name: "尿細管・間質",
        sections: {
          "1": { name: "Fanconi症候群", summary: "" },
          "2": { name: "Bartter症候群と Gitelman症候群［⊿］", summary: "" },
          "3": { name: "Liddle症候群［⊿］", summary: "" },
          "4": { name: "尿細管性アシドーシス〈RTA〉", summary: "" },
          "5": { name: "間質性腎炎", summary: "" }
        }
      }
    }
  },
  naitai: {
    name: "内分泌・代謝",
    order: 90,
    chapters: {
      "1": {
        name: "内分泌代謝の総論",
        sections: {
          "1": { name: "内分泌代謝のオリエンテーション", summary: "" },
          "2": { name: "ホルモン概説", summary: "" },
          "3": { name: "成長ホルモン・プロラクチン・ソマトスタチン", summary: "" },
          "4": { name: "甲状腺ホルモン・副甲状腺ホルモン・活性化ビタミンD", summary: "" },
          "5": { name: "副腎ホルモン・性ホルモン", summary: "" },
          "6": { name: "糖代謝", summary: "" },
          "7": { name: "脂質代謝", summary: "" },
          "8": { name: "視床下部を中心とした障害をみる症候群［⊿］", summary: "" }
        }
      },
      "2": {
        name: "下垂体",
        sections: {
          "1": { name: "先端巨大症", summary: "" },
          "2": { name: "プロラクチノーマ", summary: "" },
          "3": { name: "Sheehan症候群", summary: "" },
          "4": { name: "リンパ球性下垂体炎［⊿］", summary: "" },
          "5": { name: "尿崩症", summary: "" },
          "6": { name: "ADH不適合分泌症候群〈SIADH〉", summary: "" }
        }
      },
      "3": {
        name: "甲状腺",
        sections: {
          "1": { name: "甲状腺機能概論", summary: "" },
          "2": { name: "Basedow病", summary: "" },
          "3": { name: "Plummer病", summary: "" },
          "4": { name: "無痛性甲状腺炎", summary: "" },
          "5": { name: "亜急性甲状腺炎", summary: "" },
          "6": { name: "慢性甲状腺炎〈橋本病〉", summary: "" },
          "7": { name: "甲状腺と昏睡", summary: "" },
          "8": { name: "甲状腺悪性腫瘍", summary: "" }
        }
      },
      "4": {
        name: "副甲状腺",
        sections: {
          "1": { name: "カルシウムの高低とその症候", summary: "" },
          "2": { name: "副甲状腺機能亢進症", summary: "" },
          "3": { name: "副甲状腺機能低下症", summary: "" },
          "4": { name: "多発性内分泌腫瘍症〈MEN〉［⊿］", summary: "" }
        }
      },
      "5": {
        name: "副腎",
        sections: {
          "1": { name: "Cushing症候群", summary: "" },
          "2": { name: "アルドステロン症", summary: "" },
          "3": { name: "Addison病", summary: "" },
          "4": { name: "副腎クリーゼ（急性副腎不全）", summary: "" },
          "5": { name: "褐色細胞腫", summary: "" }
        }
      },
      "6": {
        name: "糖代謝",
        sections: {
          "1": { name: "糖尿病 1：診断", summary: "" },
          "2": { name: "糖尿病 2：病型", summary: "" },
          "3": { name: "糖尿病 3：慢性合併症", summary: "" },
          "4": { name: "糖尿病 4：治療", summary: "" },
          "5": { name: "糖尿病性昏睡", summary: "" },
          "6": { name: "腎性尿糖", summary: "" },
          "7": { name: "低血糖", summary: "" },
          "8": { name: "インスリン自己免疫症候群［⊿］", summary: "" }
        }
      },
      "7": {
        name: "メタボリックシンドロームと生活指導",
        sections: {
          "1": { name: "メタボリックシンドローム", summary: "" },
          "2": { name: "高血圧症", summary: "" },
          "3": { name: "脂質異常症", summary: "" },
          "4": { name: "食事・生活指導の実際", summary: "" }
        }
      },
      "8": {
        name: "その他の代謝",
        sections: {
          "1": { name: "痛風", summary: "" },
          "2": { name: "偽痛風", summary: "" },
          "3": { name: "骨粗鬆症", summary: "" },
          "4": { name: "骨軟化症", summary: "" },
          "5": { name: "骨形成不全症［⊿］", summary: "" },
          "6": { name: "Wilson病", summary: "" },
          "7": { name: "Menkes病", summary: "" },
          "8": { name: "腸性肢端皮膚炎［⊿］", summary: "" },
          "9": { name: "ビタミン欠乏症", summary: "" },
          "10": { name: "脚気", summary: "" },
          "11": { name: "Wernicke脳症", summary: "" },
          "12": { name: "有機酸代謝異常［⊿］", summary: "" },
          "13": { name: "OTC欠損症［⊿］", summary: "" },
          "14": { name: "Fabry病［⊿］", summary: "" }
        }
      }
    }
  },
  blood: {
    name: "血液",
    order: 30,
    chapters: {
      "1": {
        name: "血液の総論",
        sections: {
          "1": { name: "血液のオリエンテーション", summary: "" },
          "2": { name: "血球分化", summary: "" },
          "3": { name: "鉄代謝", summary: "" },
          "4": { name: "ビタミン B12・葉酸", summary: "" },
          "5": { name: "血小板と凝固因子", summary: "" },
          "6": { name: "抗血小板薬・抗凝固薬・抗血栓薬", summary: "" },
          "7": { name: "輸血", summary: "" },
          "8": { name: "移植片対宿主病〈GVHD〉", summary: "" }
        }
      },
      "2": {
        name: "材料不足による貧血",
        sections: {
          "1": { name: "貧血概論", summary: "" },
          "2": { name: "鉄欠乏性貧血", summary: "" },
          "3": { name: "鉄芽球性貧血［⊿］", summary: "" },
          "4": { name: "サラセミア［⊿］", summary: "" },
          "5": { name: "慢性疾患に伴う二次性貧血〈ACD〉", summary: "" },
          "6": { name: "巨赤芽球性貧血", summary: "" }
        }
      },
      "3": {
        name: "崩壊による貧血",
        sections: {
          "1": { name: "溶血概論", summary: "" },
          "2": { name: "遺伝性球状赤血球症〈HS〉", summary: "" },
          "3": { name: "自己免疫性溶血性貧血〈AIHA〉", summary: "" },
          "4": { name: "発作性夜間ヘモグロビン尿症〈PNH〉", summary: "" },
          "5": { name: "PK欠損症と G-6-PD欠損症［⊿］", summary: "" },
          "6": { name: "骨髄異形成症候群〈MDS〉", summary: "" },
          "7": { name: "血球貪食症候群〈HPS〉［⊿］", summary: "" }
        }
      },
      "4": {
        name: "造血低下による貧血",
        sections: {
          "1": { name: "赤芽球癆", summary: "" },
          "2": { name: "ヘモクロマトーシス［⊿］", summary: "" },
          "3": { name: "再生不良性貧血〈AA〉", summary: "" },
          "4": { name: "原発性骨髄線維症〈PMF〉", summary: "" },
          "5": { name: "無顆粒球症［⊿］", summary: "" }
        }
      },
      "5": {
        name: "血球の過剰産生",
        sections: {
          "1": { name: "白血病概論", summary: "" },
          "2": { name: "急性骨髄性白血病〈AML〉と急性リンパ性白血病〈ALL〉", summary: "" },
          "3": { name: "慢性骨髄性白血病〈CML〉", summary: "" },
          "4": { name: "慢性リンパ性白血病〈CLL〉", summary: "" },
          "5": { name: "成人 T細胞白血病〈ATL〉", summary: "" },
          "6": { name: "赤血球増加症", summary: "" },
          "7": { name: "本態性血小板血症〈ET〉", summary: "" }
        }
      },
      "6": {
        name: "リンパ系疾患",
        sections: {
          "1": { name: "結核性リンパ節炎［⊿］", summary: "" },
          "2": { name: "亜急性壊死性リンパ節炎〈菊池病〉［⊿］", summary: "" },
          "3": { name: "悪性リンパ腫", summary: "" }
        }
      },
      "7": {
        name: "蛋白増殖疾患",
        sections: {
          "1": { name: "多発性骨髄腫〈MM〉", summary: "" },
          "2": { name: "原発性マクログロブリン血症〈WM〉［⊿］", summary: "" },
          "3": { name: "MGUS［⊿］", summary: "" }
        }
      },
      "8": {
        name: "1次止血のみの障害",
        sections: {
          "1": { name: "免疫性血小板減少性紫斑病〈ITP〉", summary: "" },
          "2": { name: "血栓性血小板減少性紫斑病〈TTP〉", summary: "" },
          "3": { name: "溶血性尿毒症症候群〈HUS〉", summary: "" },
          "4": { name: "血栓性微小血管障害症〈TMA〉［⊿］", summary: "" },
          "5": { name: "血小板無力症〈Glanzmann病〉と Bernard-Soulier症候群［⊿］", summary: "" }
        }
      },
      "9": {
        name: "2次止血の障害",
        sections: {
          "1": { name: "vonWillebrand病〈vWD〉［⊿］", summary: "" },
          "2": { name: "血友病", summary: "" },
          "3": { name: "播種性血管内凝固〈DIC〉", summary: "" },
          "4": { name: "血小板・凝固疾患のまとめ", summary: "" }
        }
      }
    }
  },
  immune: {
    name: "免疫・リウマチ",
    order: 40,
    chapters: {
      "1": {
        name: "免疫の総論",
        sections: {
          "1": { name: "免疫のオリエンテーション", summary: "" },
          "2": { name: "免疫応答に関与する細胞", summary: "" },
          "3": { name: "免疫応答の分類", summary: "" },
          "4": { name: "ナイーブT細胞の分化とサイトカイン", summary: "" },
          "5": { name: "抗体・補体", summary: "" },
          "6": { name: "免疫の治療［⊿］", summary: "" }
        }
      },
      "2": {
        name: "アレルギー",
        sections: {
          "1": { name: "I型アレルギー", summary: "" },
          "2": { name: "II型アレルギー", summary: "" },
          "3": { name: "III型アレルギー", summary: "" },
          "4": { name: "IV型アレルギー", summary: "" },
          "5": { name: "アレルギー分類のまとめ", summary: "" },
          "6": { name: "食物アレルギー［⊿］", summary: "" },
          "7": { name: "食物依存性運動誘発アナフィラキシー〈FDEIA〉", summary: "" },
          "8": { name: "血管性浮腫〈Quincke浮腫〉［⊿］", summary: "" }
        }
      },
      "3": {
        name: "関節疾患",
        sections: {
          "1": { name: "関節リウマチ〈RA〉", summary: "" },
          "2": { name: "シェーグレン症候群〈SS〉", summary: "" },
          "3": { name: "線維筋痛症", summary: "" },
          "4": { name: "成人Still病", summary: "" },
          "5": { name: "若年性特発性関節炎〈JIA〉", summary: "" },
          "6": { name: "リウマチ熱［⊿］", summary: "" },
          "7": { name: "強直性脊椎炎［⊿］", summary: "" },
          "8": { name: "反応性関節炎〈Reiter症候群〉［⊿］", summary: "" }
        }
      },
      "4": {
        name: "全身疾患",
        sections: {
          "1": { name: "全身性エリテマトーデス〈SLE〉", summary: "" },
          "2": { name: "抗リン脂質抗体症候群〈APS〉", summary: "" },
          "3": { name: "全身性硬化症〈SSc〉（強皮症）", summary: "" },
          "4": { name: "多発性筋炎・皮膚筋炎〈PM・DM〉", summary: "" },
          "5": { name: "混合性結合組織病〈MCTD〉", summary: "" },
          "6": { name: "IgG4関連疾患〈IgG4RD〉［⊿］", summary: "" }
        }
      },
      "5": {
        name: "血管炎",
        sections: {
          "1": { name: "血管炎概論", summary: "" },
          "2": { name: "顕微鏡的多発血管炎〈MPA〉", summary: "" },
          "3": { name: "好酸球性多発血管炎性肉芽腫症〈EGPA〉（Churg-Strauss症候群）", summary: "" },
          "4": { name: "多発血管炎性肉芽腫症〈GPA〉（Wegener症候群）", summary: "" },
          "5": { name: "ベーチェット病", summary: "" },
          "6": { name: "サルコイドーシス", summary: "" },
          "7": { name: "高安動脈炎〈大動脈炎症候群〉", summary: "" },
          "8": { name: "巨細胞性動脈炎〈側頭動脈炎〉［⊿］", summary: "" },
          "9": { name: "リウマチ性多発筋痛症〈PMR〉［⊿］", summary: "" }
        }
      }
    }
  },
  infection: {
    name: "感染症",
    order: 50,
    chapters: {
      "1": {
        name: "感染症の総論",
        sections: {
          "1": { name: "感染症のオリエンテーション", summary: "" },
          "2": { name: "病原体の分類", summary: "" },
          "3": { name: "感染の経路", summary: "" },
          "4": { name: "感染の種類", summary: "" },
          "5": { name: "感染症の予防", summary: "" },
          "6": { name: "感染症の検査（染色）", summary: "" },
          "7": { name: "感染症の治療薬", summary: "" },
          "8": { name: "感染症の広がり", summary: "" },
          "9": { name: "感染症の評価", summary: "" },
          "10": { name: "抗菌薬使用の注意点", summary: "" }
        }
      },
      "2": {
        name: "一般細菌",
        sections: {
          "1": { name: "肺炎概論", summary: "" },
          "2": { name: "市中肺炎の入院基準", summary: "" },
          "3": { name: "ブドウ球菌", summary: "" },
          "4": { name: "連鎖球菌", summary: "" },
          "5": { name: "肺炎球菌", summary: "" },
          "6": { name: "クレブシエラ〈肺炎桿菌〉", summary: "" },
          "7": { name: "インフルエンザ桿菌", summary: "" },
          "8": { name: "モラクセラ", summary: "" },
          "9": { name: "髄膜炎菌", summary: "" },
          "10": { name: "リステリア", summary: "" },
          "11": { name: "大腸菌・コレラ・赤痢菌・腸炎ビブリオ", summary: "" },
          "12": { name: "カンピロバクター・サルモネラ・チフス", summary: "" },
          "13": { name: "バクテロイデス［⊿］", summary: "" }
        }
      },
      "3": {
        name: "抗酸菌",
        sections: {
          "1": { name: "結核 1：結核菌概論", summary: "" },
          "2": { name: "結核 2：肺結核の診断", summary: "" },
          "3": { name: "結核 3：肺結核の治療と対応", summary: "" },
          "4": { name: "非結核性抗酸菌", summary: "" }
        }
      },
      "4": {
        name: "特殊細菌",
        sections: {
          "1": { name: "マイコプラズマ", summary: "" },
          "2": { name: "百日咳", summary: "" },
          "3": { name: "レジオネラ", summary: "" },
          "4": { name: "クラミジア", summary: "" },
          "5": { name: "リケッチア", summary: "" },
          "6": { name: "スピロヘータ 1：梅毒", summary: "" },
          "7": { name: "スピロヘータ 2：レプトスピラ症〈Weil病〉", summary: "" },
          "8": { name: "スピロヘータ 3：ライム病", summary: "" },
          "9": { name: "クロストリジウム 1：破傷風", summary: "" },
          "10": { name: "クロストリジウム 2：ガス壊疽", summary: "" },
          "11": { name: "クロストリジウム 3：ボツリヌス中毒", summary: "" },
          "12": { name: "その他の細菌", summary: "" }
        }
      },
      "5": {
        name: "HIVと日和見感染",
        sections: {
          "1": { name: "HIV・AIDS", summary: "" },
          "2": { name: "ニューモシスチス", summary: "" },
          "3": { name: "カンジダ", summary: "" },
          "4": { name: "ヘルペスウイルス 5：サイトメガロウイルス〈CMV〉", summary: "" },
          "5": { name: "クリプトコッカス", summary: "" },
          "6": { name: "アスペルギルス 1：日和見感染するもの", summary: "" },
          "7": { name: "アスペルギルス 2：アレルギー性気管支肺アスペルギルス症〈ABPA〉", summary: "" }
        }
      },
      "6": {
        name: "ウイルス",
        sections: {
          "1": { name: "インフルエンザウイルス", summary: "" },
          "2": { name: "Reye症候群", summary: "" },
          "3": { name: "ヘルペスウイルス 1・2：単純ヘルペスウイルス〈HSV〉", summary: "" },
          "4": { name: "ヘルペスウイルス 3：水痘・帯状疱疹ウイルス〈VZV〉", summary: "" },
          "5": { name: "ヘルペスウイルス 4：EBウイルス〈EBV〉", summary: "" },
          "6": { name: "アデノウイルス", summary: "" },
          "7": { name: "エボラ・デング・ジカウイルス", summary: "" },
          "8": { name: "新型コロナウイルス感染症〈COVID-19〉", summary: "" },
          "9": { name: "その他のウイルス［⊿］", summary: "" }
        }
      },
      "7": {
        name: "寄生虫",
        sections: {
          "1": { name: "マラリア", summary: "" },
          "2": { name: "アメーバ赤痢", summary: "" },
          "3": { name: "ランブル鞭毛虫［⊿］", summary: "" },
          "4": { name: "アニサキス", summary: "" },
          "5": { name: "吸虫", summary: "" },
          "6": { name: "疥癬", summary: "" },
          "7": { name: "鉤条虫［⊿］", summary: "" },
          "8": { name: "その他の寄生虫", summary: "" }
        }
      }
    }
  },
  kokyu: {
    name: "呼吸器",
    description: "呼吸器疾患の診断と治療",
    order: 10,
    chapters: {
      "1": {
        name: "呼吸器の総論",
        sections: {
          "1": { name: "呼吸器のオリエンテーション", summary: "" },
          "2": { name: "呼吸器の解剖 1：全体像", summary: "" },
          "3": { name: "呼吸器の解剖 2：気道～肺胞", summary: "" },
          "4": { name: "呼吸器の生理 1：呼吸運動と酸素動態の指標", summary: "" },
          "5": { name: "呼吸器の生理 2：酸素解離曲線と酸素濃度", summary: "" },
          "6": { name: "呼吸器の検査 1：聴診", summary: "" },
          "7": { name: "呼吸器の検査 2：スパイログラム", summary: "" },
          "8": { name: "呼吸器の検査 3：flow-volumeとclosing-volume", summary: "" },
          "9": { name: "呼吸器の検査 4：胸部エックス線", summary: "" },
          "10": { name: "呼吸器の検査 5：気管支鏡検査", summary: "" },
          "11": { name: "呼吸器の治療 1：在宅酸素療法〈HOT〉", summary: "" },
          "12": { name: "呼吸器の治療 2：呼吸リハビリテーション", summary: "" },
          "13": { name: "呼吸器の治療 3：人工呼吸", summary: "" },
          "14": { name: "呼吸器の治療 4：肺移植", summary: "" },
          "15": { name: "呼吸不全", summary: "" }
        }
      },
      "2": {
        name: "機能性呼吸器疾患",
        sections: {
          "1": { name: "CO₂ナルコーシス", summary: "" },
          "2": { name: "過換気症候群", summary: "" },
          "3": { name: "睡眠時無呼吸症候群〈SAS〉", summary: "" }
        }
      },
      "3": {
        name: "アレルギー性呼吸器疾患",
        sections: {
          "1": { name: "気管支喘息", summary: "" },
          "2": { name: "アスピリン喘息", summary: "" },
          "3": { name: "好酸球肺浸潤症候群", summary: "" },
          "4": { name: "Goodpasture症候群", summary: "" },
          "5": { name: "過敏性肺炎", summary: "" }
        }
      },
      "4": {
        name: "気道障害",
        sections: {
          "1": { name: "気管支拡張症", summary: "" },
          "2": { name: "びまん性汎細気管支炎〈DPB〉", summary: "" },
          "3": { name: "慢性閉塞性肺疾患〈COPD〉", summary: "" },
          "4": { name: "肺リンパ脈管筋腫症〈LAM〉", summary: "" },
          "5": { name: "肺胞蛋白症〈PAP〉", summary: "" },
          "6": { name: "急性気管支炎", summary: "" }
        }
      },
      "5": {
        name: "肺間質障害",
        sections: {
          "1": { name: "特発性間質性肺炎〈IIPs〉", summary: "" },
          "2": { name: "続発性間質性肺炎", summary: "" },
          "3": { name: "じん肺", summary: "" }
        }
      },
      "6": {
        name: "肺循環障害",
        sections: {
          "1": { name: "肺動静脈瘻〈PAVF〉［⊿］", summary: "" },
          "2": { name: "肺血栓塞栓症〈PE〉", summary: "" },
          "3": { name: "肺高血圧症〈PHT〉", summary: "" },
          "4": { name: "肺水腫", summary: "" },
          "5": { name: "急性呼吸窮迫症候群〈ARDS〉", summary: "" },
          "6": { name: "肺分画症［⊿］", summary: "" }
        }
      },
      "7": {
        name: "胸腔・胸膜",
        sections: {
          "1": { name: "気胸", summary: "" },
          "2": { name: "胸水", summary: "" },
          "3": { name: "膿胸", summary: "" },
          "4": { name: "乳び胸［⊿］", summary: "" },
          "5": { name: "胸膜炎・縦隔炎・縦隔気腫", summary: "" },
          "6": { name: "無気肺", summary: "" },
          "7": { name: "胸膜プラーク", summary: "" },
          "8": { name: "胸膜中皮腫", summary: "" }
        }
      },
      "8": {
        name: "呼吸器腫瘍",
        sections: {
          "1": { name: "原発性肺癌 1：概論", summary: "" },
          "2": { name: "原発性肺癌 2：分類", summary: "" },
          "3": { name: "原発性肺癌 3：治療", summary: "" },
          "4": { name: "Pancoast症候群", summary: "" },
          "5": { name: "上大静脈症候群", summary: "" },
          "6": { name: "肺嚢胞と肺膿瘍〈肺化膿症〉", summary: "" },
          "7": { name: "縦隔腫瘍", summary: "" }
        }
      },
      "9": {
        name: "乳腺疾患",
        sections: {
          "1": { name: "乳腺炎", summary: "" },
          "2": { name: "乳腺症", summary: "" },
          "3": { name: "乳腺線維腺腫", summary: "" },
          "4": { name: "乳腺葉状腫瘍", summary: "" },
          "5": { name: "乳腺乳管内乳頭腫", summary: "" },
          "6": { name: "乳房 Paget病", summary: "" },
          "7": { name: "乳癌", summary: "" }
        }
      }
    }
  },
  junkan: {
    name: "循環器",
    description: "循環器疾患の病態生理と治療",
    order: 20,
    chapters: {
      "1": {
        name: "循環器の総論",
        sections: {
          "1": { name: "循環器のオリエンテーション", summary: "" },
          "2": { name: "循環器の解剖 1：全体像と弁", summary: "" },
          "3": { name: "循環器の解剖 2：冠血流", summary: "" },
          "4": { name: "循環器の解剖 3：刺激伝導系と心膜", summary: "" },
          "5": { name: "循環器の解剖 4：大循環（動脈系）", summary: "" },
          "6": { name: "循環器の解剖 5：大循環（静脈系）", summary: "" },
          "7": { name: "循環器の生理 1：心腔の圧", summary: "" },
          "8": { name: "循環器の生理 2：心音と心周期", summary: "" },
          "9": { name: "循環器の生理 3：心拍出と関連指標", summary: "" },
          "10": { name: "循環器の検査 1：胸部エックス線", summary: "" },
          "11": { name: "循環器の検査 2：心エコー", summary: "" },
          "12": { name: "循環器の検査 3：心電図", summary: "" },
          "13": { name: "循環器の治療 1：IABP", summary: "" },
          "14": { name: "循環器の治療 2：人工心肺［⊿］", summary: "" },
          "15": { name: "循環器の治療 3：心移植", summary: "" }
        }
      },
      "2": {
        name: "心不全",
        sections: {
          "1": { name: "心不全の定義と分類", summary: "" },
          "2": { name: "心不全の評価", summary: "" },
          "3": { name: "心不全の治療", summary: "" }
        }
      },
      "3": {
        name: "不整脈",
        sections: {
          "1": { name: "期外収縮", summary: "" },
          "2": { name: "発作性上室性頻拍〈PSVT〉", summary: "" },
          "3": { name: "心房粗動〈AFL〉", summary: "" },
          "4": { name: "心房細動〈AF〉", summary: "" },
          "5": { name: "心室頻拍〈VT〉", summary: "" },
          "6": { name: "心室細動〈VF〉", summary: "" },
          "7": { name: "WPW症候群", summary: "" },
          "8": { name: "Brugada症候群", summary: "" },
          "9": { name: "QT延長症候群", summary: "" },
          "10": { name: "房室ブロック〈AVB〉", summary: "" },
          "11": { name: "洞不全症候群〈SSS〉", summary: "" }
        }
      },
      "4": {
        name: "虚血性心疾患",
        sections: {
          "1": { name: "虚血性心疾患概論", summary: "" },
          "2": { name: "労作性狭心症", summary: "" },
          "3": { name: "冠攣縮性（異型）狭心症", summary: "" },
          "4": { name: "急性冠症候群〈ACS〉1：不安定狭心症〈UAP〉", summary: "" },
          "5": { name: "急性冠症候群〈ACS〉2：急性心筋梗塞〈AMI〉", summary: "" },
          "6": { name: "AMIの合併症", summary: "" }
        }
      },
      "5": {
        name: "弁膜症",
        sections: {
          "1": { name: "弁膜症概論", summary: "" },
          "2": { name: "僧帽弁狭窄症〈MS〉", summary: "" },
          "3": { name: "僧帽弁閉鎖不全症〈MR〉と僧帽弁逸脱症〈MVP〉", summary: "" },
          "4": { name: "大動脈弁狭窄症〈AS〉", summary: "" },
          "5": { name: "大動脈弁閉鎖不全症〈AR〉", summary: "" }
        }
      },
      "6": {
        name: "心膜疾患",
        sections: {
          "1": { name: "感染性心内膜炎〈IE〉", summary: "" },
          "2": { name: "心臓腫瘍と心臓粘液腫", summary: "" },
          "3": { name: "急性心膜炎", summary: "" },
          "4": { name: "心タンポナーデ", summary: "" },
          "5": { name: "収縮性心膜炎", summary: "" }
        }
      },
      "7": {
        name: "心筋疾患",
        sections: {
          "1": { name: "拡張型心筋症〈DCM〉", summary: "" },
          "2": { name: "肥大型心筋症〈HCM〉", summary: "" },
          "3": { name: "たこつぼ型心筋症［⊿］", summary: "" },
          "4": { name: "心アミロイドーシス", summary: "" },
          "5": { name: "急性心筋炎", summary: "" }
        }
      },
      "8": {
        name: "血管疾患",
        sections: {
          "1": { name: "大動脈瘤", summary: "" },
          "2": { name: "大動脈解離", summary: "" },
          "3": { name: "閉塞性動脈硬化症〈ASO〉", summary: "" },
          "4": { name: "閉塞性血栓性血管炎〈TAO〉（Buerger病）", summary: "" },
          "5": { name: "急性動脈閉塞症", summary: "" },
          "6": { name: "深部静脈血栓〈DVT〉", summary: "" },
          "7": { name: "下肢静脈瘤", summary: "" }
        }
      }
    }
  },
  syoukakan: {
    name: "消化管",
    order: 80,
    chapters: {
      "1": {
        name: "消化管の総論",
        sections: {
          "1": { name: "消化管のオリエンテーション", summary: "" },
          "2": { name: "消化管の解剖生理概論", summary: "" },
          "3": { name: "食道～十二指腸", summary: "" },
          "4": { name: "小腸・大腸", summary: "" },
          "5": { name: "肛門", summary: "" },
          "6": { name: "消化器の動脈", summary: "" },
          "7": { name: "門脈", summary: "" },
          "8": { name: "消化器の外分泌（酵素）", summary: "" },
          "9": { name: "消化器の内分泌（消化管ホルモン）", summary: "" },
          "10": { name: "便秘", summary: "" },
          "11": { name: "消化管内視鏡検査", summary: "" },
          "12": { name: "胃瘻", summary: "" },
          "13": { name: "人工肛門〈消化管ストーマ〉", summary: "" }
        }
      },
      "2": {
        name: "食道",
        sections: {
          "1": { name: "食道アカラシア［⊿］", summary: "" },
          "2": { name: "胃食道逆流症〈GERD〉（逆流性食道炎）", summary: "" },
          "3": { name: "Mallory-Weiss症候群", summary: "" },
          "4": { name: "Boerhaave症候群〈特発性食道破裂〉", summary: "" },
          "5": { name: "食道・胃静脈瘤", summary: "" },
          "6": { name: "食道癌", summary: "" }
        }
      },
      "3": {
        name: "胃",
        sections: {
          "1": { name: "機能性ディスペプシア〈FD〉", summary: "" },
          "2": { name: "ヘリコバクター・ピロリ菌", summary: "" },
          "3": { name: "急性胃粘膜病変〈AGML〉", summary: "" },
          "4": { name: "慢性胃炎（萎縮性胃炎）", summary: "" },
          "5": { name: "胃・十二指腸潰瘍", summary: "" },
          "6": { name: "胃粘膜下腫瘍", summary: "" },
          "7": { name: "胃ポリープ", summary: "" },
          "8": { name: "胃癌 1：概論と検査", summary: "" },
          "9": { name: "胃癌 2：治療と転移", summary: "" },
          "10": { name: "胃切除後の合併症", summary: "" },
          "11": { name: "メネトリエ病［⊿］", summary: "" }
        }
      },
      "4": {
        name: "腸の炎症",
        sections: {
          "1": { name: "過敏性腸症候群〈IBS〉", summary: "" },
          "2": { name: "Crohn病〈CD〉", summary: "" },
          "3": { name: "潰瘍性大腸炎〈UC〉", summary: "" },
          "4": { name: "急性虫垂炎", summary: "" },
          "5": { name: "偽膜性腸炎", summary: "" },
          "6": { name: "憩室炎", summary: "" },
          "7": { name: "Meckel憩室［⊿］", summary: "" },
          "8": { name: "腸結核［⊿］", summary: "" }
        }
      },
      "5": {
        name: "腸の閉塞と虚血・腫瘍",
        sections: {
          "1": { name: "腸閉塞〈イレウス〉", summary: "" },
          "2": { name: "上腸間膜動脈症候群［⊿］", summary: "" },
          "3": { name: "虚血性大腸炎", summary: "" },
          "4": { name: "腸間膜動脈閉塞症", summary: "" },
          "5": { name: "大腸ポリープ", summary: "" },
          "6": { name: "大腸癌", summary: "" },
          "7": { name: "大腸癌の転移", summary: "" },
          "8": { name: "消化管カルチノイド（NET）", summary: "" }
        }
      },
      "6": {
        name: "肛門・横隔膜・腹膜・腹壁",
        sections: {
          "1": { name: "痔核", summary: "" },
          "2": { name: "肛門周囲膿瘍［⊿］", summary: "" },
          "3": { name: "痔瘻", summary: "" },
          "4": { name: "裂肛［⊿］", summary: "" },
          "5": { name: "直腸脱・肛門脱［⊿］", summary: "" },
          "6": { name: "肛門（管）癌［⊿］", summary: "" },
          "7": { name: "横隔膜ヘルニア［⊿］", summary: "" },
          "8": { name: "鼠径ヘルニア", summary: "" },
          "9": { name: "大腿ヘルニア・閉鎖孔ヘルニア［⊿］", summary: "" },
          "10": { name: "その他のヘルニア［⊿］", summary: "" },
          "11": { name: "腹膜偽粘液腫［⊿］", summary: "" },
          "12": { name: "腹壁血腫［⊿］", summary: "" },
          "13": { name: "デスモイド［⊿］", summary: "" }
        }
      }
    }
  },
  kantansui: {
    name: "肝胆膵",
    order: 70,
    chapters: {
      "1": {
        name: "肝胆膵の総論",
        sections: {
          "1": { name: "肝胆膵のオリエンテーション", summary: "" },
          "2": { name: "肝の解剖 1：マクロ", summary: "" },
          "3": { name: "肝の解剖 2：ミクロ", summary: "" },
          "4": { name: "肝の生理", summary: "" },
          "5": { name: "肝の画像検査", summary: "" },
          "6": { name: "肝移植［⊿］", summary: "" },
          "7": { name: "胆の解剖生理", summary: "" },
          "8": { name: "ビリルビン代謝と閉塞性黄疸", summary: "" },
          "9": { name: "膵の解剖", summary: "" },
          "10": { name: "膵の外分泌と内分泌", summary: "" }
        }
      },
      "2": {
        name: "肝の炎症",
        sections: {
          "1": { name: "急性肝炎と慢性肝炎", summary: "" },
          "2": { name: "ウイルス性肝炎 1：A型とE型", summary: "" },
          "3": { name: "ウイルス性肝炎 2：B型とD型", summary: "" },
          "4": { name: "ウイルス性肝炎 3：C型", summary: "" },
          "5": { name: "劇症肝炎", summary: "" },
          "6": { name: "脂肪肝", summary: "" },
          "7": { name: "アルコール性肝障害", summary: "" },
          "8": { name: "自己免疫性肝炎〈AIH〉", summary: "" },
          "9": { name: "原発性胆汁性胆管炎〈PBC〉", summary: "" },
          "10": { name: "門脈圧亢進症［⊿］", summary: "" },
          "11": { name: "肝硬変 1：病態", summary: "" },
          "12": { name: "肝硬変 2：概論・検査・治療", summary: "" }
        }
      },
      "3": {
        name: "肝の腫瘍",
        sections: {
          "1": { name: "肝細胞癌〈HCC〉の診断・検査・評価", summary: "" },
          "2": { name: "肝細胞癌〈HCC〉の治療", summary: "" },
          "3": { name: "転移性肝癌", summary: "" },
          "4": { name: "肝血管腫［⊿］", summary: "" },
          "5": { name: "肝嚢胞［⊿］", summary: "" },
          "6": { name: "肝膿瘍", summary: "" }
        }
      },
      "4": {
        name: "胆",
        sections: {
          "1": { name: "体質性黄疸［⊿］", summary: "" },
          "2": { name: "胆道系に特徴的な徴候・症候群", summary: "" },
          "3": { name: "胆石症", summary: "" },
          "4": { name: "胆嚢炎・胆管炎 1：概論", summary: "" },
          "5": { name: "胆嚢炎・胆管炎 2：検査と治療", summary: "" },
          "6": { name: "原発性硬化性胆管炎〈PSC〉", summary: "" },
          "7": { name: "胆嚢捻転症［⊿］", summary: "" },
          "8": { name: "胆嚢腺筋腫症［⊿］", summary: "" },
          "9": { name: "胆嚢癌と胆嚢ポリープ", summary: "" },
          "10": { name: "胆管癌", summary: "" },
          "11": { name: "十二指腸乳頭部癌［⊿］", summary: "" },
          "12": { name: "肝門部胆管癌［⊿］", summary: "" }
        }
      },
      "5": {
        name: "膵",
        sections: {
          "1": { name: "急性膵炎", summary: "" },
          "2": { name: "慢性膵炎", summary: "" },
          "3": { name: "自己免疫性膵炎", summary: "" },
          "4": { name: "膵内分泌腫瘍［⊿］", summary: "" },
          "5": { name: "膵嚢胞", summary: "" },
          "6": { name: "膵癌", summary: "" }
        }
      }
    }
  },
  shinkei: {
    name: "神経",
    order: 100,
    chapters: {
      "1": {
        name: "神経の総論",
        sections: {
          "1": { name: "神経のオリエンテーション", summary: "" },
          "2": { name: "脳の解剖 1：マクロ", summary: "" },
          "3": { name: "脳の解剖 2：ミクロ", summary: "" },
          "4": { name: "脳のCT・MRI", summary: "" },
          "5": { name: "脳波", summary: "" },
          "6": { name: "脳室", summary: "" },
          "7": { name: "脳血管", summary: "" },
          "8": { name: "伝導路 1：錐体路〈皮質脊髄路〉", summary: "" },
          "9": { name: "伝導路 2：脱力の原因部位", summary: "" },
          "10": { name: "伝導路 3：温痛覚と深部覚", summary: "" },
          "11": { name: "伝導路 4：脊髄断面", summary: "" },
          "12": { name: "脳神経", summary: "" },
          "13": { name: "自律神経", summary: "" },
          "14": { name: "高次機能とその障害", summary: "" }
        }
      },
      "2": {
        name: "脳血管障害",
        sections: {
          "1": { name: "脳出血", summary: "" },
          "2": { name: "くも膜下出血〈SAH〉", summary: "" },
          "3": { name: "脳動静脈奇形〈AVM〉［⊿］", summary: "" },
          "4": { name: "もやもや病〈Willis動脈輪閉塞症〉", summary: "" },
          "5": { name: "内頸動脈海綿静脈洞瘻〈CCF〉［⊿］", summary: "" },
          "6": { name: "一過性脳虚血発作〈TIA〉", summary: "" },
          "7": { name: "脳梗塞", summary: "" },
          "8": { name: "Wallenberg症候群〈延髄外側症候群〉", summary: "" },
          "9": { name: "MLF症候群［⊿］", summary: "" }
        }
      },
      "3": {
        name: "認知症",
        sections: {
          "1": { name: "Alzheimer型認知症〈AD〉", summary: "" },
          "2": { name: "脳血管性認知症", summary: "" },
          "3": { name: "前頭側頭型認知症〈FTD〉（Pick病）［⊿］", summary: "" },
          "4": { name: "Lewy小体型認知症〈DLB〉", summary: "" },
          "5": { name: "正常圧水頭症〈NPH〉", summary: "" }
        }
      },
      "4": {
        name: "錐体外路障害",
        sections: {
          "1": { name: "Parkinson病 1：概論", summary: "" },
          "2": { name: "Parkinson病 2：治療", summary: "" },
          "3": { name: "本態性振戦［⊿］", summary: "" },
          "4": { name: "Huntington病〈HD〉［⊿］", summary: "" },
          "5": { name: "大脳皮質基底核変性症〈CBD〉［⊿］", summary: "" },
          "6": { name: "進行性核上性麻痺〈PSP〉［⊿］", summary: "" },
          "7": { name: "ジストニア", summary: "" },
          "8": { name: "脊髄小脳変性症〈SCD〉", summary: "" }
        }
      },
      "5": {
        name: "脱髄疾患",
        sections: {
          "1": { name: "多発性硬化症〈MS〉", summary: "" },
          "2": { name: "視神経脊髄炎〈NMO〉［⊿］", summary: "" },
          "3": { name: "急性散在性脳脊髄炎〈ADEM〉［⊿］", summary: "" },
          "4": { name: "副腎白質ジストロフィー〈ALD〉［⊿］", summary: "" }
        }
      },
      "6": {
        name: "脊髄障害",
        sections: {
          "1": { name: "前脊髄動脈症候群［⊿］", summary: "" },
          "2": { name: "神経梅毒と脊髄癆［⊿］", summary: "" },
          "3": { name: "亜急性連合性脊髄変性症〈SCDC〉［⊿］", summary: "" },
          "4": { name: "脊髄空洞症［⊿］", summary: "" },
          "5": { name: "ブラウン・セカール症候群〈BSS〉［⊿］", summary: "" },
          "6": { name: "筋萎縮性側索硬化症〈ALS〉", summary: "" },
          "7": { name: "球脊髄性筋萎縮症〈SBMA〉［⊿］", summary: "" }
        }
      },
      "7": {
        name: "末梢神経障害",
        sections: {
          "1": { name: "末梢神経障害概論", summary: "" },
          "2": { name: "ギラン・バレー症候群〈GBS〉", summary: "" },
          "3": { name: "慢性炎症性脱髄性多発根神経炎〈CIDP〉［⊿］", summary: "" },
          "4": { name: "Charcot-Marie-Tooth病〈CMT〉［⊿］", summary: "" },
          "5": { name: "家族性アミロイドポリニューロパチー〈FAP〉［⊿］", summary: "" },
          "6": { name: "続発性ニューロパチー（糖尿病など）", summary: "" }
        }
      },
      "8": {
        name: "神経筋接合部・筋障害",
        sections: {
          "1": { name: "重症筋無力症〈MG〉", summary: "" },
          "2": { name: "Lambert-Eaton症候群［⊿］", summary: "" },
          "3": { name: "筋ジストロフィー概論", summary: "" },
          "4": { name: "Duchenne型筋ジストロフィー", summary: "" },
          "5": { name: "筋強直性ジストロフィー", summary: "" }
        }
      },
      "9": {
        name: "神経感染症",
        sections: {
          "1": { name: "髄膜炎", summary: "" },
          "2": { name: "ヘルペス脳炎", summary: "" },
          "3": { name: "亜急性硬化性全脳炎〈SSPE〉［⊿］", summary: "" },
          "4": { name: "脳膿瘍", summary: "" },
          "5": { name: "Creutzfeldt-Jakob病〈CJD〉", summary: "" }
        }
      },
      "10": {
        name: "機能性疾患",
        sections: {
          "1": { name: "片頭痛", summary: "" },
          "2": { name: "緊張型頭痛", summary: "" },
          "3": { name: "群発頭痛［⊿］", summary: "" },
          "4": { name: "てんかん概論", summary: "" },
          "5": { name: "Rolandてんかん［⊿］", summary: "" },
          "6": { name: "側頭葉てんかん", summary: "" },
          "7": { name: "欠神発作［⊿］", summary: "" },
          "8": { name: "West症候群〈点頭てんかん〉", summary: "" },
          "9": { name: "Lennox-Gastaut症候群", summary: "" }
        }
      },
      "11": {
        name: "頭部外傷",
        sections: {
          "1": { name: "脳震盪", summary: "" },
          "2": { name: "急性硬膜外血腫", summary: "" },
          "3": { name: "急性硬膜下血腫", summary: "" },
          "4": { name: "慢性硬膜下血腫", summary: "" },
          "5": { name: "びまん性軸索損傷〈DAI〉［⊿］", summary: "" }
        }
      },
      "12": {
        name: "神経腫瘍",
        sections: {
          "1": { name: "脳ヘルニア", summary: "" },
          "2": { name: "原発性脳腫瘍概論", summary: "" },
          "3": { name: "髄膜腫", summary: "" },
          "4": { name: "膠芽腫", summary: "" },
          "5": { name: "髄芽腫", summary: "" },
          "6": { name: "胚細胞腫", summary: "" },
          "7": { name: "血管芽腫", summary: "" },
          "8": { name: "神経鞘腫", summary: "" },
          "9": { name: "下垂体腺腫", summary: "" },
          "10": { name: "頭蓋咽頭腫", summary: "" },
          "11": { name: "中枢神経系原発悪性リンパ腫〈PCNSL〉", summary: "" },
          "12": { name: "転移性脳腫瘍", summary: "" },
          "13": { name: "脊髄腫瘍", summary: "" }
        }
      }
    }
  },
  sansyoro1sampu: {
    name: "産婦人科",
    order: 110,
    chapters: {
      "1": {
        name: "産婦人科の総論",
        sections: {
          "1": { name: "産婦人科のオリエンテーション", summary: "" },
          "2": { name: "生殖器の発生", summary: "" },
          "3": { name: "産婦人科の解剖 1：全体像", summary: "" },
          "4": { name: "産婦人科の解剖 2：脈管", summary: "" },
          "5": { name: "産婦人科の解剖 3：靭帯", summary: "" },
          "6": { name: "産婦人科のホルモン", summary: "" },
          "7": { name: "産婦人科の症候", summary: "" },
          "8": { name: "産婦人科の診察", summary: "" },
          "9": { name: "産婦人科の検査 1：妊娠反応・羊水・画像", summary: "" },
          "10": { name: "産婦人科の検査 2：胎児心拍数陣痛図", summary: "" },
          "11": { name: "産婦人科の薬剤", summary: "" }
        }
      },
      "2": {
        name: "妊娠の成立と進行",
        sections: {
          "1": { name: "月経周期", summary: "" },
          "2": { name: "排卵と受精・着床", summary: "" },
          "3": { name: "胎盤", summary: "" },
          "4": { name: "羊水", summary: "" },
          "5": { name: "胎児循環", summary: "" },
          "6": { name: "妊娠による母体変化", summary: "" },
          "7": { name: "妊娠週数ごとの変化 1：定義と指標", summary: "" },
          "8": { name: "妊娠週数ごとの変化 2：胎児の発達", summary: "" }
        }
      },
      "3": {
        name: "無月経と不妊・不育・避妊",
        sections: {
          "1": { name: "無月経の分類", summary: "" },
          "2": { name: "無月経をきたす病態", summary: "" },
          "3": { name: "多嚢胞性卵巣症候群〈PCOS〉", summary: "" },
          "4": { name: "卵巣過剰刺激症候群〈OHSS〉［⊿］", summary: "" },
          "5": { name: "卵巣出血［⊿］", summary: "" },
          "6": { name: "不妊の分類", summary: "" },
          "7": { name: "不妊の治療", summary: "" },
          "8": { name: "不育［⊿］", summary: "" },
          "9": { name: "子宮奇形［⊿］", summary: "" },
          "10": { name: "避妊", summary: "" }
        }
      },
      "4": {
        name: "妊娠初期",
        sections: {
          "1": { name: "妊娠の診断", summary: "" },
          "2": { name: "妊娠悪阻", summary: "" },
          "3": { name: "ルテイン嚢胞", summary: "" },
          "4": { name: "異所性〈子宮外〉妊娠", summary: "" },
          "5": { name: "流産", summary: "" }
        }
      },
      "5": {
        name: "妊娠中期",
        sections: {
          "1": { name: "早産", summary: "" },
          "2": { name: "羊水の過多・過少", summary: "" },
          "3": { name: "臍帯動脈欠損症〈単一臍帯動脈〉［⊿］", summary: "" },
          "4": { name: "双胎妊娠", summary: "" },
          "5": { name: "双胎間輸血症候群〈TTTS〉", summary: "" },
          "6": { name: "血液型不適合妊娠と母児間輸血症候群", summary: "" },
          "7": { name: "胎児水腫", summary: "" },
          "8": { name: "絨毛膜羊膜炎", summary: "" }
        }
      },
      "6": {
        name: "妊娠と合併症",
        sections: {
          "1": { name: "妊娠と感染症 1：概論", summary: "" },
          "2": { name: "妊娠と感染症 2：TORCH症候群", summary: "" },
          "3": { name: "妊娠と感染症 3：妊娠初期にスクリーニングするもの", summary: "" },
          "4": { name: "妊娠高血圧症候群〈HDP〉1：概論", summary: "" },
          "5": { name: "妊娠高血圧症候群〈HDP〉2：合併症", summary: "" },
          "6": { name: "妊娠と糖尿病", summary: "" },
          "7": { name: "その他の妊娠合併症 1：母体の異常", summary: "" },
          "8": { name: "その他の妊娠合併症 2：胎児の異常", summary: "" }
        }
      },
      "7": {
        name: "妊娠末期",
        sections: {
          "1": { name: "前置胎盤と癒着胎盤", summary: "" },
          "2": { name: "常位胎盤早期剥離", summary: "" },
          "3": { name: "破水", summary: "" },
          "4": { name: "胎児発育不全〈FGR〉", summary: "" },
          "5": { name: "胎児機能不全〈NRFS〉", summary: "" },
          "6": { name: "仰臥位低血圧症候群", summary: "" }
        }
      },
      "8": {
        name: "分娩",
        sections: {
          "1": { name: "正常分娩 1：分娩の3要素", summary: "" },
          "2": { name: "正常分娩 2：胎位・胎向・胎勢", summary: "" },
          "3": { name: "正常分娩 3：分娩と時間", summary: "" },
          "4": { name: "正常分娩 4：分娩の進行", summary: "" },
          "5": { name: "正常分娩 5：分娩終了への医学的介入", summary: "" },
          "6": { name: "微弱陣痛", summary: "" },
          "7": { name: "高在縦定位と低在横定位", summary: "" },
          "8": { name: "児頭骨盤不均衡〈CPD〉", summary: "" },
          "9": { name: "産瘤・頭血腫・帽状腱膜下血腫", summary: "" }
        }
      },
      "9": {
        name: "産褥",
        sections: {
          "1": { name: "子宮復古とその不全", summary: "" },
          "2": { name: "胎盤剥離徴候", summary: "" },
          "3": { name: "弛緩出血", summary: "" },
          "4": { name: "子宮内反", summary: "" },
          "5": { name: "頸管・腟壁裂傷", summary: "" },
          "6": { name: "子宮破裂", summary: "" },
          "7": { name: "羊水塞栓症", summary: "" },
          "8": { name: "産褥熱", summary: "" },
          "9": { name: "産褥精神障害", summary: "" }
        }
      },
      "10": {
        name: "産婦人科感染症",
        sections: {
          "1": { name: "クラミジア感染", summary: "" },
          "2": { name: "淋菌感染", summary: "" },
          "3": { name: "Bartholin腺膿瘍［⊿］", summary: "" },
          "4": { name: "性器ヘルペス", summary: "" },
          "5": { name: "尖圭コンジローマ", summary: "" },
          "6": { name: "腟炎", summary: "" }
        }
      },
      "11": {
        name: "子宮の腫瘍",
        sections: {
          "1": { name: "子宮筋腫", summary: "" },
          "2": { name: "子宮腺筋症", summary: "" },
          "3": { name: "子宮内膜症", summary: "" },
          "4": { name: "子宮頸部異形成〈CIN〉", summary: "" },
          "5": { name: "子宮頸癌", summary: "" },
          "6": { name: "子宮体癌", summary: "" },
          "7": { name: "胞状奇胎〈HM〉", summary: "" },
          "8": { name: "侵入奇胎と絨毛癌", summary: "" }
        }
      },
      "12": {
        name: "卵巣・卵管・腟・外陰の腫瘍",
        sections: {
          "1": { name: "卵巣腫瘍 1：概論", summary: "" },
          "2": { name: "卵巣腫瘍 2：表層上皮・間質腫瘍", summary: "" },
          "3": { name: "卵巣腫瘍 3：性索間質腫瘍", summary: "" },
          "4": { name: "卵巣腫瘍 4：胚細胞腫瘍", summary: "" },
          "5": { name: "卵巣腫瘍 5：Krukenberg腫瘍", summary: "" },
          "6": { name: "卵管癌［⊿］", summary: "" },
          "7": { name: "腟癌・外陰癌［⊿］", summary: "" }
        }
      }
    }
  },
  sansyoro2syouni: {
    name: "小児科",
    order: 120,
    chapters: {
      "1": {
        name: "小児科の総論 1：成長と発達",
        sections: {
          "1": { name: "小児科のオリエンテーション", summary: "" },
          "2": { name: "小児の成長", summary: "" },
          "3": { name: "小児の反射", summary: "" },
          "4": { name: "運動・言語・社会性の発達", summary: "" },
          "5": { name: "成長に伴うバイタルサインの変化", summary: "" },
          "6": { name: "臓器の発達", summary: "" },
          "7": { name: "二次性徴", summary: "" }
        }
      },
      "2": {
        name: "小児科の総論 2：新生児・乳幼児",
        sections: {
          "1": { name: "Apgarスコア", summary: "" },
          "2": { name: "生後1週の変化", summary: "" },
          "3": { name: "新生児の特徴", summary: "" },
          "4": { name: "母乳と栄養", summary: "" },
          "5": { name: "乳の比較", summary: "" },
          "6": { name: "小児の診察", summary: "" },
          "7": { name: "小児の脱水と輸液", summary: "" },
          "8": { name: "乳幼児揺さぶられ症候群〈SBS〉", summary: "" },
          "9": { name: "乳幼児突然死症候群〈SIDS〉", summary: "" }
        }
      },
      "3": {
        name: "小児科の総論 3：先天異常",
        sections: {
          "1": { name: "遺伝形式概論", summary: "" },
          "2": { name: "家系図と遺伝計算", summary: "" },
          "3": { name: "遺伝カウンセリングと遺伝学的検査", summary: "" },
          "4": { name: "Marfan症候群", summary: "" },
          "5": { name: "Turner症候群", summary: "" },
          "6": { name: "Klinefelter症候群", summary: "" },
          "7": { name: "Down症候群〈21トリソミー〉", summary: "" },
          "8": { name: "Edwards症候群〈18トリソミー〉", summary: "" },
          "9": { name: "猫鳴き症候群〈5番短腕欠損〉", summary: "" }
        }
      },
      "4": {
        name: "小児の腎",
        sections: {
          "1": { name: "多発性嚢胞腎〈PKD〉", summary: "" },
          "2": { name: "馬蹄鉄腎と海綿腎", summary: "" },
          "3": { name: "膀胱尿管逆流〈VUR〉", summary: "" },
          "4": { name: "重複腎盂尿管と尿管異所開口・尿管瘤", summary: "" },
          "5": { name: "Alport症候群", summary: "" },
          "6": { name: "Wilms腫瘍〈腎芽腫〉", summary: "" }
        }
      },
      "5": {
        name: "小児の内分泌代謝",
        sections: {
          "1": { name: "小児低身長の鑑別", summary: "" },
          "2": { name: "早発乳房発育症と思春期早発症", summary: "" },
          "3": { name: "単純性肥満", summary: "" },
          "4": { name: "新生児マススクリーニング", summary: "" },
          "5": { name: "クレチン症", summary: "" },
          "6": { name: "先天性副腎皮質過形成", summary: "" },
          "7": { name: "アセトン血性嘔吐症〈周期性嘔吐症〉", summary: "" },
          "8": { name: "ケトン性低血糖症", summary: "" },
          "9": { name: "糖原病", summary: "" },
          "10": { name: "くる病", summary: "" },
          "11": { name: "Lesch-Nyhan症候群", summary: "" }
        }
      },
      "6": {
        name: "小児の血液",
        sections: {
          "1": { name: "ビタミンK欠乏症", summary: "" },
          "2": { name: "小児の白血病", summary: "" },
          "3": { name: "Kasabach-Merritt症候群", summary: "" }
        }
      },
      "7": {
        name: "小児の免疫",
        sections: {
          "1": { name: "原発性免疫不全 1：概論", summary: "" },
          "2": { name: "原発性免疫不全 2：X連鎖無ガンマグロブリン血症", summary: "" },
          "3": { name: "原発性免疫不全 3：DiGeorge症候群", summary: "" },
          "4": { name: "原発性免疫不全 4：Wiskott-Aldrich症候群", summary: "" },
          "5": { name: "原発性免疫不全 5：慢性肉芽腫症〈CGD〉", summary: "" },
          "6": { name: "原発性免疫不全 6：その他の疾患", summary: "" },
          "7": { name: "川崎病〈KD〉", summary: "" },
          "8": { name: "IgA血管炎〈シェーンライン・ヘノッホ紫斑病〉", summary: "" }
        }
      },
      "8": {
        name: "小児の感染症",
        sections: {
          "1": { name: "突発性発疹", summary: "" },
          "2": { name: "麻疹", summary: "" },
          "3": { name: "風疹", summary: "" },
          "4": { name: "伝染性紅斑", summary: "" },
          "5": { name: "流行性耳下腺炎（ムンプス）", summary: "" },
          "6": { name: "ヘルパンギーナと手足口病", summary: "" },
          "7": { name: "ノロ・ロタウイルス感染", summary: "" }
        }
      },
      "9": {
        name: "小児の呼吸器",
        sections: {
          "1": { name: "新生児呼吸窮迫症候群〈IRDS〉", summary: "" },
          "2": { name: "新生児一過性多呼吸〈TTN〉", summary: "" },
          "3": { name: "未熟児無呼吸発作", summary: "" },
          "4": { name: "胎便吸引症候群〈MAS〉", summary: "" },
          "5": { name: "新生児横隔膜ヘルニア", summary: "" },
          "6": { name: "新生児慢性肺疾患〈CLD〉", summary: "" },
          "7": { name: "先天性肺炎", summary: "" },
          "8": { name: "先天性肺嚢胞", summary: "" },
          "9": { name: "急性細気管支炎", summary: "" },
          "10": { name: "クループ症候群", summary: "" },
          "11": { name: "喉頭軟化症", summary: "" }
        }
      },
      "10": {
        name: "小児の循環器",
        sections: {
          "1": { name: "先天性心疾患概論", summary: "" },
          "2": { name: "心房中隔欠損症〈ASD〉", summary: "" },
          "3": { name: "心室中隔欠損症〈VSD〉", summary: "" },
          "4": { name: "心内膜床欠損症〈ECD〉", summary: "" },
          "5": { name: "動脈管開存症〈PDA〉", summary: "" },
          "6": { name: "Fallot四徴症〈TOF〉", summary: "" },
          "7": { name: "三尖弁閉鎖症〈TA〉", summary: "" },
          "8": { name: "肺動脈狭窄症〈PS〉と肺動脈閉鎖症〈PA〉", summary: "" },
          "9": { name: "Ebstein奇形〈EA〉", summary: "" },
          "10": { name: "左心低形成症候群〈HLHS〉", summary: "" },
          "11": { name: "大動脈縮窄症〈CoA〉", summary: "" },
          "12": { name: "完全大血管転位症〈TGA〉", summary: "" },
          "13": { name: "総肺静脈還流異常症〈TAPVR〉", summary: "" },
          "14": { name: "Valsalva洞動脈瘤破裂〈SVA〉", summary: "" },
          "15": { name: "総動脈幹症〈TAC〉", summary: "" },
          "16": { name: "Bland-White-Garland症候群", summary: "" },
          "17": { name: "先天性心疾患と外科手術", summary: "" }
        }
      },
      "11": {
        name: "小児の消化管",
        sections: {
          "1": { name: "先天性食道閉鎖症", summary: "" },
          "2": { name: "肥厚性幽門狭窄症", summary: "" },
          "3": { name: "胃軸捻転", summary: "" },
          "4": { name: "先天性十二指腸・小腸閉鎖症", summary: "" },
          "5": { name: "新生児壊死性腸炎", summary: "" },
          "6": { name: "腸回転異常症と中腸軸捻転症", summary: "" },
          "7": { name: "Hirschsprung病", summary: "" },
          "8": { name: "腸重積", summary: "" },
          "9": { name: "鎖肛", summary: "" }
        }
      },
      "12": {
        name: "小児の肝胆膵",
        sections: {
          "1": { name: "新生児の黄疸", summary: "" },
          "2": { name: "核黄疸〈ビリルビン脳症〉", summary: "" },
          "3": { name: "胆道閉鎖症と新生児肝炎", summary: "" },
          "4": { name: "先天性胆道拡張症", summary: "" },
          "5": { name: "肝芽腫", summary: "" },
          "6": { name: "輪状膵", summary: "" }
        }
      },
      "13": {
        name: "小児の神経",
        sections: {
          "1": { name: "小児の髄膜炎", summary: "" },
          "2": { name: "新生児のけいれん", summary: "" },
          "3": { name: "熱性けいれん", summary: "" },
          "4": { name: "脳性麻痺", summary: "" },
          "5": { name: "脊髄性筋萎縮症〈SMA〉", summary: "" },
          "6": { name: "神経芽腫", summary: "" },
          "7": { name: "髄膜瘤", summary: "" },
          "8": { name: "Chiari奇形", summary: "" },
          "9": { name: "ミトコンドリア病", summary: "" }
        }
      }
    }
  },
  sansyoro3rounen: {
    name: "老年科",
    order: 130,
    chapters: {
      "1": {
        name: "加齢老年学の総論",
        sections: {
          "1": { name: "加齢老年学のオリエンテーション", summary: "" },
          "2": { name: "高齢者の特徴", summary: "" },
          "3": { name: "加齢による変化", summary: "" },
          "4": { name: "加齢による疾病罹患", summary: "" },
          "5": { name: "日常生活動作〈ADL〉", summary: "" },
          "6": { name: "高齢者総合機能評価〈CGA〉", summary: "" }
        }
      },
      "2": {
        name: "高齢者特有の病態",
        sections: {
          "1": { name: "高齢者と転倒", summary: "" },
          "2": { name: "ロコモティブシンドロームと運動器不安定症［⊿］", summary: "" },
          "3": { name: "廃用症候群", summary: "" },
          "4": { name: "フレイル", summary: "" },
          "5": { name: "悪液質〈カヘキシア〉［⊿］", summary: "" },
          "6": { name: "サルコペニア", summary: "" },
          "7": { name: "老人性紫斑", summary: "" },
          "8": { name: "高齢者と血圧", summary: "" },
          "9": { name: "高齢者と嚥下障害 1：概論", summary: "" },
          "10": { name: "高齢者と嚥下障害 2：誤嚥性肺炎", summary: "" },
          "11": { name: "高齢者とクスリ 1：概論", summary: "" },
          "12": { name: "高齢者とクスリ 2：代表的薬剤と副作用一覧", summary: "" }
        }
      },
      "3": {
        name: "リハビリテーション医学",
        sections: {
          "1": { name: "リハビリテーション", summary: "" },
          "2": { name: "ノーマライゼーション", summary: "" },
          "3": { name: "補助具・装具", summary: "" },
          "4": { name: "退院・在宅へ向けて", summary: "" }
        }
      },
      "4": {
        name: "女性の加齢性変化",
        sections: {
          "1": { name: "女性の加齢の特徴", summary: "" },
          "2": { name: "骨盤臓器脱", summary: "" },
          "3": { name: "更年期障害", summary: "" },
          "4": { name: "早発卵巣不全〈POF〉［⊿］", summary: "" }
        }
      }
    }
  },
  minor1seikei: {
    name: "整形外科",
    order: 170,
    chapters: {
      "1": {
        name: "整形外科の総論",
        sections: {
          "1": { name: "整形外科のオリエンテーション", summary: "" },
          "2": { name: "骨", summary: "" },
          "3": { name: "骨折", summary: "" },
          "4": { name: "関節", summary: "" },
          "5": { name: "関節の運動と可動域", summary: "" },
          "6": { name: "人工関節置換術", summary: "" },
          "7": { name: "筋", summary: "" },
          "8": { name: "脊髄とその周囲構造", summary: "" },
          "9": { name: "神経根とその支配", summary: "" },
          "10": { name: "複合性局所疼痛症候群〈CRPS〉［⊿］", summary: "" }
        }
      },
      "2": {
        name: "上肢",
        sections: {
          "1": { name: "肩関節周囲炎（凍結肩・五十肩）", summary: "" },
          "2": { name: "胸郭出口症候群と頸肩腕症候群", summary: "" },
          "3": { name: "腱板断裂", summary: "" },
          "4": { name: "上肢の神経概論", summary: "" },
          "5": { name: "橈骨神経障害", summary: "" },
          "6": { name: "正中神経障害", summary: "" },
          "7": { name: "尺骨神経障害", summary: "" },
          "8": { name: "上腕骨骨折", summary: "" },
          "9": { name: "コンパートメント〈区画〉症候群", summary: "" },
          "10": { name: "肘内障", summary: "" },
          "11": { name: "離断性骨軟骨炎（野球肘）", summary: "" },
          "12": { name: "前腕骨骨折", summary: "" }
        }
      },
      "3": {
        name: "脊椎",
        sections: {
          "1": { name: "脊柱管狭窄症", summary: "" },
          "2": { name: "頸椎症性脊髄症・神経根症", summary: "" },
          "3": { name: "後縦靭帯骨化症〈OPLL〉［⊿］", summary: "" },
          "4": { name: "椎間板ヘルニア", summary: "" },
          "5": { name: "脊椎分離症・脊椎すべり症［⊿］", summary: "" },
          "6": { name: "椎体圧迫骨折", summary: "" },
          "7": { name: "脊柱側弯症［⊿］", summary: "" },
          "8": { name: "骨・関節・筋の感染症", summary: "" }
        }
      },
      "4": {
        name: "下肢",
        sections: {
          "1": { name: "下肢の主たる骨と神経", summary: "" },
          "2": { name: "変形性関節症〈OA〉", summary: "" },
          "3": { name: "発育性股関節形成不全", summary: "" },
          "4": { name: "Perthes病［⊿］", summary: "" },
          "5": { name: "大腿骨壊死［⊿］", summary: "" },
          "6": { name: "大腿骨頭すべり症", summary: "" },
          "7": { name: "大腿骨骨折", summary: "" },
          "8": { name: "膝靭帯の損傷", summary: "" },
          "9": { name: "膝蓋骨・半月板・脛骨結節の損傷", summary: "" },
          "10": { name: "アキレス腱断裂［⊿］", summary: "" },
          "11": { name: "踵骨骨折［⊿］", summary: "" },
          "12": { name: "外反母趾［⊿］", summary: "" }
        }
      },
      "5": {
        name: "骨腫瘍",
        sections: {
          "1": { name: "骨腫瘍概論", summary: "" },
          "2": { name: "骨巨細胞腫［⊿］", summary: "" },
          "3": { name: "骨軟骨腫〈外骨腫〉［⊿］", summary: "" },
          "4": { name: "類骨骨腫［⊿］", summary: "" },
          "5": { name: "骨の肉腫", summary: "" },
          "6": { name: "転移性骨腫瘍", summary: "" }
        }
      }
    }
  },
  minor2ganka: {
    name: "眼科",
    order: 180,
    chapters: {
      "1": {
        name: "眼科の総論",
        sections: {
          "1": { name: "眼科のオリエンテーション", summary: "" },
          "2": { name: "眼科の解剖生理 1：眼の全体像", summary: "" },
          "3": { name: "眼科の解剖生理 2：角膜・ぶどう膜", summary: "" },
          "4": { name: "眼科の解剖生理 3：水晶体・硝子体・網膜", summary: "" },
          "5": { name: "眼科の検査 1：形態：細隙灯顕微鏡と直／倒像鏡", summary: "" },
          "6": { name: "眼科の検査 2：形態：蛍光眼底造影・OCT［⊿］", summary: "" },
          "7": { name: "眼科の検査 3：形態：マクロな観察をするもの［⊿］", summary: "" },
          "8": { name: "眼科の検査 4：形態：ミクロな観察をするもの［⊿］", summary: "" },
          "9": { name: "眼科の検査 5：機能：眼球運動と電位［⊿］", summary: "" },
          "10": { name: "眼科の検査 6：機能：色覚と涙液［⊿］", summary: "" },
          "11": { name: "眼科の検査 7：機能：眼圧と視野", summary: "" },
          "12": { name: "眼科の検査 8：機能：視力", summary: "" },
          "13": { name: "眼科の症候 1：視力低下", summary: "" },
          "14": { name: "眼科の症候 2：斜位と斜視［⊿］", summary: "" },
          "15": { name: "眼科の症候 3：弱視［⊿］", summary: "" },
          "16": { name: "眼科の症候 4：視野の異常", summary: "" },
          "17": { name: "眼科の症候 5：乳頭浮腫［⊿］", summary: "" },
          "18": { name: "眼科の症候 6：その他", summary: "" },
          "19": { name: "角膜移植［⊿］", summary: "" }
        }
      },
      "2": {
        name: "前眼部",
        sections: {
          "1": { name: "麦粒腫・霰粒腫［⊿］", summary: "" },
          "2": { name: "春季カタル［⊿］", summary: "" },
          "3": { name: "涙嚢炎［⊿］", summary: "" },
          "4": { name: "鼻涙管閉塞症［⊿］", summary: "" },
          "5": { name: "ドライアイ（乾性角結膜炎・涙液減少症）［⊿］", summary: "" },
          "6": { name: "結膜炎", summary: "" },
          "7": { name: "結膜下出血［⊿］", summary: "" },
          "8": { name: "翼状片［⊿］", summary: "" },
          "9": { name: "角膜炎", summary: "" },
          "10": { name: "水疱性角膜症［⊿］", summary: "" },
          "11": { name: "緑内障 1：原発閉塞隅角緑内障", summary: "" },
          "12": { name: "緑内障 2：原発開放隅角緑内障", summary: "" },
          "13": { name: "緑内障 3：特殊なもの", summary: "" }
        }
      },
      "3": {
        name: "水晶体・硝子体",
        sections: {
          "1": { name: "水晶体位置異常［⊿］", summary: "" },
          "2": { name: "白内障 1：概論", summary: "" },
          "3": { name: "白内障 2：術後合併症", summary: "" },
          "4": { name: "硝子体出血・剥離［⊿］", summary: "" }
        }
      },
      "4": {
        name: "ぶどう膜",
        sections: {
          "1": { name: "ぶどう膜炎概論", summary: "" },
          "2": { name: "眼のベーチェット病", summary: "" },
          "3": { name: "眼のサルコイドーシス", summary: "" },
          "4": { name: "Vogt-小柳-原田病", summary: "" }
        }
      },
      "5": {
        name: "網膜",
        sections: {
          "1": { name: "糖尿病網膜症", summary: "" },
          "2": { name: "高血圧性網膜症", summary: "" },
          "3": { name: "中心性漿液性網脈絡膜症〈CSC〉［⊿］", summary: "" },
          "4": { name: "加齢黄斑変性症〈AMD〉［⊿］", summary: "" },
          "5": { name: "黄斑円孔と黄斑前膜［⊿］", summary: "" },
          "6": { name: "網膜動脈閉塞症", summary: "" },
          "7": { name: "網膜静脈閉塞症", summary: "" },
          "8": { name: "網膜色素変性症〈RP〉［⊿］", summary: "" },
          "9": { name: "網膜剥離", summary: "" },
          "10": { name: "網膜芽細胞腫〈RB〉", summary: "" }
        }
      },
      "6": {
        name: "眼科的外傷",
        sections: {
          "1": { name: "対光反射と視神経管骨折", summary: "" },
          "2": { name: "眼窩吹き抜け骨折［⊿］", summary: "" },
          "3": { name: "眼窩先端部症候群［⊿］", summary: "" },
          "4": { name: "交感性眼炎［⊿］", summary: "" },
          "5": { name: "その他の眼科的外傷", summary: "" }
        }
      }
    }
  },
  minor3jibika: {
    name: "耳鼻咽喉科",
    order: 190,
    chapters: {
      "1": {
        name: "耳鼻咽喉科の総論",
        sections: {
          "1": { name: "耳鼻咽喉科のオリエンテーション", summary: "" },
          "2": { name: "耳の解剖生理 1：全体像", summary: "" },
          "3": { name: "耳の解剖生理 2：外耳～中耳", summary: "" },
          "4": { name: "耳の解剖生理 3：内耳～後迷路", summary: "" },
          "5": { name: "鼻の解剖生理", summary: "" },
          "6": { name: "咽頭と喉頭の解剖生理", summary: "" },
          "7": { name: "味覚と顔面神経", summary: "" },
          "8": { name: "顔面神経麻痺", summary: "" },
          "9": { name: "耳鼻咽喉科の検査 1：器具一般", summary: "" },
          "10": { name: "耳鼻咽喉科の検査 2：標準純音聴力検査〈オージオグラム〉", summary: "" },
          "11": { name: "耳鼻咽喉科の検査 3：オージオメーター（その他）", summary: "" },
          "12": { name: "耳鼻咽喉科の検査 4：音叉検査", summary: "" },
          "13": { name: "耳鼻咽喉科の検査 5：インピーダンスオージオメトリ〈ティンパノグラム〉", summary: "" },
          "14": { name: "耳鼻咽喉科の検査 6：他覚的な聴力検査", summary: "" },
          "15": { name: "耳鼻咽喉科の検査 7：平衡覚検査", summary: "" },
          "16": { name: "中耳の手術［⊿］", summary: "" },
          "17": { name: "補聴器と人工内耳", summary: "" },
          "18": { name: "永久気管孔", summary: "" }
        }
      },
      "2": {
        name: "外耳～中耳",
        sections: {
          "1": { name: "外耳疾患［⊿］", summary: "" },
          "2": { name: "急性中耳炎", summary: "" },
          "3": { name: "慢性中耳炎", summary: "" },
          "4": { name: "真珠腫性中耳炎［⊿］", summary: "" },
          "5": { name: "滲出性中耳炎", summary: "" },
          "6": { name: "耳硬化症［⊿］", summary: "" },
          "7": { name: "耳小骨離断［⊿］", summary: "" }
        }
      },
      "3": {
        name: "内耳",
        sections: {
          "1": { name: "騒音性難聴［⊿］", summary: "" },
          "2": { name: "老人性難聴［⊿］", summary: "" },
          "3": { name: "突発性難聴［⊿］", summary: "" },
          "4": { name: "機能性難聴〈心因性難聴〉［⊿］", summary: "" },
          "5": { name: "内耳炎［⊿］", summary: "" },
          "6": { name: "メニエール病［⊿］", summary: "" },
          "7": { name: "外リンパ瘻［⊿］", summary: "" },
          "8": { name: "中毒性平衡障害［⊿］", summary: "" },
          "9": { name: "良性発作性頭位眩暈症〈BPPV〉", summary: "" },
          "10": { name: "前庭神経炎［⊿］", summary: "" }
        }
      },
      "4": {
        name: "鼻",
        sections: {
          "1": { name: "アレルギー性鼻炎", summary: "" },
          "2": { name: "鼻出血", summary: "" },
          "3": { name: "血管線維腫［⊿］", summary: "" },
          "4": { name: "副鼻腔炎", summary: "" },
          "5": { name: "副鼻腔真菌症［⊿］", summary: "" },
          "6": { name: "術後性上顎嚢胞［⊿］", summary: "" },
          "7": { name: "上顎癌［⊿］", summary: "" }
        }
      },
      "5": {
        name: "咽頭・喉頭",
        sections: {
          "1": { name: "アデノイド増殖症", summary: "" },
          "2": { name: "扁桃～咽頭の炎症・膿瘍", summary: "" },
          "3": { name: "咽頭癌", summary: "" },
          "4": { name: "声帯の変化と嗄声", summary: "" },
          "5": { name: "喉頭癌", summary: "" }
        }
      },
      "6": {
        name: "口腔・唾液腺・頸部",
        sections: {
          "1": { name: "唇裂・口蓋裂［⊿］", summary: "" },
          "2": { name: "上皮真珠腫［⊿］", summary: "" },
          "3": { name: "舌癌", summary: "" },
          "4": { name: "唾液腺とその損傷", summary: "" },
          "5": { name: "唾液腺腫瘍", summary: "" },
          "6": { name: "唾石症［⊿］", summary: "" },
          "7": { name: "頸嚢胞［⊿］", summary: "" },
          "8": { name: "頸部膿瘍と降下性壊死性縦隔炎〈DNM〉［⊿］", summary: "" }
        }
      }
    }
  },
  minor4hinyouki: {
    name: "泌尿器科",
    order: 200,
    chapters: {
      "1": {
        name: "泌尿器科の総論",
        sections: {
          "1": { name: "泌尿器科のオリエンテーション", summary: "" },
          "2": { name: "泌尿器科の解剖生理 1：全体像", summary: "" },
          "3": { name: "泌尿器科の解剖生理 2：膀胱・前立腺・尿道", summary: "" },
          "4": { name: "泌尿器科の解剖生理 3：陰茎・精路", summary: "" },
          "5": { name: "排尿生理 1：基準値とその逸脱", summary: "" },
          "6": { name: "排尿生理 2：排尿のしくみ", summary: "" },
          "7": { name: "排尿生理 3：下部尿路症状", summary: "" },
          "8": { name: "泌尿器科の診察", summary: "" },
          "9": { name: "泌尿器科の検査", summary: "" },
          "10": { name: "泌尿器科の治療", summary: "" }
        }
      },
      "2": {
        name: "腎・尿管",
        sections: {
          "1": { name: "水腎症", summary: "" },
          "2": { name: "腎盂腎炎", summary: "" },
          "3": { name: "腎梗塞［⊿］", summary: "" },
          "4": { name: "尿路結石", summary: "" },
          "5": { name: "腎細胞癌〈RCC〉", summary: "" },
          "6": { name: "腎盂癌・尿管癌［⊿］", summary: "" }
        }
      },
      "3": {
        name: "膀胱",
        sections: {
          "1": { name: "過活動膀胱〈OAB〉［⊿］", summary: "" },
          "2": { name: "膀胱炎", summary: "" },
          "3": { name: "膀胱癌", summary: "" },
          "4": { name: "尿膜管癌［⊿］", summary: "" }
        }
      },
      "4": {
        name: "前立腺",
        sections: {
          "1": { name: "前立腺炎", summary: "" },
          "2": { name: "前立腺肥大症〈BPH〉", summary: "" },
          "3": { name: "前立腺癌", summary: "" }
        }
      },
      "5": {
        name: "尿道・陰茎",
        sections: {
          "1": { name: "尿道炎", summary: "" },
          "2": { name: "尿道下裂［⊿］", summary: "" },
          "3": { name: "勃起不全〈ED〉", summary: "" },
          "4": { name: "持続勃起症［⊿］", summary: "" },
          "5": { name: "陰茎折症［⊿］", summary: "" },
          "6": { name: "包茎と亀頭包皮炎［⊿］", summary: "" },
          "7": { name: "陰茎癌［⊿］", summary: "" }
        }
      },
      "6": {
        name: "陰嚢・精巣",
        sections: {
          "1": { name: "陰嚢水腫〈精巣水瘤〉［⊿］", summary: "" },
          "2": { name: "精索静脈瘤［⊿］", summary: "" },
          "3": { name: "精巣上体炎と精液瘤［⊿］", summary: "" },
          "4": { name: "停留精巣", summary: "" },
          "5": { name: "精巣捻転症［⊿］", summary: "" },
          "6": { name: "精巣腫瘍", summary: "" }
        }
      }
    }
  },
  minor5mental: {
    name: "精神科",
    order: 210,
    chapters: {
      "1": {
        name: "精神科の総論",
        sections: {
          "1": { name: "精神科のオリエンテーション", summary: "" },
          "2": { name: "精神科の用語", summary: "" },
          "3": { name: "精神科の検査", summary: "" },
          "4": { name: "精神科の治療薬と副作用", summary: "" },
          "5": { name: "精神科の治療法", summary: "" }
        }
      },
      "2": {
        name: "精神作用物質による障害",
        sections: {
          "1": { name: "せん妄", summary: "" },
          "2": { name: "薬物中毒", summary: "" },
          "3": { name: "アルコール依存症", summary: "" }
        }
      },
      "3": {
        name: "統合失調症スペクトラム障害",
        sections: {
          "1": { name: "妄想", summary: "" },
          "2": { name: "妄想性障害［⊿］", summary: "" },
          "3": { name: "統合失調症 1：概論と症候", summary: "" },
          "4": { name: "統合失調症 2：治療と対応", summary: "" },
          "5": { name: "統合失調症 3：社会復帰と予後", summary: "" },
          "6": { name: "緊張病症候群", summary: "" }
        }
      },
      "4": {
        name: "気分（感情）障害",
        sections: {
          "1": { name: "気分（感情）障害概論", summary: "" },
          "2": { name: "躁", summary: "" },
          "3": { name: "うつ 1：概論", summary: "" },
          "4": { name: "うつ 2：特殊なもの", summary: "" }
        }
      },
      "5": {
        name: "強迫性障害・不安障害",
        sections: {
          "1": { name: "強迫性障害［⊿］", summary: "" },
          "2": { name: "抜毛症〈癖〉［⊿］", summary: "" },
          "3": { name: "パニック障害", summary: "" },
          "4": { name: "社交〈会〉不安障害〈SAD〉", summary: "" },
          "5": { name: "全般性不安障害〈GAD〉", summary: "" },
          "6": { name: "病気不安症〈心気症〉", summary: "" },
          "7": { name: "選択緘黙［⊿］", summary: "" }
        }
      },
      "6": {
        name: "心的・ストレス関連障害",
        sections: {
          "1": { name: "心的外傷後ストレス障害〈PTSD〉", summary: "" },
          "2": { name: "適応障害［⊿］", summary: "" },
          "3": { name: "反抗期・不登校・ひきこもり［⊿］", summary: "" }
        }
      },
      "7": {
        name: "睡眠・覚醒障害［⊿］",
        sections: {
          "1": { name: "睡眠の生理", summary: "" },
          "2": { name: "不眠障害［⊿］", summary: "" },
          "3": { name: "概日リズム睡眠-覚醒障害［⊿］", summary: "" },
          "4": { name: "ナルコレプシー［⊿］", summary: "" },
          "5": { name: "REM睡眠行動障害〈RBD〉［⊿］", summary: "" },
          "6": { name: "睡眠時遊行症〈夢中遊行症〉と睡眠時驚愕症〈夜驚症〉［⊿］", summary: "" },
          "7": { name: "遺尿症［⊿］", summary: "" },
          "8": { name: "むずむず脚症候群〈レストレスレッグス症候群〉［⊿］", summary: "" }
        }
      },
      "8": {
        name: "神経発達障害",
        sections: {
          "1": { name: "自閉症スペクトラム障害〈ASD〉", summary: "" },
          "2": { name: "注意欠陥〈如〉多動性障害〈ADHD〉", summary: "" },
          "3": { name: "学習障害〈LD〉［⊿］", summary: "" },
          "4": { name: "チック障害［⊿］", summary: "" }
        }
      },
      "9": {
        name: "その他の精神科疾患",
        sections: {
          "1": { name: "神経性食思〈欲〉不振症〈AN〉", summary: "" },
          "2": { name: "パーソナリティー〈人格〉障害", summary: "" },
          "3": { name: "性同一性障害〈性別違和〉［⊿］", summary: "" },
          "4": { name: "解離性障害", summary: "" },
          "5": { name: "健忘", summary: "" },
          "6": { name: "転換性障害〈変換症〉", summary: "" },
          "7": { name: "ギャンブル障害とゲーム障害", summary: "" }
        }
      }
    }
  },
  minor6hifu: {
    name: "皮膚科",
    order: 220,
    chapters: {
      "1": {
        name: "皮膚科の総論",
        sections: {
          "1": { name: "皮膚科のオリエンテーション", summary: "" },
          "2": { name: "皮膚科の解剖生理 1：全体像", summary: "" },
          "3": { name: "皮膚科の解剖生理 2：表皮", summary: "" },
          "4": { name: "皮膚科の解剖生理 3：毛と汗腺", summary: "" },
          "5": { name: "発疹の分類", summary: "" },
          "6": { name: "皮膚科の検査", summary: "" },
          "7": { name: "皮膚科の治療［⊿］", summary: "" },
          "8": { name: "結節性紅斑", summary: "" },
          "9": { name: "デルマドローム", summary: "" }
        }
      },
      "2": {
        name: "薬疹",
        sections: {
          "1": { name: "薬疹概論", summary: "" },
          "2": { name: "固定薬疹", summary: "" },
          "3": { name: "Stevens-Johnson症候群〈SJS〉", summary: "" },
          "4": { name: "中毒性表皮壊死症〈TEN〉", summary: "" },
          "5": { name: "薬剤性過敏症症候群〈DIHS〉", summary: "" },
          "6": { name: "酒皶様皮膚炎〈ステロイド誘発性皮膚炎〉", summary: "" }
        }
      },
      "3": {
        name: "湿疹",
        sections: {
          "1": { name: "湿疹概論", summary: "" },
          "2": { name: "アトピー性皮膚炎", summary: "" },
          "3": { name: "接触皮膚炎", summary: "" },
          "4": { name: "その他の湿疹", summary: "" }
        }
      },
      "4": {
        name: "水疱・膿疱",
        sections: {
          "1": { name: "天疱瘡", summary: "" },
          "2": { name: "その他の水疱症", summary: "" },
          "3": { name: "掌蹠膿疱症", summary: "" },
          "4": { name: "壊疽性膿皮症", summary: "" }
        }
      },
      "5": {
        name: "良性増殖性変化",
        sections: {
          "1": { name: "尋常性乾癬", summary: "" },
          "2": { name: "その他の乾癬・類乾癬", summary: "" },
          "3": { name: "扁平苔癬", summary: "" },
          "4": { name: "Gibertばら色粃糠疹", summary: "" },
          "5": { name: "Darier病", summary: "" },
          "6": { name: "黒色表皮腫", summary: "" },
          "7": { name: "肥満細胞腫〈色素性蕁麻疹〉", summary: "" },
          "8": { name: "脂漏性角化症〈老人性疣贅〉", summary: "" },
          "9": { name: "ケラトアカントーマ［⊿］", summary: "" },
          "10": { name: "肥厚性瘢痕とケロイド［⊿］", summary: "" },
          "11": { name: "グロムス腫瘍", summary: "" }
        }
      },
      "6": {
        name: "皮膚科の悪性腫瘍",
        sections: {
          "1": { name: "光線角化症とBowen病", summary: "" },
          "2": { name: "有棘細胞癌", summary: "" },
          "3": { name: "基底細胞癌", summary: "" },
          "4": { name: "悪性黒色腫〈メラノーマ〉", summary: "" },
          "5": { name: "血管肉腫", summary: "" },
          "6": { name: "乳房外Paget病［⊿］", summary: "" },
          "7": { name: "皮膚T細胞リンパ腫", summary: "" }
        }
      },
      "7": {
        name: "皮膚科の感染症",
        sections: {
          "1": { name: "丹毒", summary: "" },
          "2": { name: "伝染性膿痂疹（とびひ）", summary: "" },
          "3": { name: "ブドウ球菌性熱傷様皮膚症候群〈SSSS〉", summary: "" },
          "4": { name: "蜂窩織炎〈蜂巣炎〉［⊿］", summary: "" },
          "5": { name: "皮膚抗酸菌感染症", summary: "" },
          "6": { name: "皮膚ウイルス感染症", summary: "" },
          "7": { name: "皮膚真菌感染症", summary: "" }
        }
      },
      "8": {
        name: "母斑と母斑症",
        sections: {
          "1": { name: "母斑", summary: "" },
          "2": { name: "Sturge-Weber症候群", summary: "" },
          "3": { name: "結節性硬化症", summary: "" },
          "4": { name: "神経線維腫症〈NF〉", summary: "" }
        }
      },
      "9": {
        name: "その他の皮膚科疾患",
        sections: {
          "1": { name: "脱毛症", summary: "" },
          "2": { name: "毛巣洞［⊿］", summary: "" },
          "3": { name: "多汗症［⊿］", summary: "" },
          "4": { name: "線状皮膚萎縮症〈線状伸展線条〉［⊿］", summary: "" },
          "5": { name: "弾性〈力〉線維性仮性黄色腫〈PXE〉とEhlers-Danlos症候群［⊿］", summary: "" },
          "6": { name: "色素失調症［⊿］", summary: "" },
          "7": { name: "色素性乾皮症〈XP〉［⊿］", summary: "" },
          "8": { name: "尋常性白斑［⊿］", summary: "" },
          "9": { name: "Sweet病［⊿］", summary: "" },
          "10": { name: "リンパ管腫［⊿］", summary: "" }
        }
      }
    }
  },
  minor7housya: {
    name: "放射線科",
    order: 230,
    chapters: {
      "1": {
        name: "放射線科の総論",
        sections: {
          "1": { name: "放射線科のオリエンテーション", summary: "" },
          "2": { name: "放射線の定義と種類", summary: "" },
          "3": { name: "放射線と単位", summary: "" },
          "4": { name: "確定的影響と確率的影響", summary: "" },
          "5": { name: "早期障害と晩期障害", summary: "" },
          "6": { name: "放射線防護", summary: "" },
          "7": { name: "放射線被曝の疫学", summary: "" }
        }
      },
      "2": {
        name: "放射線診断学",
        sections: {
          "1": { name: "エックス線一般撮影〈XP〉", summary: "" },
          "2": { name: "コンピューター断層撮影法〈CT〉", summary: "" },
          "3": { name: "核磁気共鳴画像法〈MRI〉", summary: "" },
          "4": { name: "超音波検査〈US〉", summary: "" },
          "5": { name: "造影検査", summary: "" },
          "6": { name: "核医学検査", summary: "" }
        }
      },
      "3": {
        name: "放射線治療学",
        sections: {
          "1": { name: "放射線感受性", summary: "" },
          "2": { name: "放射線治療の目的", summary: "" },
          "3": { name: "放射線治療の種類", summary: "" },
          "4": { name: "放射線治療の実際", summary: "" },
          "5": { name: "インターベンショナルラジオロジー〈IVR〉", summary: "" },
          "6": { name: "コレステロール塞栓症［⊿］", summary: "" }
        }
      }
    }
  },
  kyucyumako1qq: {
    name: "救急",
    order: 140,
    chapters: {
      "1": {
        name: "救急の総論",
        sections: {
          "1": { name: "救急のオリエンテーション", summary: "" },
          "2": { name: "救急医療の大原則", summary: "" },
          "3": { name: "心肺蘇生 1：一次救命処置〈BLS〉", summary: "" },
          "4": { name: "心肺蘇生 2：自動体外式除細動器〈AED〉", summary: "" },
          "5": { name: "心肺蘇生 3：医療者による救命処置", summary: "" },
          "6": { name: "心肺蘇生 4：心拍再開〈ROSC〉後の対応", summary: "" },
          "7": { name: "気道確保の種類", summary: "" },
          "8": { name: "意識の評価 1：JCS", summary: "" },
          "9": { name: "意識の評価 2：GCS", summary: "" }
        }
      },
      "2": {
        name: "ショック",
        sections: {
          "1": { name: "ショック概論", summary: "" },
          "2": { name: "循環血液量減少性ショック", summary: "" },
          "3": { name: "心原性ショック", summary: "" },
          "4": { name: "閉塞性ショック", summary: "" },
          "5": { name: "敗血症性ショック", summary: "" },
          "6": { name: "アナフィラキシーショック", summary: "" },
          "7": { name: "神経原性ショック", summary: "" }
        }
      },
      "3": {
        name: "救急外傷",
        sections: {
          "1": { name: "頭部外傷 1：脳の損傷", summary: "" },
          "2": { name: "頭部外傷 2：側頭骨骨折", summary: "" },
          "3": { name: "頭部外傷 3：顔面骨折", summary: "" },
          "4": { name: "頸部外傷", summary: "" },
          "5": { name: "FAST", summary: "" },
          "6": { name: "胸部外傷", summary: "" },
          "7": { name: "腹部外傷", summary: "" },
          "8": { name: "後腹膜外傷", summary: "" },
          "9": { name: "骨盤外傷", summary: "" },
          "10": { name: "四肢外傷", summary: "" }
        }
      },
      "4": {
        name: "災害救急",
        sections: {
          "1": { name: "トリアージ", summary: "" },
          "2": { name: "クラッシュ〈挫滅［圧挫］〉症候群［⊿］", summary: "" },
          "3": { name: "バイオテロリズム〈生物兵器テロ〉", summary: "" },
          "4": { name: "爆傷", summary: "" },
          "5": { name: "飛行機関連トラブル［⊿］", summary: "" },
          "6": { name: "減圧症〈潜函（水）病〉〈DCS〉（ベンズ）［⊿］", summary: "" }
        }
      },
      "5": {
        name: "救急疾患",
        sections: {
          "1": { name: "急性喉頭蓋炎", summary: "" },
          "2": { name: "異物の誤嚥", summary: "" },
          "3": { name: "異物の誤飲〈誤食〉", summary: "" },
          "4": { name: "熱傷", summary: "" },
          "5": { name: "熱中症", summary: "" },
          "6": { name: "偶発性低体温症・凍傷", summary: "" },
          "7": { name: "溺水", summary: "" },
          "8": { name: "壊死性筋膜炎〈NF〉［⊿］", summary: "" },
          "9": { name: "マムシ咬傷［⊿］", summary: "" },
          "10": { name: "自殺企図", summary: "" }
        }
      }
    }
  },
  kyucyumako2cyuma: {
    name: "中毒・麻酔",
    order: 150,
    chapters: {
      "0": {
        name: "中毒・麻酔の総論",
        sections: {
          "1": { name: "中毒・麻酔のオリエンテーション", summary: "" }
        }
      },
      "1": {
        name: "農薬中毒",
        sections: {
          "1": { name: "有機リン", summary: "" },
          "2": { name: "パラコート", summary: "" }
        }
      },
      "2": {
        name: "ガス中毒",
        sections: {
          "1": { name: "一酸化炭素〈CO〉", summary: "" },
          "2": { name: "酸素欠乏症", summary: "" },
          "3": { name: "硫化水素［⊿］", summary: "" },
          "4": { name: "塩素ガス", summary: "" },
          "5": { name: "シアン化水素〈青酸ガス〉", summary: "" }
        }
      },
      "3": {
        name: "有機溶剤・金属中毒",
        sections: {
          "1": { name: "有機溶剤中毒", summary: "" },
          "2": { name: "金属中毒", summary: "" },
          "3": { name: "無機鉛中毒", summary: "" }
        }
      },
      "4": {
        name: "麻酔の分類",
        sections: {
          "1": { name: "麻酔の概論", summary: "" },
          "2": { name: "全身麻酔", summary: "" },
          "3": { name: "気管挿管の方法", summary: "" },
          "4": { name: "気管挿管のトラブル", summary: "" },
          "5": { name: "脊髄くも膜下麻酔〈脊椎麻酔〉", summary: "" },
          "6": { name: "硬膜外麻酔", summary: "" },
          "7": { name: "局所浸潤麻酔", summary: "" }
        }
      },
      "5": {
        name: "麻酔薬",
        sections: {
          "1": { name: "吸入麻酔薬", summary: "" },
          "2": { name: "静脈麻酔薬", summary: "" },
          "3": { name: "筋弛緩薬", summary: "" },
          "4": { name: "悪性高熱症〈MH〉", summary: "" },
          "5": { name: "局所麻酔薬中毒", summary: "" },
          "6": { name: "拮抗薬", summary: "" },
          "7": { name: "治療薬物モニタリング〈TDM〉", summary: "" }
        }
      }
    }
  },
  kyucyumako3phealth: {
    name: "公衆衛生",
    order: 160,
    chapters: {
      "0": {
        name: "公衆衛生の総論",
        sections: {
          "1": { name: "公衆衛生のオリエンテーション", summary: "" }
        }
      },
      "1": {
        name: "スクリーニングと疫学研究",
        sections: {
          "1": { name: "感度・特異度・適中度", summary: "" },
          "2": { name: "ROC曲線", summary: "" },
          "3": { name: "検査前確率と検査後確率", summary: "" },
          "4": { name: "尤度比とオッズ", summary: "" },
          "5": { name: "疫学の指標", summary: "" },
          "6": { name: "データの収集", summary: "" },
          "7": { name: "バイアス・交互作用・誤差・妥当性", summary: "" },
          "8": { name: "研究デザイン", summary: "" },
          "9": { name: "症例対照研究とコホート研究", summary: "" },
          "10": { name: "Kaplan-Meier曲線", summary: "" },
          "11": { name: "相対危険度・寄与危険度［⊿］", summary: "" },
          "12": { name: "絶対リスク減少率とNNT［⊿］", summary: "" },
          "13": { name: "ITT解析［⊿］", summary: "" },
          "14": { name: "統計的仮説検定", summary: "" },
          "15": { name: "標準化罹患率と標準化死亡比〈SMR〉", summary: "" },
          "16": { name: "治験", summary: "" }
        }
      },
      "2": {
        name: "統計",
        sections: {
          "1": { name: "人口静態", summary: "" },
          "2": { name: "人口動態", summary: "" },
          "3": { name: "死因統計", summary: "" },
          "4": { name: "生命表", summary: "" },
          "5": { name: "国民生活基礎調査と患者調査", summary: "" },
          "6": { name: "世帯", summary: "" },
          "7": { name: "病床の機能", summary: "" },
          "8": { name: "雑多な統計［⊿］", summary: "" }
        }
      },
      "3": {
        name: "医療活動における重要法規",
        sections: {
          "1": { name: "国家的法規", summary: "" },
          "2": { name: "医師法", summary: "" },
          "3": { name: "医療法", summary: "" },
          "4": { name: "薬物関連法規［⊿］", summary: "" },
          "5": { name: "感染症法", summary: "" }
        }
      },
      "4": {
        name: "医療施設と従事者",
        sections: {
          "1": { name: "医療施設", summary: "" },
          "2": { name: "薬局と医薬分業", summary: "" },
          "3": { name: "業務独占と名称独占", summary: "" },
          "4": { name: "医療従事者の業務内容", summary: "" },
          "5": { name: "医療の質評価・改善", summary: "" },
          "6": { name: "医療安全支援センター［⊿］", summary: "" },
          "7": { name: "医療事故調査制度", summary: "" }
        }
      },
      "5": {
        name: "社会保障制度",
        sections: {
          "1": { name: "社会保障制度概論", summary: "" },
          "2": { name: "日本社会の現状", summary: "" },
          "3": { name: "医療保険", summary: "" },
          "4": { name: "医療保険の例外と特殊例", summary: "" },
          "5": { name: "公費医療", summary: "" },
          "6": { name: "生活保護制度［⊿］", summary: "" },
          "7": { name: "国民医療費", summary: "" }
        }
      },
      "6": {
        name: "予防医学と健康増進",
        sections: {
          "1": { name: "一次・二次・三次予防", summary: "" },
          "2": { name: "行動変容", summary: "" },
          "3": { name: "健康増進法", summary: "" },
          "4": { name: "国民健康・栄養調査", summary: "" },
          "5": { name: "健康日本21", summary: "" },
          "6": { name: "たばこ対策", summary: "" },
          "7": { name: "過度な飲酒対策", summary: "" },
          "8": { name: "予防接種", summary: "" }
        }
      },
      "7": {
        name: "食品と栄養",
        sections: {
          "1": { name: "食品保健", summary: "" },
          "2": { name: "日本人の食事摂取基準", summary: "" },
          "3": { name: "食事バランスガイド", summary: "" },
          "4": { name: "食中毒", summary: "" }
        }
      },
      "8": {
        name: "地域保健",
        sections: {
          "1": { name: "医療計画", summary: "" },
          "2": { name: "医療圏", summary: "" },
          "3": { name: "地域医療構想", summary: "" },
          "4": { name: "保健所と保健センター", summary: "" },
          "5": { name: "がん対策", summary: "" },
          "6": { name: "救急医療", summary: "" },
          "7": { name: "災害医療", summary: "" },
          "8": { name: "へき地医療", summary: "" },
          "9": { name: "在宅ケア", summary: "" },
          "10": { name: "地域の連携", summary: "" }
        }
      },
      "9": {
        name: "環境保健［⊿］",
        sections: {
          "1": { name: "大気汚染［⊿］", summary: "" },
          "2": { name: "水質汚濁［⊿］", summary: "" },
          "3": { name: "建築物衛生［⊿］", summary: "" },
          "4": { name: "エネルギー・資源・廃棄物［⊿］", summary: "" },
          "5": { name: "地球規模の環境問題［⊿］", summary: "" }
        }
      },
      "10": {
        name: "国際保健",
        sections: {
          "1": { name: "宣言・憲章・指針（概論）", summary: "" },
          "2": { name: "リスボン宣言", summary: "" },
          "3": { name: "プライマリヘルスケア〈PHC〉", summary: "" },
          "4": { name: "ヘルスプロモーション", summary: "" },
          "5": { name: "国際機関", summary: "" },
          "6": { name: "世界保健機関〈WHO〉", summary: "" },
          "7": { name: "ODAとJICA", summary: "" },
          "8": { name: "世界の保健医療", summary: "" },
          "9": { name: "国境を超える感染症の広がりとその対策", summary: "" }
        }
      },
      "11": {
        name: "母子保健［⊿］",
        sections: {
          "1": { name: "母子保健法［⊿］", summary: "" },
          "2": { name: "母体保護法［⊿］", summary: "" },
          "3": { name: "健やか親子21［⊿］", summary: "" },
          "4": { name: "児童福祉法［⊿］", summary: "" }
        }
      },
      "12": {
        name: "学校保健［⊿］",
        sections: {
          "1": { name: "学校感染症と出席停止［⊿］", summary: "" },
          "2": { name: "学校健康診断［⊿］", summary: "" },
          "3": { name: "学校医の職務［⊿］", summary: "" }
        }
      },
      "13": {
        name: "産業保健",
        sections: {
          "1": { name: "労働者災害補償保険〈労災保険〉［⊿］", summary: "" },
          "2": { name: "職業に起因する疾病［⊿］", summary: "" },
          "3": { name: "産業医", summary: "" },
          "4": { name: "労働衛生の3管理", summary: "" },
          "5": { name: "女性の労働と母性の保護［⊿］", summary: "" },
          "6": { name: "次世代育成支援対策推進法〈次世代法〉［⊿］", summary: "" },
          "7": { name: "トータルヘルスプロモーションプラン〈THP〉", summary: "" }
        }
      },
      "14": {
        name: "障害者保健",
        sections: {
          "1": { name: "障害者基本法［⊿］", summary: "" },
          "2": { name: "身体障害者福祉法と福祉事務所", summary: "" },
          "3": { name: "障害者総合支援法と自立支援給付", summary: "" },
          "4": { name: "精神保健概論", summary: "" },
          "5": { name: "精神科の入院", summary: "" },
          "6": { name: "国際生活機能分類〈ICF〉", summary: "" }
        }
      },
      "15": {
        name: "高齢者保健",
        sections: {
          "1": { name: "要介護・要支援認定［⊿］", summary: "" },
          "2": { name: "介護保険法", summary: "" },
          "3": { name: "地域包括支援センターと居宅介護支援事業所［⊿］", summary: "" },
          "4": { name: "高齢者医療確保法", summary: "" }
        }
      },
      "16": {
        name: "終末期医療と死",
        sections: {
          "1": { name: "緩和ケア", summary: "" },
          "2": { name: "死に臨む姿勢", summary: "" },
          "3": { name: "死体現象", summary: "" },
          "4": { name: "異状死体と検視・検案", summary: "" },
          "5": { name: "解剖とその分類", summary: "" },
          "6": { name: "死亡後に作成する文書", summary: "" },
          "7": { name: "脳死とその判定", summary: "" },
          "8": { name: "臓器移植", summary: "" }
        }
      }
    }
  },
};