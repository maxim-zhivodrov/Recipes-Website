CREATE TABLE [dbo].[personalRecipes](
	[id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[title] [varchar](300) NOT NULL,
	[image] [varchar] (300) NOT NULL,
	[makingTime] [integer] NOT NULL,
	[likes] [integer] NOT NULL,
	[vegetarian] [bit] NOT NULL,
	[vegan] [bit] NOT NULL,
	[glutenFree] [bit]  NOT NULL,
)

