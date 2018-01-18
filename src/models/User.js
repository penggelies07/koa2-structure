module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      comment: '用户登录账号'
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: '用户登录密码'
    },
    // nickname: {
    //   type: DataTypes.STRING(60),
    //   comment: 'QQ nickname'
    // },
    realname: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: '真实姓名'
    },
    sex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '性别 1男 2女 0未知'
    },
    age: {
      type: DataTypes.INTEGER,
      comment: '年龄'
    },
    birthday: {
      type: DataTypes.DATE,
      comment: '生日'
    },
    avatar: {
      type: DataTypes.TEXT,
      comment: '用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效'
    },
    qq: {
      type: DataTypes.STRING(15),
      comment: 'QQ号码'
    },
    email: {
      type: DataTypes.STRING(20),
      comment: '邮箱'
    },
    // openid: {
    //   type: DataTypes.STRING,
    //   comment: 'QQ OPENID 用户的标识，对当前公众号唯一'
    // },
    // accessToken: {
    //   type: DataTypes.STRING,
    //   comment: 'QQ access_token'
    // },

    // customAvatar: {
    //   type: DataTypes.STRING,
    //   comment: '自定义头像'
    // },
    mobile: {
      type: DataTypes.STRING(20),
      comment: '手机号码'
    },
    smobile: {
      type: DataTypes.STRING(10),
      comment: '手机短号'
    },
    country: {
      type: DataTypes.STRING(20),
      comment: '用户所在国家'
    },
    province: {
      type: DataTypes.STRING(20),
      comment: '用户所在省份'
    },
    city: {
      type: DataTypes.STRING(20),
      comment: '用户所在城市'
    },
    latestLoginTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '用户最后一次登录时间'
    }
  }, {
    classMethods: {
      associate: function (models) {
        this.hasMany(models.UserTeam, {foreignKey: 'userId'})
        this.hasMany(models.UserTask, {foreignKey: 'userId'})
        this.hasMany(models.UserNotice, {foreignKey: 'userId'})
      }
    },
    indexes: [{
      method: 'BTREE',
      fields: ['username']
    }, {
      method: 'BTREE',
      fields: ['realname']
    }, {
      method: 'BTREE',
      fields: ['birthday']
    }, {
      method: 'BTREE',
      fields: ['age']
    }],
    tableName: 'user',
    comment: '用户信息表'
  })
  return User
}
