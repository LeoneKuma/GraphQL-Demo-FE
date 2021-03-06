import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_HEROES, GET_HERO, ADD_HERO, DELETE_HERO, UPDATE_HERO } from './api-gql/hero/hero.gql'
import { escapeRegExp } from '@angular/compiler/src/util';
import { ApolloCurrentResult, ApolloQueryResult } from 'apollo-client';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HeroDetailInput, Hero, Query } from './api-gql/output'
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

  getHeroes(num: number = 100): Observable<Hero[]> {
    return this.apollo.watchQuery<Query>(
      {
        query: GET_HEROES,
        fetchPolicy: 'network-only'
      }).valueChanges.pipe(
        map<ApolloQueryResult<Query>, Hero[]>(
          ({ data }) => {
            return data.getHeroes.filter((item, index) => index >= 0 && index <= num)
          }
        )
      );
  }



  // 这个方法可以用于绑定响应式的数据
  // getHero(id: number): Observable<Hero> {
  //   const res = this.apollo.watchQuery<Query>(
  //     {
  //       query: GET_HERO,
  //       variables: {
  //         id
  //       },
  //     }
  //   ).valueChanges.pipe(
  //     map<ApolloQueryResult<Query>, Hero>(
  //       ({ data }) => {
  //         return data.getHero;
  //       }

  //     )
  //   );
  //   res.subscribe(data => {
  //   })
  //   return res;
  // }

  // 这个方法可以通过await直接获取一个英雄实体
  async getHero(id: number): Promise<Hero> {
    const res = await this.apollo.watchQuery<Query>(
      {
        query: GET_HERO,
        variables: {
          id
        },
      }
    ).result();
    return res.data.getHero;

  }
  async deleteHero(id: number): Promise<boolean> {
    const res = await this.apollo.mutate(
      {
        mutation: DELETE_HERO,
        variables: {
          id: id
        },
        update: (proxy, { data }: any) => {
          const dataCache = proxy.readQuery<any>({ query: GET_HEROES });
          const heroList: Hero[] = dataCache.getHeroes;
          // cache中删掉被删除的英雄
          dataCache.getHeroes = heroList.filter((hero) => hero.id !== id);
          console.log("AFTER:", heroList);
          proxy.writeQuery({ query: GET_HEROES, data: dataCache });
        },
      }
    ).toPromise();
    return res.data["deleteHero"]
  }
  async addHero(name: string): Promise<Hero> {
    const res = await this.apollo.mutate<any>(
      {
        mutation: ADD_HERO,
        variables: {
          name
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
    const res = await this.apollo.mutate<any>(
      {
        mutation: UPDATE_HERO,
        variables: {
          heroDetail
        }
      }
    ).toPromise();
    return res.data.updateHero;
  }
}