module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "unverified",
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {}
  );

  // User.associate = (models) => {
  //   User.hasOne(models.Cart, { foreignKey: "userId" });
  // };
  User.associate = (models) => {
    User.hasOne(models.Profile, { foreignKey: "userId" });
    User.hasMany(models.Post, { foreignKey: "userId" });
    User.hasMany(models.Comment, { foreignKey: "userId" });
    User.hasMany(models.Post_Like, { foreignKey: "userId" });
    User.hasMany(models.Comment_Like, { foreignKey: "userId" });
    User.hasMany(models.Token, { foreignKey: "userId" });
  };

  return User;
};
