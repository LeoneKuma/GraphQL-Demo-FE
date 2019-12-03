import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_HEROES, GET_HERO, ADD_HERO, DELETE_HERO, UPDATE_HERO } from './api-gql/hero/hero.gql'
import { escapeRegExp } from '@angular/compiler/src/util';
import { ApolloCurrentResult } from 'apollo-client';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HeroDetailInput } from './api-gql/output'
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private apollo: Apollo
  ) { }

  getHeroes(): Observable<any> {
    return this.apollo.watchQuery(
      {
        query: GET_HEROES,
        fetchPolicy: 'network-only',
      }).valueChanges.pipe(map<any, any>(({ data }) => data.getHeroes));
  }


  async getHero(id: number): Promise<Hero> {
    var res = await this.apollo.query(
      {
        query: GET_HERO,
        variables: {
          id: id
        },
        fetchPolicy: "network-only"
      }
    ).toPromise()
    return res.data["getHero"]
  }
  async deleteHero(id: number): Promise<boolean> {
    var res = await this.apollo.mutate(
      {
        mutation: DELETE_HERO,
        variables: {
          id: id
        }
      }
    ).toPromise();
    return res.data["deleteHero"]
  }
  async addHero(name: string): Promise<Hero> {
    const res = await this.apollo.mutate<any>(
      {
        mutation: ADD_HERO,
        variables: {
          name: name
        },
        update: (proxy, { data }: any) => {
          const dataCache = proxy.readQuery<any>({ query: GET_HEROES });
          dataCache.getHeroes.push(data.addHero);
          proxy.writeQuery({ query: GET_HEROES, data: dataCache });
        },
      }
    ).toPromise();
    return res.data.addHero;
  }
  async updateHero(heroDetail: HeroDetailInput): Promise<boolean> {
    var res = await this.apollo.mutate<any>(
      {
        mutation: UPDATE_HERO,
        variables: {
          heroDetail: heroDetail
        }
      }
    ).toPromise();
    return res.data.updateHero;
  }
}