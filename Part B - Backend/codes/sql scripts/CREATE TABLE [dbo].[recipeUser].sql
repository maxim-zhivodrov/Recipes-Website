CREATE TABLE [dbo].[recipeUserInfo](
	[username]  [varchar](30) foreign key references dbo.users([username]),
	[recipeID] [varchar](300) NOT NULL,
	[watched] [bit] NOT NULL,
	[inFavorites] [bit] NOT NULL,
	primary key ([username],[recipeID]),
)

insert into dbo.recipeUserInfo VALUES('seanav','492560','True','False')