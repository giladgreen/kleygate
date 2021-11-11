module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.TEXT,
      field: 'first_name',
    },
    familyName: {
      type: DataTypes.TEXT,
      field: 'family_name',
    },
    email: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      field: 'image_url',
    },
    token: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    tokenExpiration: {
      type: DataTypes.DATE,
      field: 'token_expiration',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
      allowNull: true,
    }
  }, {
    paranoid: true,
    tableName: 'users',
  });

  return User;
};
