import gql from 'graphql-tag';
// import {HeroDetailInput} from '../output'
// export class HeroDetailInput {
//     id: number;
//     name: string;
//     description: string;
// }
export const GET_HEROES = gql`
query{
    getHeroes{
      id,
      name,
      description
    }
  }
`

export const GET_HERO = gql`
query getHero($id:Int!){
  getHero(id:$id){
    id,
    name,
    description
  }
}
`

export const ADD_HERO = gql`
mutation($name:String!){
  addHero(name:$name){
        id,
        name,
        description
  }
}
`
export const DELETE_HERO = gql`
mutation deleteHero($id:Int!){
    deleteHero(id:$id)
}
`
export const UPDATE_HERO = gql`
mutation ($heroDetail:HeroDetailInput!){
    updateHero(heroDetail:$heroDetail){
      id,
      name,
      description
    }
}
`