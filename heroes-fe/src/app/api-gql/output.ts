export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Hero = {
   __typename?: 'Hero',
  /** 英雄的id */
  id: Scalars['Int'],
  /** 英雄的名字 */
  name: Scalars['String'],
  /** 英雄的简介 */
  description: Scalars['String'],
};

export type HeroDetailInput = {
  /** 英雄id */
  id?: Maybe<Scalars['Int']>,
  /** 英雄名称 */
  name: Scalars['String'],
  /** 英雄的简介 */
  description?: Maybe<Scalars['String']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  /** 增加一个英雄 */
  addHero: Hero,
  /** 修改英雄信息 */
  updateHero: Hero,
  /** 删除一位英雄 */
  deleteHero: Scalars['Boolean'],
};


export type MutationAddHeroArgs = {
  name: Scalars['String']
};


export type MutationUpdateHeroArgs = {
  heroDetail: HeroDetailInput
};


export type MutationDeleteHeroArgs = {
  id: Scalars['Int']
};

export type Query = {
   __typename?: 'Query',
  /** 查询一个英雄 */
  getHero: Hero,
  /** 查询所有英雄 */
  getHeroes: Array<Hero>,
};


export type QueryGetHeroArgs = {
  id: Scalars['Int']
};
