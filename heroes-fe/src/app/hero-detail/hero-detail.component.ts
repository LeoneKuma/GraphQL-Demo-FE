import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroDetailInput } from '../api-gql/output';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.styl']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;
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
    this.heroService.getHero(id).then(
      hero => {
        this.hero = hero;
      }
    )
  }
  goBack(): void {
    this.location.back();
  }
  save(): void {
    const heroDetail: HeroDetailInput = { id: this.hero.id, name: this.hero.name, description: this.hero.description };
    console.log(heroDetail)
    this.heroService.updateHero(heroDetail).then(
      () => {
        this.goBack()
      }
    )
  }

}
