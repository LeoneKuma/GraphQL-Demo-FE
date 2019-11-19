import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { GET_HEROES, GET_HERO,ADD_HERO,DELETE_HERO,UPDATE_HERO,HeroDetailInput} from './api-gql/hero/hero.gql'
import { escapeRegExp } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient,
    private apollo: Apollo
  ) { }

   async getHeroes():Promise<Hero[]>{
      var res=await this.apollo.query(
        {
          query: GET_HEROES,
        }
      ).toPromise()
      var heroes=[...res.data["getHeroes"]]
      return heroes
  }

  async getHero(id:number):Promise<Hero>{
    var res=await this.apollo.query(
      {
        query:GET_HERO,
        variables:{
          id:id
        }
      }
    ).toPromise()
    return res.data["getHero"]
  }
  async deleteHero(id:number):Promise<boolean>{
    var res=await this.apollo.mutate(
      {
        mutation:DELETE_HERO,
        variables:{
          id:id
        }
      }
    ).toPromise();
    return res.data["deleteHero"]
  }
  async addHero(name:string):Promise<Hero>{
    console.log("add Hero")
    var res=await this.apollo.mutate(
      {
        mutation:ADD_HERO,
        variables:{
          name:name
        }
      }
    ).toPromise();
    console.log("addHero")
    console.log(res.data["addHero"])
    return res.data["addHero"]
  }
  async updateHero(heroDetail:HeroDetailInput):Promise<Hero>{
    var res=await this.apollo.mutate(
      {
        mutation:UPDATE_HERO,
        variables:{
          heroDetail:heroDetail
        }
      }
    ).toPromise();
    console.log(res)
    return res.data["updateHero"]
  }
}