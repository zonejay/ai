export enum MessageType {
  USER = 'user',
  ASSISTANT = 'assistant',
}

enum DECORATION_TYPES {
  SPACE_TYPE = '空间类型',
  DESIGN_STYLE = '设计风格',
  // 家装
  HOME_DECORATION = '家装',
  // 硬装
  HARDWARE = '硬装',
  // 材质
  MATERIAL = '材质',
}

export const DECORATION_STYLES = [
  [
    DECORATION_TYPES.SPACE_TYPE,
    [
      '客厅',
      '餐厅',
      '客餐厅',
      '卧室',
      '厨房',
      '书房',
      '卫生间',
      '儿童房',
      '阳台',
      '餐吧',
      '电脑房',
    ],
  ],
  [
    DECORATION_TYPES.DESIGN_STYLE,
    ['北欧', '现代', '中式', '奶油', '法式', '美式', '原木', '轻奢', '日式', '地中海', '洛可可'],
  ],
  [
    DECORATION_TYPES.HOME_DECORATION,
    // 家装23个
    [
      '床',
      '儿童床',
      '婴儿床',
      '榻榻米',
      '多人沙发',
      '双人沙发',
      '单人沙发',
      'L型沙发',
      '懒人沙发',
      '餐桌',
      '茶几',
      '书桌',
      '儿童桌椅',
      '吧台',
      '玄关台',
      '梳妆台',
      '电视',
      '空调',
      '冰箱',
      '洗衣机',
      '台式电脑',
      '笔记本',
      '烤箱',
    ],
  ],
  [
    DECORATION_TYPES.HARDWARE,
    // 硬装
    ['窗户', '飘窗', '落地窗', '门', '推拉门', '墙面', '地面'],
  ],
  [
    DECORATION_TYPES.MATERIAL,
    // 材质
    ['大理石', '棉麻', '绒布', '皮革', '墙纸', '实木', '陶瓷', '金属', '玻璃', '瓷砖'],
  ],
];
