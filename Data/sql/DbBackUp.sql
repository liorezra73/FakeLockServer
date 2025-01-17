USE [master]
GO
/****** Object:  Database [FakeLock]    Script Date: 22/02/2020 13:54:01 ******/
CREATE DATABASE [FakeLock]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FakeLock', FILENAME = N'C:\Users\LiorEzra73\Desktop\פרוייקט יהלום\Db\FakeLock.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'FakeLock_log', FILENAME = N'C:\Users\LiorEzra73\Desktop\פרוייקט יהלום\Db\FakeLock_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [FakeLock] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FakeLock].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FakeLock] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FakeLock] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FakeLock] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FakeLock] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FakeLock] SET ARITHABORT OFF 
GO
ALTER DATABASE [FakeLock] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FakeLock] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FakeLock] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FakeLock] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FakeLock] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FakeLock] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FakeLock] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FakeLock] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FakeLock] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FakeLock] SET  DISABLE_BROKER 
GO
ALTER DATABASE [FakeLock] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FakeLock] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FakeLock] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FakeLock] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FakeLock] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FakeLock] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FakeLock] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FakeLock] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [FakeLock] SET  MULTI_USER 
GO
ALTER DATABASE [FakeLock] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FakeLock] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FakeLock] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FakeLock] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [FakeLock] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [FakeLock] SET QUERY_STORE = OFF
GO
USE [FakeLock]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [FakeLock]
GO
/****** Object:  Table [dbo].[Comments]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comments](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Content] [varchar](1000) NULL,
	[PublishDate] [datetime] NOT NULL,
	[UserId] [bigint] NOT NULL,
	[PostId] [bigint] NOT NULL,
 CONSTRAINT [PK__Comments__3214EC07FDE9BC8D] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentsLikes]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentsLikes](
	[UserId] [bigint] NOT NULL,
	[CommentId] [bigint] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentsTags]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentsTags](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](200) NOT NULL,
	[CommentId] [bigint] NOT NULL,
 CONSTRAINT [PK__Comments__3214EC078A2ACCE6] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentsUserTags]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentsUserTags](
	[TaggedId] [bigint] NOT NULL,
	[CommentId] [bigint] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Posts]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Posts](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Text] [varchar](1000) NOT NULL,
	[Photo] [varchar](max) NOT NULL,
	[Location] [geography] NOT NULL,
	[PublishDate] [datetime] NOT NULL,
	[UserId] [bigint] NOT NULL,
 CONSTRAINT [PK__Posts__3214EC07B33FB925] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsLikes]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsLikes](
	[UserId] [bigint] NOT NULL,
	[PostId] [bigint] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsTags]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsTags](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](200) NOT NULL,
	[PostId] [bigint] NOT NULL,
 CONSTRAINT [PK__PostsTag__3214EC070B9492FD] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsUserTags]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsUserTags](
	[TaggedId] [bigint] NOT NULL,
	[PostId] [bigint] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[FullName] [varchar](100) NOT NULL,
	[Username] [varchar](200) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[BirthDate] [date] NOT NULL,
	[Address] [varchar](200) NOT NULL,
	[JobAddress] [varchar](200) NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ__Users__536C85E408AC4610] UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK__Comments__PostId__35BCFE0A] FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK__Comments__PostId__35BCFE0A]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK__Comments__UserId__34C8D9D1] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK__Comments__UserId__34C8D9D1]
GO
ALTER TABLE [dbo].[CommentsLikes]  WITH CHECK ADD  CONSTRAINT [FK__CommentsL__Comme__4316F928] FOREIGN KEY([CommentId])
REFERENCES [dbo].[Comments] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CommentsLikes] CHECK CONSTRAINT [FK__CommentsL__Comme__4316F928]
GO
ALTER TABLE [dbo].[CommentsLikes]  WITH CHECK ADD  CONSTRAINT [FK_CommentsLikes_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[CommentsLikes] CHECK CONSTRAINT [FK_CommentsLikes_Users]
GO
ALTER TABLE [dbo].[CommentsTags]  WITH CHECK ADD  CONSTRAINT [FK__CommentsT__Comme__45F365D3] FOREIGN KEY([CommentId])
REFERENCES [dbo].[Comments] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CommentsTags] CHECK CONSTRAINT [FK__CommentsT__Comme__45F365D3]
GO
ALTER TABLE [dbo].[CommentsUserTags]  WITH CHECK ADD  CONSTRAINT [FK__CommentsU__Comme__4F7CD00D] FOREIGN KEY([CommentId])
REFERENCES [dbo].[Comments] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CommentsUserTags] CHECK CONSTRAINT [FK__CommentsU__Comme__4F7CD00D]
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD  CONSTRAINT [FK_Posts_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Posts] CHECK CONSTRAINT [FK_Posts_Users]
GO
ALTER TABLE [dbo].[PostsLikes]  WITH CHECK ADD  CONSTRAINT [FK__PostsLike__PostI__403A8C7D] FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PostsLikes] CHECK CONSTRAINT [FK__PostsLike__PostI__403A8C7D]
GO
ALTER TABLE [dbo].[PostsLikes]  WITH CHECK ADD  CONSTRAINT [FK_PostsLikes_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[PostsLikes] CHECK CONSTRAINT [FK_PostsLikes_Users]
GO
ALTER TABLE [dbo].[PostsTags]  WITH CHECK ADD  CONSTRAINT [FK__PostsTag__PostId__48CFD27E] FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PostsTags] CHECK CONSTRAINT [FK__PostsTag__PostId__48CFD27E]
GO
ALTER TABLE [dbo].[PostsUserTags]  WITH CHECK ADD  CONSTRAINT [FK__PostsUser__PostI__4BAC3F29] FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PostsUserTags] CHECK CONSTRAINT [FK__PostsUser__PostI__4BAC3F29]
GO
/****** Object:  StoredProcedure [dbo].[AddLikeToComment]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[AddLikeToComment]
	-- Add the parameters for the stored procedure here
	@userId bigint,
	@commentId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into CommentsLikes(UserId,CommentId)
	values(@userId,@commentId)
END
GO
/****** Object:  StoredProcedure [dbo].[AddLikeToPost]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[AddLikeToPost]
	-- Add the parameters for the stored procedure here
	@userId bigint,
	@postId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into PostsLikes(UserId,PostId)
	values(@userId,@postId);
	
END
GO
/****** Object:  StoredProcedure [dbo].[ChangeUserPassword]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ChangeUserPassword]
	-- Add the parameters for the stored procedure here
	@password varchar(50),
	@username varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE Users
    SET Password = @password
	output inserted.Username
    WHERE Username = @username;
END
GO
/****** Object:  StoredProcedure [dbo].[CreateNewComment]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CreateNewComment]
	-- Add the parameters for the stored procedure here
	@content varchar(1000) = null,
	@publishDate datetime,
	@userId bigint,
	@postId bigint,
	@tagsJson nvarchar(max) = null,
	@usersTagsJson nvarchar(max)=null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	declare @id bigint
	SET NOCOUNT ON;
	--set @commentIdExist = (select Id as bigint from FakeLock.dbo.Comments where Id = @commentId);

	insert FakeLock.dbo.Comments (Content,PublishDate,UserId,PostId)
	values (@content,@publishDate,@userId,@postId);
	set @id = scope_identity();

	if @tagsJson is not null
	begin
	INSERT INTO CommentsTags(CommentId,Title)
    select @id,j.value 
	FROM OPENJSON(@tagsJson) as j
	end

	if @usersTagsJson is not null
	begin
	INSERT INTO CommentsUserTags(CommentId,TaggedId) 
    SELECT @id,j.value
    FROM OPENJSON(@usersTagsJson) as j
	end

	exec [dbo].[GetCommentById] @id,@userId

END
GO
/****** Object:  StoredProcedure [dbo].[CreatePost]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CreatePost] 
	-- Add the parameters for the stored procedure here
	@text varchar(200),
	@photo varchar(max),
	@userId bigint,
	@publishDate datetime,
	@latitude float,
	@longtitude float,
	@tagsJson nvarchar(max) = null,
	@usersTagsJson nvarchar(max)= null
	--//@id int output
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	declare @id int;
	SET NOCOUNT ON;
	
    -- Insert statements for procedure here
	insert Posts (Text,Photo,UserId,PublishDate,Location)
	output  inserted.Id
	values (@text,@photo,@userId,@publishDate,geography::Point(@latitude, @longtitude, 4326))
	set @id = scope_identity();
	
	if @tagsJson is not null
	begin
	INSERT INTO PostsTags(PostId,Title)
    select @id,j.value 
	FROM OPENJSON(@tagsJson) as j
	end

	if @usersTagsJson is not null
	begin
	INSERT INTO PostsUserTags(PostId,TaggedId) 
    SELECT @id,j.value
    FROM OPENJSON(@usersTagsJson) as j
	end

END
GO
/****** Object:  StoredProcedure [dbo].[CreateUser]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CreateUser]
	-- Add the parameters for the stored procedure here
	@fullName varchar(50),
	@username varchar(50),
	@password nvarchar(max),
	@birthDate date,
	@address varchar(50),
	@jobAddress varchar(50)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
INSERT INTO Users(Fullname, Username, Password,BirthDate,Address,JobAddress) 
    VALUES (@fullName, @username, @password,@birthDate,@address,@jobAddress)
	select Id
	from Users
	where Username = @username

	END
GO
/****** Object:  StoredProcedure [dbo].[DeleteComment]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeleteComment]
	-- Add the parameters for the stored procedure here
	@id bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	delete 
	from FakeLock.dbo.Comments
	where Id = @id;
END
GO
/****** Object:  StoredProcedure [dbo].[DeleteCommentLike]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeleteCommentLike]
	-- Add the parameters for the stored procedure here
	@userId bigint,
	@commentId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	delete from CommentsLikes
	where CommentId = @commentId and UserId = @userId
END
GO
/****** Object:  StoredProcedure [dbo].[DeletePost]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeletePost]
	-- Add the parameters for the stored procedure here
	@id int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DELETE 
	FROM Posts 
	output deleted.Id
	WHERE Id = @id;
END
GO
/****** Object:  StoredProcedure [dbo].[DeletePostLike]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeletePostLike]
	-- Add the parameters for the stored procedure here
	@userId bigint,
	@postId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	delete from PostsLikes
	where PostId = @postId and UserId = @userId
END
GO
/****** Object:  StoredProcedure [dbo].[FilterPosts]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[FilterPosts]
	-- Add the parameters for the stored procedure here
    @publishers nvarchar(max) =null,
	@startDate datetime = null,
	@endDate datetime = null,
	@positionLat float=null,
	@positionLong float = null,
	@distance float = null,
	@tagsJson nvarchar(max)= null,
	@userTags nvarchar(max) = null,
	@orderBy varchar(50) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
		declare @tmpTable table
	(
	postId bigint,
	photo varchar(max),
	location geography,
	publishDate datetime,
	likes int

	);
	SET NOCOUNT ON;
	IF @positionLong is not null 
	and @positionLat is not null 
	and @distance is not null   
    BEGIN
	   DECLARE @location AS geography = geography::Point( @positionLat,@positionLong, 4326)
	DECLARE @range AS geography = @location.STBuffer(@distance)
    END

	

	insert into @tmpTable(postId,photo,location,publishDate,likes)
	SELECT p.Id,p.Photo,p.Location,p.PublishDate,0
	FROM Posts p
	WHERE 
	(@range is null or p.Location.STIntersects(@Range) = 1) and
	(
	   (@startDate is null or @startDate <= p.PublishDate) 
	    and 
	   (@endDate is null or @endDate >= p.PublishDate)
	)
	and
	(@publishers is null or p.UserId in (select value from openjson(@publishers)))
	and
	(@tagsJson is null or p.Id  in (select tags.PostId 
                                    from 
									(select pt.PostId,pt.Title from PostsTags pt
									union all
									select c.PostId,ct.Title  from CommentsTags ct 
									                               join
																   Comments c on ct.CommentId = c.Id
									) tags
                                     where tags.Title in 
			                               (select distinct value as title 
										   from openjson(@tagsJson))
										   
				                     ))
    and
	(@userTags is null or p.Id in (select usersTags.PostId
	                               from 
								      (select put.PostId,put.TaggedId from PostsUserTags put
									  union all
									  select c.PostId,cut.TaggedId from CommentsUserTags cut
									                                    join 
																		Comments c on cut.CommentId = c.Id
									  )usersTags
								   where usersTags.TaggedId in (
								                          select distinct value as taggedId
														  from openjson(@userTags))
								     ))

UPDATE @tmpTable 
SET likes = (select count(pl.UserId)
             from PostsLikes pl)
where postId in (select pl.PostId
                 from PostsLikes pl)




	SELECT *
FROM @tmpTable t
ORDER BY
(CASE
    WHEN @orderBy = 'likes' then  t.likes 
    WHEN @orderBy = 'date' then  t.publishDate 
    ELSE t.postId 
END )DESC;

	
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllPosts]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE  [dbo].[GetAllPosts]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select p.Id,p.Photo,p.PublishDate,
	(select u.Username from Users u where u.Id = p.UserId) as username,
	(select count(pl.UserId) from PostsLikes pl where pl.PostId = p.Id) as likes,
	(select count(c.Id) from Comments c where c.PostId = p.Id) as commentsSum
	from Posts p
	order by p.PublishDate desc
END
GO
/****** Object:  StoredProcedure [dbo].[GetCommentById]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetCommentById]
	-- Add the parameters for the stored procedure here
	@id bigint,
	@likedUserId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT c.Id,c.Content,c.PublishDate,
	(select u.Username from Users u where u.Id = c.UserId) as username,
	(select count(cl.UserId) as counts from CommentsLikes cl where cl.CommentId = c.Id)  as likes
	from Comments c
	where Id = @id;

	select distinct Title
	from FakeLock.dbo.CommentsTags
	where CommentId = @id;

    select distinct u.Id as userId,u.Username
	from FakeLock.dbo.CommentsUserTags ct,FakeLock.dbo.Users u
	where ct.CommentId = @id and u.Id = ct.TaggedId;

	select cl.UserId as isLikedByUser
	from CommentsLikes cl
	where cl.CommentId = @id and cl.UserId = @likedUserId


END
GO
/****** Object:  StoredProcedure [dbo].[GetCommentsByPostId]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetCommentsByPostId]
	-- Add the parameters for the stored procedure here
	@id bigint,
	@userId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select c.Id,c.Content,c.PublishDate,
(select ct.Title from CommentsTags ct where ct.CommentId = c.Id for json auto) as tags,
(select count(cl.UserId) from CommentsLikes cl where cl.CommentId = c.Id) as likes,
(select u.Id,u.Username from CommentsUserTags cut,Users u 
 where cut.CommentId = c.Id and u.Id = cut.TaggedId for json path) as usersTags ,
(select (select cl.UserId
        from CommentsLikes cl 
        where cl.CommentId = c.Id and cl.UserId = @userId)  as liked) as userLiked,
(select u.Username from Users u where u.Id = c.UserId) as username

From Comments c
where c.PostId =@id
order by c.PublishDate desc


--select *
--from Comments c,CommentsLikes cl
--where c.Id = cl.CommentId and cl.UserId = 55


END
GO
/****** Object:  StoredProcedure [dbo].[GetPostById]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetPostById] 
	-- Add the parameters for the stored procedure here
	@id bigint,
	@likedUserId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	declare @userId bigint;
	SET NOCOUNT ON;
	set @userId = (select UserId from FakeLock.dbo.Posts where Id = @id);

    -- Insert statements for procedure here
	SELECT 
	p.Id ,
	p.Location ,
	p.Photo ,
	p.PublishDate ,
	p.Text 
	FROM FakeLock.dbo.Posts p
	WHERE p.Id = @id 

	select Id,Username 
	from FakeLock.dbo.Users
	where Id = @userId

	select distinct Title
	from FakeLock.dbo.PostsTags
	where PostId = @id;

    select distinct u.Id as userId,u.Username
	from FakeLock.dbo.PostsUserTags pt,FakeLock.dbo.Users u
	where pt.PostId = @id and u.Id = pt.TaggedId;

	select count(pl.UserId) as likes
	from FakeLock.dbo.PostsLikes pl
	where PostId = @id

	select count(c.Id) as commentsCount
	from Comments c
	where c.PostId = @id

	select pl.UserId as isLikedByUser
	from PostsLikes pl
	where pl.PostId = @id and pl.UserId = @likedUserId




END
GO
/****** Object:  StoredProcedure [dbo].[GetPostsByUserId]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetPostsByUserId] 
	-- Add the parameters for the stored procedure here
	@userId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select *
	from Posts
	where UserId = @userId
END
GO
/****** Object:  StoredProcedure [dbo].[GetUserById]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetUserById]
	-- Add the parameters for the stored procedure here
	@id int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * 
	FROM Users
	WHERE Users.Id = id
	END
GO
/****** Object:  StoredProcedure [dbo].[GetUserByUsername]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE  [dbo].[GetUserByUsername]
	-- Add the parameters for the stored procedure here
	@username varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select top 1 *
	from Users
	where Users.Username = @username
END
GO
/****** Object:  StoredProcedure [dbo].[GetUsersByStartsWith]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetUsersByStartsWith]
	-- Add the parameters for the stored procedure here
	@username varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT u.Id,u.Username from Users u where u.Username like @username+'%'
END
GO
/****** Object:  StoredProcedure [dbo].[Test]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Test]
	-- Add the parameters for the stored procedure here
    @publishers nvarchar(max) =null,
	@startDate datetime = null,
	@endDate datetime = null,
	@positionLat float=null,
	@positionLong float = null,
	@distance float = null,
	@tagsJson nvarchar(max)= null,
	@userTags nvarchar(max) = null,
	@orderBy varchar(50) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	declare @tmpTable table
	(
	postId bigint,
	photo varchar(max),
	location geography,
	publishDate datetime,
	likes int

	);
	SET NOCOUNT ON;
	IF @positionLong is not null 
	and @positionLat is not null 
	and @distance is not null   
    BEGIN
	   DECLARE @location AS geography = geography::Point( @positionLat,@positionLong, 4326)
	DECLARE @range AS geography = @location.STBuffer(@distance)
    END

	

	insert into @tmpTable(postId,photo,location,publishDate,likes)
	SELECT p.Id,p.Photo,p.Location,p.PublishDate,0
	FROM Posts p
	WHERE 
	(@range is null or p.Location.STIntersects(@Range) = 1) and
	(
	   (@startDate is null or @startDate <= p.PublishDate) 
	    and 
	   (@endDate is null or @endDate >= p.PublishDate)
	)
	and
	(@publishers is null or p.UserId in (select value from openjson(@publishers)))
	and
	(@tagsJson is null or p.Id  in (select tags.PostId 
                                    from 
									(select pt.PostId,pt.Title from PostsTags pt
									union all
									select c.PostId,ct.Title  from CommentsTags ct 
									                               join
																   Comments c on ct.CommentId = c.Id
									) tags
                                     where tags.Title in 
			                               (select distinct value as title 
										   from openjson(@tagsJson))
										   
				                     ))
    and
	(@userTags is null or p.Id in (select usersTags.PostId
	                               from 
								      (select put.PostId,put.TaggedId from PostsUserTags put
									  union all
									  select c.PostId,cut.TaggedId from CommentsUserTags cut
									                                    join 
																		Comments c on cut.CommentId = c.Id
									  )usersTags
								   where usersTags.TaggedId in (
								                          select distinct value as taggedId
														  from openjson(@userTags))
								     ))

UPDATE @tmpTable 
SET likes = (select count(pl.UserId)
             from PostsLikes pl)
where postId in (select pl.PostId
                 from PostsLikes pl)




	select * from @tmpTable

             

	
END
GO
/****** Object:  StoredProcedure [dbo].[UpdateUser]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE  [dbo].[UpdateUser]
	-- Add the parameters for the stored procedure here
	@fullName varchar(50),
	@birthDate date,
	@address varchar(50),
	@jobAddress varchar(50),
	@username varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE Users
    SET FullName = @fullName, BirthDate = @birthDate,Address=@address,JobAddress=@jobAddress
    WHERE Username = @username;
	select top 1 * from Users where Username = @username;
END
GO
/****** Object:  StoredProcedure [dbo].[UserLikedComment]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UserLikedComment]
	-- Add the parameters for the stored procedure here
	@userId bigint,
	@commentId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT *
	from CommentsLikes cl
	where cl.CommentId = @commentId and cl.UserId = @userId
END
GO
/****** Object:  StoredProcedure [dbo].[UserLikedPost]    Script Date: 22/02/2020 13:54:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UserLikedPost]
	-- Add the parameters for the stored procedure here
	@userId bigint,
	@postId bigint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select *
	from PostsLikes pl
	where pl.PostId = @postId and pl.UserId = @userId
END
GO
USE [master]
GO
ALTER DATABASE [FakeLock] SET  READ_WRITE 
GO
