import { Component, OnInit } from '@angular/core';
import { Hero } from '../api-gql/output';
import { HeroService } from '../hero.service';
import { Observable } from 'rxjs'
import { TouchSequence } from '_@types_selenium-webdriver@3.0.16@@types/selenium-webdriver';
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.styl']
})
export class HeroesComponent implements OnInit {
  heroes: Observable<any>;
  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.getHeroes();
  }
  getHeroes(): void {
    this.heroes = this.heroService.getHeroes()
  }
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero(name)
  }
  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).then(res => {
      if (res) {
        alert("删除成功")
        console.log("DONE")
      }
    })
  }
}
