drop table familyRecipes;
drop table familyRecipesIngredients;


CREATE TABLE [dbo].[familyRecipes](
  [recipe_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID() primary key ,
  [username] [varchar](30) NOT NULL foreign key references users([username]),
  [title] [varchar](300) NOT NULL,
  [image] [varchar] (300) NOT NULL,
  [familyMember] [varchar] (300) NOT NULL,
  [specialOccasion] [varchar] (300) NOT NULL,
  [instructions] [varchar] (300) NOT NULL,


)

CREATE TABLE [dbo].[familyRecipesIngredients](
    [recipe_id] [UNIQUEIDENTIFIER] not null foreign key references familyRecipes([recipe_id]),
    ingredient_name [varchar](300) not null,
    [amount] [numeric] not null ,
    [unit] [varchar](300) not null ,
    primary key ([recipe_id],[ingredient_name]),
)



