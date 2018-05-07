/**
 * Created by songzhongkun on 2018/5/7.
 */

module.exports = (req, res, next) => {

  const data = {
    code: 200,
    msg: 'success',
    body: {
      bookList: [
        {
          id: 1,
          name: '飞狐外传',
        },
        {
          id: 2,
          name: '雪山飞狐',
        },
        {
          id: 3,
          name: '连城诀',
        },
        {
          id: 4,
          name: '天龙八部',
        },
        {
          id: 5,
          name: '射雕英雄传',
        },
        {
          id: 6,
          name: '白马啸西风',
        },
        {
          id: 7,
          name: '鹿鼎记',
        },
        {
          id: 8,
          name: '笑傲江湖',
        },
        {
          id: 9,
          name: '书剑恩仇录',
        },
        {
          id: 10,
          name: '神雕侠侣',
        },
        {
          id: 11,
          name: '侠客行',
        },
        {
          id: 12,
          name: '倚天屠龙记',
        },
        {
          id: 13,
          name: '碧血剑',
        },
        {
          id: 14,
          name: '鸳鸯刀',
        },
      ]
    }
  };

  res.json(data)
};