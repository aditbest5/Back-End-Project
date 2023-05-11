module.exports = (sequelize, DataTypes) => {
  const Comment_Like = sequelize.define(
    "Comment_Like",
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
  return Comment_Like;
};
