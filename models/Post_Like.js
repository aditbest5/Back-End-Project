module.exports = (sequelize, DataTypes) => {
  const Post_Like = sequelize.define(
    "Post_Like",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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

  return Post_Like;
};
