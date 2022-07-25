module.exports = (sequelize, DataTypes) => {
    const image = sequelize.define(
      'image',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PK',
        },
        image_name: {
          type: DataTypes.STRING(255),
          comment: '이미지 이름',
        },
      },
      {
        charset: 'utf8', // 한국어 설정
        collate: 'utf8_general_ci', // 한국어 설정
        tableName: 'tbl_image', // 테이블 이름
        timestamps: true, // createAt & updateAt 활성화
        paranoid: false, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
      },
    )
    image.associate = (models) => {
      image.belongsTo(models.User, {
        foreignKey: 'user_id',
        sourceKey: 'id',
      })
      image.belongsTo(models.Access, {
        foreignKey: 'access_id',
        sourceKey: 'id',
      })
    }
    return image
  }
  