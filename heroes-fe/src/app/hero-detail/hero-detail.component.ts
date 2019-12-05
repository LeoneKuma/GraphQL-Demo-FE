import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../api-gql/output';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroDetailInput } from '../api-gql/output';
import { HeroService } from '../hero.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.styl']
})
export class HeroDetailComponent implements OnInit {
  // hero: Hero;
  hero: Observable<Hero>;
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getHero();
  }
  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.hero = this.heroService.getHero(id);
  }
  goBack(): void {
    this.location.back();
  }
  save({ id, name, description }): void {
    // const heroDetail: HeroDetailInput = { id, name, description };
    // this.heroService.updateHero(heroDetail).then(
    //   () => {
    //     this.goBack();
    //   })
  }


}
