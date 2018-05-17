/**
 * Created by songzhongkun on 2018/5/17.
 */

const cheerio = require('cheerio');
const http = require('https');
const iconv = require('iconv-lite');

const basic = {
  '科室': 'department',
  '职务': 'position',
  '职称': 'title',
  '专长': 'specialty',
};

module.exports = (req, res, next) => {

  try {

    let id = req.params.id;
    const url = `https://ss.bjmu.edu.cn/Html/Doctors/Main/Index_${id}.html`;

    http.get(url, function (resp) {

      const chunks = [];

      resp.on('data', function (chunk) {
        chunks.push(chunk);
      });

      resp.on('end', function () {
        //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
        const html = iconv.decode(Buffer.concat(chunks), 'utf-8');
        // console.log(html);

        const $ = cheerio.load(html, {decodeEntities: false});

        // 个人信息
        const summary = {};

        // 姓名
        summary.name = $('.title_all').text().trim();

        // 头像
        summary.avatar = $('.doct_img img').attr('src').trim();

        $('.doct_con').children('p').each(function (index, element) {
          const text = $(element).text().trim();
          if (text) {
            const arr = text.split('：');
            summary[basic[arr[0]]] = arr[1];
          }
        });

        // 简介
        const desc = [];
        $('.doct_Description').children('p').each(function (index, element) {
          const test = $(element).text().trim();
          test && desc.push(test);
        });
        summary.desc = desc;

        // 出诊信息
        let visitsInfo = {};
        let visitsTime = [];
        $('.PCDisplay table tbody').children().not('.frist_tr').each(function (index, element) {
          visitsTime = [];
          $(element).children().each(function (sub_index, sub_element) {
            const text = $(sub_element).text().trim();
            if (text) {
              if (index == 0) {
                sub_index - 1 > 0 && visitsTime.push({[sub_index - 1]: text});
              } else {
                sub_index > 0 && visitsTime.push({[sub_index]: text});
              }
            }
          });
          const timeName = index == 0 ? 'am' : 'pm';
          visitsInfo[timeName] = visitsTime;
        });

        summary.visitsInfo = visitsInfo;

        res.json(summary);

      });

    });
  } catch (err) {
    next(err);
  }

};