module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      media: {
        type: DataTypes.STRING,
      },
      caption: {
        type: DataTypes.STRING,
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
  Post.associate = (models) => {
    Post.hasMany(models.Post_Like, { foreignKey: "postId" });
    Post.hasMany(models.Comment, { foreignKey: "postId" });
  };

  return Post;
};
