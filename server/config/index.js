/**
 * Created by songzhongkun on 2018/5/11.
 */
const config = {
  development: {
    mysql: {
      cms: {
        host: '47.98.230.130',
        port: 3306,
        user: 'root',
        password: 'q1w2e3r4',
        database: 'bookstore',
        debug: ['ComQueryPacket'],
      },
    },
  },
  production: {}
};

module.exports = config['development'];